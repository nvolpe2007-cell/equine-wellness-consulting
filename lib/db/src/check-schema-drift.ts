import { readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import pg from "pg";
import { is } from "drizzle-orm";
import { getTableConfig, PgTable } from "drizzle-orm/pg-core";

// Dynamically load every module under ./schema/ so newly added schema
// files are checked automatically without editing this script.
async function loadAllSchemaTables(): Promise<PgTable[]> {
  const schemaDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "schema");
  const files = readdirSync(schemaDir).filter(
    (f) => (f.endsWith(".ts") || f.endsWith(".js") || f.endsWith(".mjs")) && f !== "index.ts",
  );
  const tables: PgTable[] = [];
  for (const file of files) {
    const mod = (await import(pathToFileURL(path.join(schemaDir, file)).href)) as Record<
      string,
      unknown
    >;
    for (const value of Object.values(mod)) {
      if (is(value as object, PgTable)) {
        tables.push(value as PgTable);
      }
    }
  }
  return tables;
}

type DbColumn = {
  data_type: string;
  udt_name: string;
  is_nullable: "YES" | "NO";
  character_maximum_length: number | null;
};

type Drift = {
  table: string;
  kind: "missing_table" | "missing_column" | "type_mismatch" | "nullability_mismatch";
  column?: string;
  expected?: string;
  actual?: string;
};

function normalizeType(sqlName: string): string {
  // Drizzle's getSQLType() returns things like "varchar(64)", "timestamp with time zone",
  // "integer", "text", "serial". Normalize for comparison against information_schema.
  const lower = sqlName.toLowerCase();
  if (lower === "serial") return "integer";
  if (lower.startsWith("varchar")) return "character varying";
  if (lower === "timestamp") return "timestamp without time zone";
  if (lower.startsWith("timestamp with time zone")) return "timestamp with time zone";
  return lower;
}

async function fetchLiveColumns(pool: pg.Pool, tableName: string): Promise<Map<string, DbColumn>> {
  const { rows } = await pool.query<{
    column_name: string;
    data_type: string;
    udt_name: string;
    is_nullable: "YES" | "NO";
    character_maximum_length: number | null;
  }>(
    `SELECT column_name, data_type, udt_name, is_nullable, character_maximum_length
       FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1`,
    [tableName],
  );
  const map = new Map<string, DbColumn>();
  for (const r of rows) {
    map.set(r.column_name, {
      data_type: r.data_type,
      udt_name: r.udt_name,
      is_nullable: r.is_nullable,
      character_maximum_length: r.character_maximum_length,
    });
  }
  return map;
}

async function tableExists(pool: pg.Pool, tableName: string): Promise<boolean> {
  const { rows } = await pool.query<{ exists: boolean }>(
    `SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
         WHERE table_schema = 'public' AND table_name = $1
     ) AS exists`,
    [tableName],
  );
  return rows[0]?.exists ?? false;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("[schema-drift] DATABASE_URL is not set; cannot check drift.");
    process.exit(2);
  }

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const drifts: Drift[] = [];

  try {
    const tables = await loadAllSchemaTables();
    if (tables.length === 0) {
      console.error(
        "[schema-drift] No Drizzle tables discovered under lib/db/src/schema/. Refusing to report OK.",
      );
      process.exit(2);
    }

    for (const table of tables) {
      const cfg = getTableConfig(table);
      const tableName = cfg.name;

      if (!(await tableExists(pool, tableName))) {
        drifts.push({ table: tableName, kind: "missing_table" });
        continue;
      }

      const live = await fetchLiveColumns(pool, tableName);

      for (const col of cfg.columns) {
        const liveCol = live.get(col.name);
        if (!liveCol) {
          drifts.push({
            table: tableName,
            kind: "missing_column",
            column: col.name,
            expected: col.getSQLType(),
          });
          continue;
        }

        const expectedType = normalizeType(col.getSQLType());
        const actualType = liveCol.data_type;
        if (expectedType !== actualType) {
          drifts.push({
            table: tableName,
            kind: "type_mismatch",
            column: col.name,
            expected: `${col.getSQLType()} (${expectedType})`,
            actual: actualType,
          });
        }

        const expectedNullable = !col.notNull;
        const actualNullable = liveCol.is_nullable === "YES";
        if (expectedNullable !== actualNullable) {
          drifts.push({
            table: tableName,
            kind: "nullability_mismatch",
            column: col.name,
            expected: expectedNullable ? "NULL" : "NOT NULL",
            actual: actualNullable ? "NULL" : "NOT NULL",
          });
        }
      }
    }
  } finally {
    await pool.end();
  }

  if (drifts.length === 0) {
    console.log("[schema-drift] OK — live database matches lib/db/src/schema/*");
    return;
  }

  console.error("");
  console.error("[schema-drift] WARNING — live database differs from declared schema:");
  console.error("");
  for (const d of drifts) {
    if (d.kind === "missing_table") {
      console.error(`  - table "${d.table}" is missing from the live database`);
    } else if (d.kind === "missing_column") {
      console.error(
        `  - "${d.table}"."${d.column}" is missing in the live DB (expected ${d.expected})`,
      );
    } else if (d.kind === "type_mismatch") {
      console.error(
        `  - "${d.table}"."${d.column}" type mismatch: expected ${d.expected}, live has ${d.actual}`,
      );
    } else {
      console.error(
        `  - "${d.table}"."${d.column}" nullability mismatch: expected ${d.expected}, live is ${d.actual}`,
      );
    }
  }
  console.error("");
  console.error(
    "[schema-drift] Run `pnpm --filter @workspace/db run push` to apply the schema, then re-run this check.",
  );
  process.exit(1);
}

main().catch((err) => {
  console.error("[schema-drift] check failed:", err);
  process.exit(2);
});
