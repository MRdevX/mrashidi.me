variable "cloudflare_api_token" {
  description = "Cloudflare API token: D1 edit, Workers Scripts edit (for custom domains), DNS and Workers Routes edit on mrashidi.me."
  type        = string
  sensitive   = true
}

variable "vercel_api_token" {
  description = "Vercel API token scoped to the notablenomads team."
  type        = string
  sensitive   = true
}

variable "content_api_token" {
  description = "Bearer token for every /v1 route; the same value is the Worker secret CONTENT_API_TOKEN."
  type        = string
  sensitive   = true
}

variable "revalidate_secret" {
  description = "Shared secret the seed script sends to the web app's revalidate route."
  type        = string
  sensitive   = true
}

variable "account_id" {
  description = "Cloudflare account ID."
  type        = string
  default     = "7a13fd636e452aa1f621cc114645e586"
}

variable "zone_id" {
  description = "Zone ID of mrashidi.me."
  type        = string
  default     = "e4e27fbd7bfea8bd87ea5094e8373279"
}

variable "workers_subdomain" {
  description = "The account's workers.dev subdomain (Workers & Pages, Your subdomain), without .workers.dev. Vercel reaches the API there because free-plan Bot Fight Mode on the zone cannot exempt it."
  type        = string
  default     = "safeman612"
}

variable "vercel_team_id" {
  description = "Vercel team that owns the site project."
  type        = string
  default     = "team_bCKuRe2AM8cqq2m3iFfobtkX"
}

variable "api_worker_deployed" {
  description = "Whether the mrashidi-api Worker exists. A custom domain can only point at a deployed Worker, so the very first apply runs with false, before the first wrangler deploy."
  type        = bool
  default     = true
}
