# ===== MILESTONE 4: FRONTEND S3 BUCKET (STATIC WEBSITE HOSTING) =====

# 1. S3 Bucket for Static Frontend (Checklist #22)
resource "aws_s3_bucket" "frontend" {
  bucket        = "ticketdesk-frontend-${var.aws_account_id}-${var.aws_region}"
  force_destroy = true

  tags = {
    Name = "ticketdesk-frontend-bucket"
  }
}

# Static Website Hosting Configuration
resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

# S3 Bucket Public Access Configuration for Static Hosting
resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# S3 Bucket Read Policy
resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.frontend.arn}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.frontend]
}

# Output Static Frontend Website URL
output "frontend_website_url" {
  description = "S3 Static Website URL for Frontend SPA"
  value       = "http://${aws_s3_bucket_website_configuration.frontend.website_endpoint}"
}
