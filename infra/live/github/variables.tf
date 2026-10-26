variable "github_token" {
  description = "Fine-grained PAT on MRdevX/mrashidi.me with Secrets, Variables, Environments and Administration write."
  type        = string
  sensitive   = true
}

variable "github_owner" {
  description = "Owner of the repository and required reviewer of the deploy-gate environment."
  type        = string
  default     = "MRdevX"
}

variable "github_repository" {
  description = "Repository name."
  type        = string
  default     = "mrashidi.me"
}

variable "onepassword_vault" {
  description = "1Password vault shared by the Notable Nomads projects."
  type        = string
  default     = "Notable Nomads"
}

variable "item_title_prefix" {
  description = "Prefix that scopes this project's items in the shared vault: the item for secret X is titled \"<prefix> X\"."
  type        = string
  default     = "mrashidi.me"
}

variable "secret_names" {
  description = "GitHub Actions secrets this root writes, each read from the vault item titled \"<item_title_prefix> <name>\"."
  type        = set(string)
  default = [
    "CLOUDFLARE_API_TOKEN",
    "TF_CLOUDFLARE_API_TOKEN",
    "TF_R2_ACCESS_KEY_ID",
    "TF_R2_SECRET_ACCESS_KEY",
    "TF_VERCEL_API_TOKEN",
    "CONTENT_API_TOKEN",
    "REVALIDATE_SECRET",
  ]
}

variable "actions_variables" {
  description = "Non-secret GitHub Actions variables."
  type        = map(string)
  default = {
    CLOUDFLARE_ACCOUNT_ID = "7a13fd636e452aa1f621cc114645e586"
  }
}
