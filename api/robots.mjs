// See api/sitemap.mjs — same rewrite-and-restore shim for /robots.txt.
import app from "../artifacts/api-server/dist/app.mjs";

export default (req, res) => {
  req.url = "/robots.txt";
  return app(req, res);
};
