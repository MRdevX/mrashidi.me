#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import { join } from "node:path";

const ZONE_ID = "e4e27fbd7bfea8bd87ea5094e8373279";
const ZONE_NAME = "mrashidi.me";
// Owned by a Worker or an R2 bucket custom domain, which create and delete their own DNS records.
const CUSTOM_DOMAIN_HOSTS = new Set(["api.mrashidi.me", "s3.mrashidi.me"]);

const token = process.env.TF_VAR_cloudflare_api_token ?? process.env.CLOUDFLARE_API_TOKEN;
if (!token) {
  console.error("Set TF_VAR_cloudflare_api_token (Zone DNS Read on mrashidi.me).");
  process.exit(1);
}

async function listRecords() {
  const records = [];
  for (let page = 1; ; page += 1) {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records?per_page=100&page=${page}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const body = await res.json();
    if (!body.success) {
      throw new Error(`Cloudflare API failed: ${JSON.stringify(body.errors)}`);
    }
    records.push(...body.result);
    if (body.result.length < 100) {
      return records;
    }
  }
}

function slugFor(record) {
  const short = record.name === ZONE_NAME ? "apex" : record.name.slice(0, -(ZONE_NAME.length + 1));
  return `${record.type}_${short}_${record.id.slice(0, 8)}`
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_|_$/g, "");
}

const dnsRecords = {};
const imports = [];
for (const record of await listRecords()) {
  if (CUSTOM_DOMAIN_HOSTS.has(record.name) || record.meta?.read_only) {
    console.log(`skip ${record.type} ${record.name} (custom domain)`);
    continue;
  }
  const key = slugFor(record);
  dnsRecords[key] = {
    name: record.name,
    type: record.type,
    content: record.content,
    ttl: record.ttl,
    proxied: record.proxied,
    ...(record.priority != null ? { priority: record.priority } : {}),
    ...(record.comment ? { comment: record.comment } : {}),
  };
  imports.push(`import {\n  to = cloudflare_dns_record.this["${key}"]\n  id = "${ZONE_ID}/${record.id}"\n}\n`);
}

const globalRoot = join(import.meta.dirname, "..", "live", "global");
await writeFile(
  join(globalRoot, "dns_records.auto.tfvars.json"),
  `${JSON.stringify({ dns_records: dnsRecords }, null, 2)}\n`
);
await writeFile(join(globalRoot, "imports.tf"), `${imports.join("\n")}`);
console.log(`Wrote ${imports.length} records. Review the diff, then plan: it must show only imports.`);
