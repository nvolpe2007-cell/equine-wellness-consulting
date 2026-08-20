// /sitemap.xml is served by the Express app (it is DB-driven — it lists generated
// posts), but it lives at the site root rather than under /api. Vercel functions
// only exist under /api, so vercel.json rewrites /sitemap.xml here and this shim
// restores the path the Express router actually matches on.
import type { IncomingMessage, ServerResponse } from "http";
import app from "../artifacts/api-server/src/app";

export default (req: IncomingMessage, res: ServerResponse) => {
  req.url = "/sitemap.xml";
  return (app as unknown as (r: IncomingMessage, s: ServerResponse) => void)(req, res);
};
