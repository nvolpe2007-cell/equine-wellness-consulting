// Vercel serverless entry point for every /api/* route.
//
// Plain .mjs, importing the pre-bundled Express app (built by
// artifacts/api-server/build.mjs into artifacts/api-server/dist/app.mjs).
// This avoids handing app.ts's monorepo TypeScript source straight to
// Vercel's function compiler, which does not resolve the workspace's
// "moduleResolution": "bundler" tsconfig and fails with node16/nodenext
// extension-resolution errors.
//
// A catch-all rather than api/index + a rewrite, because a rewrite hands the
// function the destination path (/api/index), while the Express app mounts
// its router at "/api" and needs the real req.url to match routes.
import app from "../artifacts/api-server/dist/app.mjs";

export default (req, res) => app(req, res);
