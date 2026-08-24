// Vercel serverless entry point for every /api/* route.
//
// Plain .mjs, importing the pre-bundled Express app (built by
// artifacts/api-server/build.mjs into artifacts/api-server/dist/app.mjs).
// This avoids handing app.ts's monorepo TypeScript source straight to
// Vercel's function compiler, which does not resolve the workspace's
// "moduleResolution": "bundler" tsconfig and fails with node16/nodenext
// extension-resolution errors.
//
// A fixed filename routed to via vercel.json's "/api/:match*" rewrite,
// not api/[...path].mjs: Vercel's bracket catch-all convention only
// reliably spread-matches multiple path segments inside Next.js projects.
// For a generic ("Other" framework) project it silently only matched a
// single segment, so every nested route (e.g. /api/newsletter/subscribe)
// 404'd at the platform level without ever reaching this function. The
// explicit rewrite's wildcard IS honored regardless of framework, and
// Vercel preserves the real incoming req.url (not the rewrite
// destination) for classic (req, res) Node.js functions like this one, so
// Express still sees the actual path and routes correctly.
import app from "../artifacts/api-server/dist/app.mjs";

export default (req, res) => app(req, res);
