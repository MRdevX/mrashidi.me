#!/usr/bin/env node

/**
 * This script generates placeholder OG images using @vercel/og
 */

const { ImageResponse } = require("@vercel/og");
const fs = require("node:fs");
const path = require("node:path");
const React = require("react");

try {
  require("@vercel/og");
} catch (_error) {
  console.log("❌ @vercel/og package not found. Installing...");
  console.log("Run: npm install @vercel/og");
  console.log("Or: yarn add @vercel/og");
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

async function generateOGImage(config) {
  try {
    const imageResponse = new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
          backgroundImage: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
          position: "relative",
        }}
      >
        {/* Background accent shapes */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "200px",
            height: "200px",
            background: "linear-gradient(135deg, #ff5f1f 0%, #ff5f1f20 100%)",
            clipPath: "polygon(100% 0%, 0% 0%, 100% 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "200px",
            height: "200px",
            background: "linear-gradient(135deg, #ff5f1f 0%, #ff5f1f20 100%)",
            clipPath: "polygon(0% 100%, 0% 0%, 100% 100%)",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            zIndex: 1,
          }}
        >
          {/* Title */}
          <h1
            style={{
              fontSize: "64px",
              fontWeight: "bold",
              color: "#ffffff",
              margin: "0 0 20px 0",
              textShadow: "0 0 20px rgba(255, 95, 31, 0.5)",
            }}
          >
            {config.title}
          </h1>

          {/* Subtitle */}
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "600",
              color: "#ff5f1f",
              margin: "0 0 20px 0",
            }}
          >
            {config.subtitle}
          </h2>

          {/* Description */}
          <p
            style={{
              fontSize: "24px",
              color: "#cccccc",
              margin: "0 0 40px 0",
              maxWidth: "800px",
              lineHeight: "1.4",
            }}
          >
            {config.description}
          </p>

          {/* Website URL */}
          <div
            style={{
              fontSize: "18px",
              color: "#888888",
              border: "2px solid #ff5f1f",
              padding: "12px 24px",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 95, 31, 0.1)",
            }}
          >
            mrashidi.me
          </div>
        </div>

        {/* Border accent */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            right: "20px",
            bottom: "20px",
            border: "4px solid #ff5f1f",
            borderRadius: "12px",
            opacity: 0.3,
          }}
        />
      </div>,
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
  console.log("npm install @vercel/og");
  console.log("Or: yarn add @vercel/og");
}
