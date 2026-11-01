terraform {
  # Shared R2 settings: init with -backend-config=../../backend.r2.hcl.
  backend "s3" {
    key = "production/terraform.tfstate"
  }
}
