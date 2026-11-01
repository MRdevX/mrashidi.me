terraform {
  # Shared R2 settings: init with -backend-config=../../backend.r2.hcl.
  backend "s3" {
    key = "github/terraform.tfstate"
  }
}
