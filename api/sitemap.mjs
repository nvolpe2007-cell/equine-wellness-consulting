// /sitemap.xml is served by the Express app (it's DB-driven), but lives at
// the site root rather than under /api. Vercel functions only exist under
// /api, so vercel.json rewrites /sitemap.xml here and this shim restores the
// path the Express router actually matches on.
import app from "../artifacts/api-server/dist/app.mjs";

export default (req, res) => {
  req.url = "/sitemap.xml";
  return app(req, res);
};
