variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "ap-south-1"
}

variable "aws_account_id" {
  description = "AWS Account ID for ECR registry URI"
  type        = string
  default     = "420151437872"
}

variable "git_commit_sha" {
  description = "Git commit SHA tag for ECR image"
  type        = string
  default     = "b0854f0"
}

variable "project_tag" {
  type    = string
  default = "TicketDesk"
}

variable "owner_tag" {
  type    = string
  default = "Appala"
}

variable "environment_tag" {
  type    = string
  default = "Production"
}

variable "cost_center_tag" {
  type    = string
  default = "Training-Capstone"
}
