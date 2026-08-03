#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const index = path.join(dist, "client", "index.html");
const worker = path.join(root, "worker", "index.js");
const hosting = path.join(root, ".openai", "hosting.json");
const deployedMedia = new Set([
  "all-scenarios-case-study-opt.jpg",
  "data-visualization-case-study-opt.jpg",
  "featured-01-all-scenarios.jpg",
  "featured-02-data-screen.jpg",
  "featured-03-monitoring-app-0803.jpg",
  "figma-hero-opt.jpg",
  "figma-work-01.png",
  "figma-work-02.png",
  "figma-work-03.png",
  "figma-work-04.png",
  "figma-work-05.png",
  "figma-work-06.png",
  "figma-work-07.png",
  "figma-work-08.png",
  "huaban-qrcode.png",
  "icon-motion-access.mp4",
  "icon-motion-environment.mp4",
  "icon-motion-inspection.mp4",
  "icon-motion-robot.mp4",
  "icon-motion-surveillance.mp4",
  "monitoring-app-case-study-0803.png",
  "profile-portrait-crop.png",
  "publication-design-spread.png",
  "publication-design-covers.png",
  "wechat-qrcode.png",
  "zc-qrcode.png",
]);

for (const file of [index, worker, hosting]) {
  if (!existsSync(file)) throw new Error("Missing Sites build input: " + file);
}

mkdirSync(path.join(dist, "server"), { recursive: true });
mkdirSync(path.join(dist, ".openai"), { recursive: true });
copyFileSync(worker, path.join(dist, "server", "index.js"));
copyFileSync(hosting, path.join(dist, ".openai", "hosting.json"));

// Vite copies the entire public folder. Keep original source artwork locally,
// but exclude unused raw exports from the deploy bundle.
const mediaDir = path.join(dist, "client", "media");
for (const filename of readdirSync(mediaDir)) {
  if (!deployedMedia.has(filename)) rmSync(path.join(mediaDir, filename));
}

console.log("Prepared optimized Sites build: dist/server/index.js and dist/.openai/hosting.json");
