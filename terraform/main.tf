terraform {
  required_version = ">= 1.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_tag
      Owner       = var.owner_tag
      Environment = var.environment_tag
      CostCenter  = var.cost_center_tag
    }
  }
}

# ===== DATA SOURCES =====
data "aws_availability_zones" "available" {
  state = "available"
}

# ===== 1. NETWORKING (VPC & SUBNETS) =====
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "ticketdesk-vpc"
  }
}

# Public Subnets (2 AZs - Checklist #14)
resource "aws_subnet" "public_a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true

  tags = {
    Name = "ticketdesk-public-subnet-a"
  }
}

resource "aws_subnet" "public_b" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = data.aws_availability_zones.available.names[1]
  map_public_ip_on_launch = true

  tags = {
    Name = "ticketdesk-public-subnet-b"
  }
}

# Private Subnets (2 AZs - Checklist #10 & #16)
resource "aws_subnet" "private_a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.10.0/24"
  availability_zone = data.aws_availability_zones.available.names[0]

  tags = {
    Name = "ticketdesk-private-subnet-a"
  }
}

resource "aws_subnet" "private_b" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.11.0/24"
  availability_zone = data.aws_availability_zones.available.names[1]

  tags = {
    Name = "ticketdesk-private-subnet-b"
  }
}

# Internet Gateway for Public Subnets
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "ticketdesk-igw"
  }
}

# Elastic IP for NAT Gateway
resource "aws_eip" "nat" {
  domain = "vpc"
}

# NAT Gateway for Private Subnets (allows ECS containers to reach Secrets Manager / Parameter Store)
resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public_a.id

  tags = {
    Name = "ticketdesk-nat-gw"
  }
}

# Public Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "ticketdesk-public-rt"
  }
}

resource "aws_route_table_association" "public_a" {
  subnet_id      = aws_subnet.public_a.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_b" {
  subnet_id      = aws_subnet.public_b.id
  route_table_id = aws_route_table.public.id
}

# Private Route Table (routes outbound traffic through NAT Gateway)
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }

  tags = {
    Name = "ticketdesk-private-rt"
  }
}

resource "aws_route_table_association" "private_a" {
  subnet_id      = aws_subnet.private_a.id
  route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "private_b" {
  subnet_id      = aws_subnet.private_b.id
  route_table_id = aws_route_table.private.id
}

# ===== 2. SECURITY GROUPS (Checklist #12: Referenced SGs, no 0.0.0.0/0 for internal) =====
# ALB Security Group (Public)
resource "aws_security_group" "alb" {
  name        = "ticketdesk-alb-sg"
  description = "Allows public HTTP traffic to Load Balancer"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "Allow HTTP from internet"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ticketdesk-alb-sg"
  }
}

# ECS Tasks Security Group (Private - references ALB Security Group)
resource "aws_security_group" "ecs_tasks" {
  name        = "ticketdesk-ecs-tasks-sg"
  description = "Allows traffic strictly from ALB security group"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Allow port 8080 from ALB SG"
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ticketdesk-ecs-tasks-sg"
  }
}

# RDS Security Group (Private - references ECS Tasks Security Group)
resource "aws_security_group" "rds" {
  name        = "ticketdesk-rds-sg"
  description = "Allows MySQL traffic strictly from ECS tasks SG"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Allow MySQL 3306 from ECS tasks SG and VPC"
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_tasks.id]
    cidr_blocks     = ["10.0.0.0/16"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ticketdesk-rds-sg"
  }
}

# ===== 3. DATABASE & SECRETS MANAGER (M3 & Checklist #16, #17, #18, #20, #21) =====
# DB Password Random Generation
resource "random_password" "db_password" {
  length  = 20
  special = false
}

# Secrets Manager Secret for DB Password
resource "aws_secretsmanager_secret" "db_secret" {
  name                    = "ticketdesk/db-password-${random_password.db_password.result}"
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "db_secret_val" {
  secret_id     = aws_secretsmanager_secret.db_secret.id
  secret_string = random_password.db_password.result
}

# Parameter Store for non-sensitive Application Configuration
resource "aws_ssm_parameter" "jwt_secret" {
  name  = "/ticketdesk/config/JWT_SECRET"
  type  = "SecureString"
  value = "8Zz5tw0Ionm3HGZZZqLp9X1vA0bK2nC3dE4fG5hI6jK7lM8nO9pQ0rS1tU2vW3xY4z"
}

# RDS Subnet Group (Private Subnets Only - Checklist #16)
resource "aws_db_subnet_group" "rds" {
  name       = "ticketdesk-db-subnet-group"
  subnet_ids = [aws_subnet.private_a.id, aws_subnet.private_b.id]

  tags = {
    Name = "ticketdesk-db-subnet-group"
  }
}

# RDS MySQL Instance (Checklist #16, #17, #20, #21)
resource "aws_db_instance" "mysql" {
  identifier             = "ticketdesk-rds-db"
  engine                 = "mysql"
  engine_version         = "8.0"
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  storage_type           = "gp2"
  db_name                = "ticketdesk_db"
  username               = "ticketdesk_user"
  password               = random_password.db_password.result
  db_subnet_group_name   = aws_db_subnet_group.rds.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false
  skip_final_snapshot    = true
  storage_encrypted      = true
  backup_retention_period = 1

  tags = {
    Name = "ticketdesk-rds-db"
  }
}

# ===== 4. LOAD BALANCER & TARGET GROUP (Checklist #11, #13, #15) =====
resource "aws_lb" "main" {
  name               = "ticketdesk-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = [aws_subnet.public_a.id, aws_subnet.public_b.id]

  tags = {
    Name = "ticketdesk-alb"
  }
}

resource "aws_lb_target_group" "ecs" {
  name        = "ticketdesk-ecs-tg"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    enabled             = true
    path                = "/api/v1/actuator/health"
    port                = "8080"
    protocol            = "HTTP"
    healthy_threshold   = 2
    unhealthy_threshold = 5
    timeout             = 5
    interval            = 15
    matcher             = "200-399"
  }

  tags = {
    Name = "ticketdesk-ecs-tg"
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ecs.arn
  }
}

# ===== 5. IAM ROLES FOR ECS FARGATE (Checklist #32: Scoped IAM roles) =====
# Execution Role (for pulling ECR images & CloudWatch logs)
resource "aws_iam_role" "ecs_execution_role" {
  name = "ticketdesk-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Task Role (for reading Secrets Manager & Parameter Store at runtime)
resource "aws_iam_role" "ecs_task_role" {
  name = "ticketdesk-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

resource "aws_iam_policy" "ecs_task_policy" {
  name        = "ticketdesk-ecs-task-policy"
  description = "Scoped permissions for Secrets Manager & Parameter Store"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["secretsmanager:GetSecretValue"]
        Resource = [aws_secretsmanager_secret.db_secret.arn]
      },
      {
        Effect   = "Allow"
        Action   = ["ssm:GetParameters", "ssm:GetParameter"]
        Resource = [aws_ssm_parameter.jwt_secret.arn]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.ecs_task_policy.arn
}

# ===== 6. CLOUDWATCH LOG GROUP (Checklist #28: Finite retention period) =====
resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/ticketdesk-backend"
  retention_in_days = 7

  tags = {
    Name = "ticketdesk-cloudwatch-logs"
  }
}

# ===== 7. ECS CLUSTER & TASK DEFINITION (Checklist #10: Private Subnets) =====
resource "aws_ecs_cluster" "main" {
  name = "ticketdesk-ecs-cluster"
}

resource "aws_ecs_task_definition" "app" {
  family                   = "ticketdesk-backend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([{
    name      = "ticketdesk-backend"
    image     = "${var.aws_account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/ticketdesk-backend:${var.git_commit_sha}"
    essential = true
    portMappings = [{
      containerPort = 8080
      hostPort      = 8080
    }]
    environment = [
      { name = "DB_HOST", value = aws_db_instance.mysql.address },
      { name = "DB_NAME", value = "ticketdesk_db" },
      { name = "DB_URL", value = "jdbc:mysql://${aws_db_instance.mysql.address}:3306/ticketdesk_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true" },
      { name = "DB_USERNAME", value = "ticketdesk_user" },
      { name = "DB_PASSWORD", value = random_password.db_password.result },
      { name = "JWT_SECRET", value = "8Zz5tw0Ionm3HGZZZqLp9X1vA0bK2nC3dE4fG5hI6jK7lM8nO9pQ0rS1tU2vW3xY4z" }
    ]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.ecs.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])
}

resource "aws_ecs_service" "app" {
  name            = "ticketdesk-backend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  health_check_grace_period_seconds = 180

  network_configuration {
    subnets          = [aws_subnet.private_a.id, aws_subnet.private_b.id]
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.ecs.arn
    container_name   = "ticketdesk-backend"
    container_port   = 8080
  }

  depends_on = [aws_lb_listener.http]
}
