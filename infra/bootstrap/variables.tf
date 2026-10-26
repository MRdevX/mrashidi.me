variable "cloudflare_api_token" {
  description = "Cloudflare API token with R2 write on the account."
  type        = string
  sensitive   = true
}

variable "account_id" {
  description = "Cloudflare account ID."
  type        = string
  default     = "7a13fd636e452aa1f621cc114645e586"
}

variable "state_bucket_name" {
  description = "R2 bucket that stores Terraform state for every live root."
  type        = string
  default     = "mrashidi-tf-state"
}
