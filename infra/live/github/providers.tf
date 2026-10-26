provider "github" {
  token = var.github_token
  owner = var.github_owner
}

# Reads OP_SERVICE_ACCOUNT_TOKEN from the environment.
provider "onepassword" {}
