data "onepassword_item" "secrets" {
  for_each = var.secret_names

  vault = var.onepassword_vault
  title = each.value
}

locals {
  # Items may store the value as a password, an API credential or a secure note.
  secret_values = {
    for name in var.secret_names : name => try(
      coalesce(
        try(data.onepassword_item.secrets[name].password, null),
        try(data.onepassword_item.secrets[name].credential, null),
        try(data.onepassword_item.secrets[name].note_value, null),
      ),
      null,
    )
  }

  # Only the secret names are unmasked, never the values.
  unusable_secrets = sort([
    for name, value in local.secret_values : name
    if try(nonsensitive(value == null || upper(value) == "REPLACE_ME"), true)
  ])
}

# Fails the plan, naming the items, instead of publishing an empty or placeholder secret.
resource "terraform_data" "onepassword_guard" {
  input = local.unusable_secrets

  lifecycle {
    precondition {
      condition     = length(local.unusable_secrets) == 0
      error_message = "1Password vault \"${var.onepassword_vault}\" has empty or REPLACE_ME items: ${join(", ", local.unusable_secrets)}."
    }
  }
}

resource "github_actions_secret" "this" {
  for_each = var.secret_names

  repository  = var.github_repository
  secret_name = each.key
  value       = local.secret_values[each.key]

  depends_on = [terraform_data.onepassword_guard]
}

resource "github_actions_variable" "this" {
  for_each = var.actions_variables

  repository    = var.github_repository
  variable_name = each.key
  value         = each.value
}

data "github_user" "owner" {
  username = var.github_owner
}

resource "github_repository_environment" "production" {
  repository  = var.github_repository
  environment = "production"

  reviewers {
    users = [data.github_user.owner.id]
  }

  deployment_branch_policy {
    protected_branches     = true
    custom_branch_policies = false
  }
}
