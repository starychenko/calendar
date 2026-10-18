#!/usr/bin/env node

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

const sizes = [
  { size: 192, name: "icon-192.png" },
  { size: 512, name: "icon-512.png" },
];

async function generateIcons() {
  console.log("🎨 Генерація PWA іконок...\n");

  try {
    // Читаємо SVG файл
    const svgPath = join(projectRoot, "app", "icon.svg");
    const svgBuffer = readFileSync(svgPath);

    // Генеруємо іконки різних розмірів
    for (const { size, name } of sizes) {
      const outputPath = join(projectRoot, "public", name);

      await sharp(svgBuffer)
        .resize(size, size, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toFile(outputPath);

      console.log(`✅ Створено: public/${name} (${size}x${size})`);
    }

    console.log("\n🎉 Всі іконки успішно згенеровані!");
    console.log(
      "\nІконки для manifest згенеровано. Офлайн-режим не реалізовано.",
    );
  } catch (error) {
    console.error("❌ Помилка при генерації іконок:", error.message);
    process.exit(1);
  }
}

generateIcons();
