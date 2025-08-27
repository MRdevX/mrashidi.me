#!/usr/bin/env node

/**
 * This script generates placeholder OG images using Node.js Canvas
 * Install canvas: npm install canvas
 *
 * Note: This is a basic implementation. For production, consider using:
 * - https://og-image.vercel.app/
 * - https://www.canva.com/
 * - https://www.figma.com/
 */

const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

try {
  require("canvas");
} catch (_error) {
  console.log("❌ Canvas package not found. Installing...");
  console.log("Run: npm install canvas");
  console.log("Or: yarn add canvas");
  process.exit(1);
}

const publicDir = path.join(__dirname, "../public");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const images = [
  {
    name: "og-image.jpg",
    title: "Mahdi Rashidi",
    subtitle: "Software Backend Engineer",
    description: "Building reliable and maintainable systems",
  },
  {
    name: "og-about.jpg",
    title: "About Mahdi",
    subtitle: "Software Backend Engineer",
    description: "Learn about my background and experience",
  },
  {
    name: "og-projects.jpg",
    title: "Projects",
    subtitle: "Software Backend Engineer",
    description: "Explore my work and open source contributions",
  },
  {
    name: "og-contact.jpg",
    title: "Get In Touch",
    subtitle: "Software Backend Engineer",
    description: "Let's discuss your next project",
  },
  {
    name: "og-blog.jpg",
    title: "Blog",
    subtitle: "Software Backend Engineer",
    description: "Technical articles and insights",
  },
  {
    name: "og-resume.jpg",
    title: "Resume",
    subtitle: "Software Backend Engineer",
    description: "Professional experience and skills",
  },
  {
    name: "twitter-image.jpg",
    title: "Mahdi Rashidi",
    subtitle: "Software Backend Engineer",
    description: "Backend Development • Node.js • TypeScript",
  },
];

function generateOGImage(config) {
  const width = 1200;
  const height = 630;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#000000");
  gradient.addColorStop(1, "#1a1a1a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#f97316";
  ctx.globalAlpha = 0.1;

  ctx.beginPath();
  ctx.moveTo(width, 0);
  ctx.lineTo(width - 200, 0);
  ctx.lineTo(width, 200);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(200, height);
  ctx.lineTo(0, height - 200);
  ctx.closePath();
  ctx.fill();

  ctx.globalAlpha = 1;

  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";

  ctx.font = "bold 64px Arial";
  ctx.fillText(config.title, width / 2, height / 2 - 80);

  ctx.font = "32px Arial";
  ctx.fillStyle = "#f97316";
  ctx.fillText(config.subtitle, width / 2, height / 2 - 20);

  ctx.font = "24px Arial";
  ctx.fillStyle = "#cccccc";
  ctx.fillText(config.description, width / 2, height / 2 + 40);

  ctx.font = "18px Arial";
  ctx.fillStyle = "#888888";
  ctx.fillText("mrashidi.me", width / 2, height - 40);

  ctx.strokeStyle = "#f97316";
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  return canvas;
}

async function generateAllImages() {
  console.log("🎨 Generating placeholder OG images...\n");

  for (const imageConfig of images) {
    try {
      const canvas = generateOGImage(imageConfig);
      const buffer = canvas.toBuffer("image/jpeg", { quality: 0.9 });
      const filePath = path.join(publicDir, imageConfig.name);

      fs.writeFileSync(filePath, buffer);
      console.log(`✅ Generated: ${imageConfig.name}`);
    } catch (error) {
      console.log(`❌ Failed to generate ${imageConfig.name}:`, error.message);
    }
  }

  console.log("\n🎉 All placeholder images generated!");
  console.log("\n💡 Next steps:");
  console.log("1. Replace these placeholders with professional designs");
  console.log("2. Use your actual profile photo");
  console.log("3. Add your brand colors and styling");
  console.log("4. Consider using design tools like Canva or Figma");
}

try {
  generateAllImages();
} catch (error) {
  console.log("❌ Error:", error.message);
  console.log("\n💡 To install canvas:");
  console.log("npm install canvas");
  console.log("Or: yarn add canvas");
}
