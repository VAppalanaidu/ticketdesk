output "alb_dns_name" {
  description = "Public DNS of the Application Load Balancer"
  value       = aws_lb.main.dns_name
}

output "application_url" {
  description = "Live Load Balancer HTTP URL"
  value       = "http://${aws_lb.main.dns_name}"
}

output "rds_address" {
  description = "Private Subnet RDS Endpoint"
  value       = aws_db_instance.mysql.address
}

output "ecr_image_uri" {
  description = "ECR Image URI with Git Commit SHA tag"
  value       = "${var.aws_account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/ticketdesk-backend:${var.git_commit_sha}"
}
