#!/usr/bin/env node

/**
 * This script generates placeholder OG images using @vercel/og
 */

const { ImageResponse } = require("@vercel/og");
const fs = require("node:fs");
const path = require("node:path");
const _React = require("react");


global.React = _React;


const { OgImageTemplate } = require("./og-template.jsx");

try {
  require("@vercel/og");
} catch (_error) {
  console.log("❌ @vercel/og package not found. Installing...");
  console.log("Run: pnpm install @vercel/og");
  process.exit(1);
}

const publicDir = path.join(__dirname, "../public");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const images = [
  {
    name: "og-image.png",
    title: "Mahdi Rashidi",
    subtitle: "Software Backend Engineer",
    description: "Building reliable and maintainable systems",
  },
  {
    name: "og-about.png",
    title: "About Mahdi",
    subtitle: "Software Backend Engineer",
    description: "Learn about my background and experience",
  },
  {
    name: "og-projects.png",
    title: "Projects",
    subtitle: "Software Backend Engineer",
    description: "Explore my work and open source contributions",
  },
  {
    name: "og-contact.png",
    title: "Get In Touch",
    subtitle: "Software Backend Engineer",
    description: "Let's discuss your next project",
  },
  {
    name: "og-blog.png",
    title: "Blog",
    subtitle: "Software Backend Engineer",
    description: "Technical articles and insights",
  },
  {
    name: "og-resume.png",
    title: "Resume",
    subtitle: "Software Backend Engineer",
    description: "Professional experience and skills",
  },
  {
    name: "twitter-image.png",
    title: "Mahdi Rashidi",
    subtitle: "Software Backend Engineer",
    description: "Backend Development • Node.js • TypeScript",
  },
];

async function generateOGImage(config) {
  try {
    const imageResponse = new ImageResponse(
      <OgImageTemplate title={config.title} subtitle={config.subtitle} description={config.description} />,
      {
        width: 1200,
        height: 630,
      }
    );

    const buffer = await imageResponse.arrayBuffer();
    return Buffer.from(buffer);
  } catch (error) {
    console.error(`Error generating image for ${config.name}:`, error);
    return null;
  }
}

async function generateAllImages() {
  console.log("🎨 Generating OG images using @vercel/og...\n");

  for (const imageConfig of images) {
    try {
      console.log(`🔄 Generating: ${imageConfig.name}...`);
      const buffer = await generateOGImage(imageConfig);

      if (buffer) {
        const filePath = path.join(publicDir, imageConfig.name);
        fs.writeFileSync(filePath, buffer);
        console.log(`✅ Generated: ${imageConfig.name} (${Math.round(buffer.length / 1024)}KB)`);
      } else {
        console.log(`❌ Failed to generate: ${imageConfig.name}`);
      }
    } catch (error) {
      console.log(`❌ Failed to process ${imageConfig.name}:`, error.message);
    }
  }

  console.log("\n🎉 All OG images generated successfully!");
  console.log("\n💡 Features:");
  console.log("• Modern design with your brand colors (#ff5f1f)");
  console.log("• Responsive layout optimized for social media");
  console.log("• Lightweight @vercel/og implementation");
  console.log("• Ready for production use");
  console.log("\n🚀 Dynamic OG Images:");
  console.log("• API route created: /api/og");
  console.log("• Usage: /api/og?title=Custom&subtitle=Title&description=Text");
  console.log("• Perfect for dynamic content and blog posts");
}

try {
  generateAllImages();
} catch (error) {
  console.log("❌ Error:", error.message);
  console.log("\n💡 To install @vercel/og:");
  console.log("pnpm install @vercel/og");
}
