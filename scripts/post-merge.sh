#!/bin/bash
set -e
pnpm install --frozen-lockfile
pnpm --filter db push

# Surface schema drift loudly so a missing `pnpm --filter db push`
# can't silently break production again (see Task #22 in replit.md).
if ! pnpm --filter db run check-drift; then
  echo ""
  echo "[post-merge] Schema drift detected. The live database does not match"
  echo "[post-merge] lib/db/src/schema/*. Run \`pnpm --filter @workspace/db run push\`"
  echo "[post-merge] to apply the schema, then re-run the post-merge setup."
  exit 1
fi
