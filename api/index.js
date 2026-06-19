// Vercel serverless entry point (JS to bypass TypeScript type-check)
const { default: app } = require('../artifacts/api-server/src/app');
module.exports = app;
