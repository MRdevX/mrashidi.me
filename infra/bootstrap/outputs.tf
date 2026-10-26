output "state_bucket_name" {
  description = "R2 bucket referenced by each live root's backend.tf."
  value       = cloudflare_r2_bucket.state.name
}

output "state_backend_endpoint" {
  description = "S3-compatible endpoint for the backend blocks."
  value       = "https://${var.account_id}.r2.cloudflarestorage.com"
}
