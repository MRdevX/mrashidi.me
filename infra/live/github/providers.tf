provider "github" {
  token = var.github_token
  owner = var.github_owner
}

# Desktop-app sign-in: set OP_ACCOUNT=my.1password.com and approve the prompt in 1Password.
provider "onepassword" {}
