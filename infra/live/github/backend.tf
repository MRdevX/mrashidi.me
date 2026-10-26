terraform {
  backend "s3" {
    bucket = "mrashidi-tf-state"
    key    = "github/terraform.tfstate"

    endpoints = {
      s3 = "https://7a13fd636e452aa1f621cc114645e586.r2.cloudflarestorage.com"
    }

    # R2 speaks S3 but is not AWS: skip every AWS-only check and use path-style URLs.
    region                      = "auto"
    skip_credentials_validation = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_metadata_api_check     = true
    skip_s3_checksum            = true
    use_path_style              = true
    use_lockfile                = true
  }
}
