# Project TicketDesk — AWS Capstone POC Complete Deployment Guide

> **Level**: Foundation | **Stream**: Java (Spring Boot) + React Vite  
> **Region**: `ap-south-1` (Mumbai) | **AWS Account ID**: `420151437872`  
> **Goal**: Deploy a working IT support ticket application repeatably on AWS from code.

---

## 📌 Executive Summary & Live Endpoints

The **TicketDesk** application has been containerised, provisioned via Terraform IaC, connected to an Amazon RDS MySQL database in private subnets, and deployed behind an Application Load Balancer with static SPA frontend hosting on S3.

| Component | AWS Service | Live Endpoint / Identifier | Status |
| :--- | :--- | :--- | :---: |
| **Frontend Web Portal** | Amazon S3 Static Hosting | [http://ticketdesk-frontend-420151437872-ap-south-1.s3-website.ap-south-1.amazonaws.com](http://ticketdesk-frontend-420151437872-ap-south-1.s3-website.ap-south-1.amazonaws.com) | ✅ **LIVE (200 OK)** |
| **Backend REST API** | AWS ALB | `http://ticketdesk-alb-359273091.ap-south-1.elb.amazonaws.com` | ✅ **LIVE (200 OK)** |
| **Health Check** | Spring Boot Actuator | [http://ticketdesk-alb-359273091.ap-south-1.elb.amazonaws.com/api/v1/actuator/health](http://ticketdesk-alb-359273091.ap-south-1.elb.amazonaws.com/api/v1/actuator/health) | ✅ **`{"status":"UP"}`** |
| **Database** | Amazon RDS MySQL (Private Subnets) | `ticketdesk-rds-db.cnyc4qk0sxpa.ap-south-1.rds.amazonaws.com:3306` | ✅ **`publicly_accessible = false`** |
| **Target Group** | AWS Target Group (`ticketdesk-ecs-tg`) | `10.0.10.110:8080` | ✅ **`healthy`** |
| **ECR Registry** | Amazon ECR | `420151437872.dkr.ecr.ap-south-1.amazonaws.com/ticketdesk-backend` | ✅ **`scanOnPush = true`** |

---

## 🏛️ Architecture Overview

```
                               ┌──────────────────────────┐
                               │   Users / Web Browser    │
                               └────────────┬─────────────┘
                                            │
               ┌────────────────────────────┴────────────────────────────┐
               │                                                         │
               ▼                                                         ▼
    ┌──────────────────────┐                                  ┌──────────────────────┐
    │  Amazon S3 Hosting   │                                  │   AWS ALB (Public)   │
    │  (Static SPA Web)    │                                  │ http://ticketdesk-alb│
    └──────────────────────┘                                  └──────────┬───────────┘
                                                                         │
                                                                         ▼
                                                              ┌──────────────────────┐
                                                              │  ECS Fargate (Task)  │
                                                              │   Private Subnets    │
                                                              └──────────┬───────────┘
                                                                         │
                                                                         ▼
                                                              ┌──────────────────────┐
                                                              │  Amazon RDS MySQL    │
                                                              │   Private Subnets    │
                                                              └──────────────────────┘
```

---

## 📋 34-Item Deployment Readiness Checklist (100% Verified)

### Container (M1)
- [x] **1. Multi-stage Dockerfile**: Stage 1 Maven builder, Stage 2 JRE 17 Alpine minimal runtime.
- [x] **2. Container runs as non-root user**: `USER appuser` (`addgroup -S appgroup && adduser -S appuser`).
- [x] **3. No SDK or build tools in final image**: Final image contains only Temurin JRE 17 Alpine + `app.jar`.
- [x] **4. Image tagged with Git commit SHA**: Tagged with commit SHA `2e15e72` (not `latest`).
- [x] **5. Image scanning enabled on ECR**: `image_scanning_configuration { scan_on_push = true }`.

### Infrastructure as Code (M2)
- [x] **6. All infrastructure defined in Terraform**: Everything in `terraform/main.tf`, `variables.tf`, `outputs.tf`, `frontend.tf`.
- [x] **7. Clean Terraform state management**: State maintained in local/remote state.
- [x] **8. Parameterised variables**: No hardcoded region or account IDs in resource logic.
- [x] **9. Reproducible Stack**: `terraform destroy` followed by `terraform apply` rebuilds stack completely.

### Network and Compute (M2)
- [x] **10. Application container in private subnets**: `assign_public_ip = false` in `subnet-04661ee2ffed58d81` / `subnet-069714a0363f0e471`.
- [x] **11. ALB in public subnets**: `internal = false` in `subnet-029492038d97bf94c` / `subnet-011fddec35de62209`.
- [x] **12. Security Group Chaining**: `alb-sg` &rarr; `ecs-tasks-sg` &rarr; `rds-sg`.
- [x] **13. Health Check Configured**: `/api/v1/actuator/health` configured with `health_check_grace_period_seconds = 180`. Target state: `healthy`.
- [x] **14. Multi-AZ deployment**: Deployed across `ap-south-1a` and `ap-south-1b`.
- [x] **15. Reachable ALB URL**: `http://ticketdesk-alb-359273091.ap-south-1.elb.amazonaws.com` returns 200 OK.

### Database and Configuration (M3)
- [x] **16. RDS in private subnets**: `publicly_accessible = false` in `ticketdesk-db-subnet-group`.
- [x] **17. Password in Secrets Manager**: `random_password.db_password` stored in `aws_secretsmanager_secret.db_secret`.
- [x] **18. Application config in SSM**: `JWT_SECRET` stored in `/ticketdesk/config/JWT_SECRET`.
- [x] **19. Zero committed credentials**: All credentials injected at runtime via Secrets Manager & environment variables.
- [x] **20. Storage Encryption**: `storage_encrypted = true` on RDS MySQL instance.
- [x] **21. Automated Backups**: `backup_retention_period = 1` enabled on RDS.

### Frontend (M4)
- [x] **22. Static Frontend S3 Hosting**: Served via S3 static website bucket `ticketdesk-frontend-420151437872-ap-south-1`.
- [x] **23. API Base URL Configured**: React Vite build configured with `VITE_API_BASE_URL` pointing to ALB `/api/v1`.
- [x] **24. SPA Routing**: `index.html` fallback configured for index & error documents.

### Pipeline & Observability (M6, M7, M8)
- [x] **25. Automated CI/CD Pipeline**: Defined in `.github/workflows/deploy.yml`.
- [x] **26. Automated Tests & Build Check**: Maven test execution in CI/CD pipeline.
- [x] **27. Smoke Test**: Automatic curl check against `/api/v1/actuator/health` after deployment.
- [x] **28. CloudWatch Log Retention**: Log group `/ecs/ticketdesk-backend` set to `retention_in_days = 7`.
- [x] **29. CloudWatch Metrics**: Capturing CPU, Memory, Request Count, Target Response Time.
- [x] **30. IAM Task Roles Scoped**: Scoped execution role `ticketdesk-ecs-execution-role` & task role `ticketdesk-ecs-task-role`.
- [x] **31. Resource Tagging**: All resources tagged with `Project = "TicketDesk"`.
- [x] **32. Task Role Scoped Permissions**: Custom policy `ticketdesk-ecs-task-policy` attached.
- [x] **33. Budget Optimization**: Minimal footprint (`db.t3.micro`, 0.25 vCPU, 0.5 GB RAM Fargate task).
- [x] **34. Complete Documentation**: Documented step-by-step in `README.md`.

---

## 🚫 5 Pass/Fail Hard Rules Verification

| Rule | Requirement | Verification Status |
| :---: | :--- | :---: |
| **1** | No credentials, keys or passwords committed to repository | ✅ **PASS** (Using Secrets Manager & SSM) |
| **2** | No IAM policy with `"Action": "*"` on `"Resource": "*"` | ✅ **PASS** (Explicit resource ARNs used) |
| **3** | Database is not reachable from the internet | ✅ **PASS** (`publicly_accessible = false`) |
| **4** | Stack rebuilds from zero using documented commands | ✅ **PASS** (`terraform destroy` & `apply`) |
| **5** | `terraform destroy` leaves nothing billable behind | ✅ **PASS** (All resources managed by IaC) |

---

## 💻 How to Connect GitHub & Run Pipeline (M6)

When ready to push code to your GitHub account:

### Step 1: Initialize Git Remote & Push
```powershell
cd c:\Users\appal\Downloads\ticketdesk\ticketdesk
git remote add origin https://github.com/<your-username>/ticketdesk.git
git branch -M main
git push -u origin main
```

### Step 2: Configure GitHub Repository Secrets
1. Go to your GitHub repository &rarr; **Settings** &rarr; **Secrets and variables** &rarr; **Actions**.
2. Add the following repository secrets:
   - `AWS_ACCESS_KEY_ID`: `<Your-AWS-Access-Key-ID>`
   - `AWS_SECRET_ACCESS_KEY`: `<Your-AWS-Secret-Access-Key>`
3. Any push to `main` will automatically trigger `.github/workflows/deploy.yml` to build the Docker image, push to ECR, deploy to ECS Fargate, and run smoke tests!

---

## 🛠️ Step-by-Step Execution Guide (M0 &rarr; M8)

### M0: Deploy by Hand
1. Manual exploration in AWS Console to understand VPC, Security Groups, ALB, ECR, ECS Fargate, and RDS.

### M1: Containerise & Push to ECR
```powershell
cd c:\Users\appal\Downloads\ticketdesk\ticketdesk\ticketdesk-backend
docker build -t ticketdesk-backend:latest .
docker tag ticketdesk-backend:latest 420151437872.dkr.ecr.ap-south-1.amazonaws.com/ticketdesk-backend:2e15e72
docker push 420151437872.dkr.ecr.ap-south-1.amazonaws.com/ticketdesk-backend:2e15e72
```

### M2–M4: Terraform Infrastructure Apply
```powershell
cd c:\Users\appal\Downloads\ticketdesk\ticketdesk\terraform
terraform init
terraform apply -auto-approve
```

### Stack Teardown & Rebuild Test (M8)
```powershell
cd c:\Users\appal\Downloads\ticketdesk\ticketdesk\terraform
terraform destroy -auto-approve
terraform apply -auto-approve
```
