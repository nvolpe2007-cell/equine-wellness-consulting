// See api/sitemap.ts — same rewrite-and-restore shim for /robots.txt.
import type { IncomingMessage, ServerResponse } from "http";
import app from "../artifacts/api-server/src/app";

export default (req: IncomingMessage, res: ServerResponse) => {
  req.url = "/robots.txt";
  return (app as unknown as (r: IncomingMessage, s: ServerResponse) => void)(req, res);
};
