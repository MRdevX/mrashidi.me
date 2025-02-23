import { writeFileSync } from "fs";
import { globby } from "globby";
import prettier from "prettier";

async function generate() {
  const prettierConfig = await prettier.resolveConfig("./.prettierrc");
  const pages = await globby([
    "src/app/**/page.tsx",
    "!src/app/api",
    "!src/app/**/not-found.tsx",
    "!src/app/**/error.tsx",
    "!src/app/**/loading.tsx",
  ]);

  const baseUrl = "https://mrashidi.me";

  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map((page) => {
          const path = page.replace("src/app", "").replace("/page.tsx", "").replace("/index", "");
          const route = path === "" ? "" : path;

          return `
            <url>
              <loc>${baseUrl}${route}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>daily</changefreq>
              <priority>${route === "" ? "1.0" : "0.8"}</priority>
            </url>
          `;
        })
        .join("")}
    </urlset>
  `;

  const formatted = await prettier.format(sitemap, {
    ...prettierConfig,
    parser: "html",
  });

  writeFileSync("public/sitemap.xml", formatted);
}

// Execute the generate function
generate()
  .then(() => {
    console.log("Sitemap generated successfully!");
  })
  .catch((error) => {
    console.error("Failed to generate sitemap:", error);
    process.exit(1);
  });
