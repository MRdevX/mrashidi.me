output "d1_database_id" {
  description = "Goes into apps/api/wrangler.toml as the DB binding's database_id."
  value       = cloudflare_d1_database.content.id
}

output "api_url" {
  description = "Public URL of the content API."
  value       = "https://${local.api_hostname}"
}
