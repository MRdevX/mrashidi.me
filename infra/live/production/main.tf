locals {
  api_hostname = "api.mrashidi.me"
}

resource "cloudflare_d1_database" "content" {
  account_id            = var.account_id
  name                  = "mrashidi-db"
  primary_location_hint = "weur"

  lifecycle {
    prevent_destroy = true
  }
}

resource "cloudflare_workers_custom_domain" "api" {
  count = var.api_worker_deployed ? 1 : 0

  account_id = var.account_id
  zone_id    = var.zone_id
  hostname   = local.api_hostname
  service    = "mrashidi-api"
}

resource "vercel_project" "web" {
  name           = "mrashidi-me"
  framework      = "nextjs"
  root_directory = "apps/web"
  node_version   = "24.x"

  git_repository = {
    type = "github"
    repo = "MRdevX/mrashidi.me"
  }

  vercel_authentication = {
    deployment_type = "standard_protection"
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "vercel_project_domain" "apex" {
  project_id = vercel_project.web.id
  domain     = "mrashidi.me"
}

resource "vercel_project_domain" "www" {
  project_id = vercel_project.web.id
  domain     = "www.mrashidi.me"
}

resource "vercel_project_environment_variable" "content_api_url" {
  project_id = vercel_project.web.id
  key        = "CONTENT_API_URL"
  value      = "https://${local.api_hostname}"
  target     = ["production", "preview", "development"]
  sensitive  = false
}

resource "vercel_project_environment_variable" "content_api_token" {
  project_id = vercel_project.web.id
  key        = "CONTENT_API_TOKEN"
  value      = var.content_api_token
  target     = ["production", "preview"]
  sensitive  = true
}

resource "vercel_project_environment_variable" "revalidate_secret" {
  project_id = vercel_project.web.id
  key        = "REVALIDATE_SECRET"
  value      = var.revalidate_secret
  target     = ["production", "preview"]
  sensitive  = true
}
