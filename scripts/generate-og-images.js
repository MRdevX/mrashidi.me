#!/usr/bin/env node

/**
 * This script generates Open Graph images for social media sharing
 * You'll need to create these images manually or use a service like:
 * - https://og-image.vercel.app/
 * - https://www.canva.com/
 * - https://www.figma.com/
 *
 * Recommended dimensions: 1200x630px
 *
 * Required images:
 * - /public/og-image.jpg (main site)
 * - /public/og-about.jpg
 * - /public/og-projects.jpg
 * - /public/og-contact.jpg
 * - /public/og-blog.jpg
 * - /public/og-resume.jpg
 * - /public/twitter-image.jpg
 */

const fs = require("node:fs");
const path = require("node:path");

const requiredImages = [
  "og-image.jpg",
  "og-about.jpg",
  "og-projects.jpg",
  "og-contact.jpg",
  "og-blog.jpg",
  "og-resume.jpg",
  "twitter-image.jpg",
];

const publicDir = path.join(__dirname, "../public");

console.log("🔍 Checking for required OG images...\n");

const missingImages = [];

requiredImages.forEach((image) => {
  const imagePath = path.join(publicDir, image);
  if (!fs.existsSync(imagePath)) {
    missingImages.push(image);
    console.log(`❌ Missing: ${image}`);
  } else {
    console.log(`✅ Found: ${image}`);
  }
});

if (missingImages.length > 0) {
  console.log("\n📝 To create these images:");
  console.log("1. Use a design tool like Canva, Figma, or Photoshop");
  console.log("2. Create images with dimensions 1200x630px");
  console.log("3. Include your name, title, and relevant branding");
  console.log("4. Save as JPG format in the /public directory");
  console.log("\n🎨 Design suggestions:");
  console.log("- Use your brand colors (orange #f97316)");
  console.log("- Include your profile photo");
  console.log("- Add relevant icons for each page type");
  console.log("- Keep text readable and minimal");
  console.log("\n🔗 Online tools:");
  console.log("- https://og-image.vercel.app/");
  console.log("- https://www.canva.com/");
  console.log("- https://www.figma.com/");
} else {
  console.log("\n🎉 All OG images are present!");
}

console.log("\n📋 Image checklist:");
requiredImages.forEach((image) => {
  const status = fs.existsSync(path.join(publicDir, image)) ? "✅" : "❌";
  console.log(`${status} ${image}`);
});
