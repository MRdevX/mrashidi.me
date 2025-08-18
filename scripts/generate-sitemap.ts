import { writeFile } from "node:fs/promises";
import fg from "fast-glob";
import prettier from "prettier";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface PrettierConfig {
  parser: string;
  [key: string]: unknown;
}

async function generate(): Promise<void> {
  const prettierConfig = (await prettier.resolveConfig(resolve(__dirname, "../.prettierrc.js"))) as PrettierConfig;

  const pages = await fg(
    ["src/app/**/page.tsx", "!src/app/api/**/*", "!src/app/error.tsx", "!src/app/loading.tsx", "!src/app/not-found.tsx"],
    {
      cwd: resolve(__dirname, ".."),
      absolute: false,
    }
  );

  const baseUrl = "https://mrashidi.me";
  const currentDate = new Date().toISOString();

  const pageConfig = {
    "": { priority: "1.0", changefreq: "weekly" },
    "/about": { priority: "0.8", changefreq: "monthly" },
    "/projects": { priority: "0.9", changefreq: "weekly" },
    "/blog": { priority: "0.8", changefreq: "daily" },
    "/contact": { priority: "0.7", changefreq: "monthly" },
    "/resume": { priority: "0.8", changefreq: "monthly" },
  };

  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map((page) => {
          const path = page.replace("src/app", "").replace("/page.tsx", "").replace(/\/\(/g, "/").replace(/\)/g, "");
          const route = path === "/index" ? "" : path;
          const config = pageConfig[route as keyof typeof pageConfig] || { priority: "0.6", changefreq: "monthly" };

          return `
            <url>
              <loc>${baseUrl}${route}</loc>
              <lastmod>${currentDate}</lastmod>
              <changefreq>${config.changefreq}</changefreq>
              <priority>${config.priority}</priority>
            </url>
          `;
        })
        .join("")}
    </urlset>
  `;

  try {
    const formatted = await prettier.format(sitemap, {
      ...prettierConfig,
      parser: "html",
    });

    await writeFile(resolve(__dirname, "../public/sitemap.xml"), formatted);
    console.log("✅ Enhanced sitemap generated successfully!");
  } catch (error) {
    console.error("❌ Error generating sitemap:", error);
    throw error;
  }
}

generate().catch((error: Error) => {
  console.error("❌ Error generating sitemap:", error);
  process.exit(1);
});
