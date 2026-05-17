import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(fileURLToPath(import.meta.url), "../../..");
const videoPath = resolve(repoRoot, "attached_assets/barn-door-intro-web.mp4");
const posterPath = resolve(
  repoRoot,
  "attached_assets/barn-door-intro-first-frame.jpg",
);

if (!existsSync(videoPath)) {
  console.error(`[extract-video-poster] Video not found: ${videoPath}`);
  process.exit(1);
}

console.log("[extract-video-poster] Extracting frame at t=0.5s from video...");

execFileSync(
  "ffmpeg",
  [
    "-y",
    "-loglevel", "error",
    "-ss", "0.5",
    "-i", videoPath,
    "-vframes", "1",
    "-q:v", "2",
    "-update", "1",
    posterPath,
  ],
  { stdio: "inherit" },
);

console.log(`[extract-video-poster] Poster written to ${posterPath}`);
