output "dns_record_count" {
  description = "Number of DNS records Terraform manages in the zone."
  value       = length(cloudflare_dns_record.this)
}
