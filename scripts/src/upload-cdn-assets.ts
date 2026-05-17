import { Storage } from "@google-cloud/storage";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "../../");

const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
if (!bucketId) {
  console.error("DEFAULT_OBJECT_STORAGE_BUCKET_ID is not set");
  process.exit(1);
}

const storage = new Storage();
const bucket = storage.bucket(bucketId);

async function uploadPublic(localPath: string, destName: string, contentType: string) {
  const file = bucket.file(destName);
  const contents = readFileSync(localPath);
  await file.save(contents, {
    metadata: { contentType, cacheControl: "public, max-age=31536000, immutable" },
    public: true,
  });
  const publicUrl = `https://storage.googleapis.com/${bucketId}/${destName}`;
  console.log(`Uploaded ${destName} → ${publicUrl}`);
  return publicUrl;
}

const videoUrl = await uploadPublic(
  resolve(root, "attached_assets/barn-door-intro-web.mp4"),
  "barn-door-intro-web.mp4",
  "video/mp4",
);

const posterUrl = await uploadPublic(
  resolve(root, "attached_assets/barn-door-intro-first-frame.jpg"),
  "barn-door-intro-first-frame.jpg",
  "image/jpeg",
);

console.log("\nCDN URLs:");
console.log("VIDEO =", videoUrl);
console.log("POSTER =", posterUrl);
