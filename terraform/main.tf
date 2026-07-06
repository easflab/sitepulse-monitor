terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "pulse-monitor-rg"
  location = "brazilsouth"
}

resource "azurerm_static_web_app" "app" {
  name                = "pulse-monitor"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku_size            = "Free"
  sku_tier            = "Free"

  # Integração com GitHub
  github_action_configuration {
    repo_url     = "https://github.com/easflab/sitepulse-monitor"
    branch       = "main"
    output_location = "/"
  }
}

output "static_web_app_url" {
  value = azurerm_static_web_app.app.default_host_name
}