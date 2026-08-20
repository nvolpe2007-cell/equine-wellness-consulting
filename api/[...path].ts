// Vercel serverless entry point for every /api/* route.
//
// Replaces the previous api/index.js, which did
//   require('../artifacts/api-server/src/app')
// That could never work at runtime: the target is app.ts, an ESM TypeScript
// module, and a CommonJS require() can neither resolve the .ts extension nor
// execute TypeScript — every request threw MODULE_NOT_FOUND.
//
// This is a catch-all rather than api/index.ts + a rewrite because a rewrite
// hands the function the destination path (/api/index), while the Express app
// mounts its router at "/api". Matching the function directly preserves req.url.
import type { IncomingMessage, ServerResponse } from "http";
import app from "../artifacts/api-server/src/app";

export default (req: IncomingMessage, res: ServerResponse) =>
  (app as unknown as (r: IncomingMessage, s: ServerResponse) => void)(req, res);
