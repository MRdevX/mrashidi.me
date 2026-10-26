output "managed_secrets" {
  description = "Names of the GitHub Actions secrets this root manages."
  value       = sort(tolist(var.secret_names))
}
