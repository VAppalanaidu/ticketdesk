# 📘 TicketDesk AWS Deployment: Master Technical Guide

This document explains the complete, end-to-end deployment process of the **TicketDesk** application (Spring Boot Backend + React Vite Frontend + MySQL Database) on AWS from start to finish.

---

## 1. ⚡ Simple Flow of the Entire Deployment

### 🌐 A. End-User Traffic Flow (How a User Uses the App)
```
[ User Browser ]
       │
       ├─────────────────────────► [ Amazon S3 Website ]
       │                           (Downloads React Frontend SPA)
       │
       ▼
[ ALB Load Balancer ] ◄── (Port 80 HTTP Public Subnet)
       │
       ▼
[ ECS Fargate Container ] ◄── (Port 8080 Spring Boot API Private Subnet)
       │
       ▼
[ RDS MySQL Database ] ◄── (Port 3306 MySQL Private Subnet)
```

1. The user opens the **S3 Static Website URL** in their browser to load the React user interface.
2. When the user logs in or creates a ticket, the frontend sends HTTP API requests to the **AWS Application Load Balancer (ALB)**.
3. The **ALB** forwards requests across public subnets to the **Spring Boot API container running in private subnets on ECS Fargate**.
4. The **Spring Boot API container** securely communicates with the **Amazon RDS MySQL Database** located inside private subnets to read or save data.

---

### 🔄 B. Automated CI/CD Pipeline Flow (How Code Reaches AWS)
```
[ Developer Local Machine ]
       │ (git push origin main)
       ▼
[ GitHub Repository ]
       │ (Triggers GitHub Actions)
       ▼
[ GitHub Actions Runner ]
       ├── 1. Runs Maven unit tests (`mvn test`)
       ├── 2. Builds Docker image (`docker build`)
       ├── 3. Authenticates with AWS ECR (`aws ecr get-login-password`)
       ├── 4. Pushes image tagged with Git SHA (`docker push`)
       └── 5. Triggers ECS Fargate deployment (`aws ecs update-service`)
       │
       ▼
[ AWS ECS Fargate Cluster ]
       └── Replaces old task with new container revision (Zero Downtime)
```

---

## 2. 🧰 Tools & AWS Services Used (And Their Purpose)

| Tool / Service | Category | Purpose & Why It Was Used |
| :--- | :--- | :--- |
| **Docker** | Containerisation | Packages the Spring Boot Java API and Java 17 runtime into a lightweight, portable container image. |
| **Amazon ECR** | Container Registry | Secure private Docker image repository on AWS to store, version, and scan container images (`scanOnPush = true`). |
| **Terraform** | Infrastructure as Code (IaC) | Automatically creates, configures, and manages all AWS resources repeatably using code instead of manual console clicks. |
| **AWS VPC** | Networking | Creates an isolated virtual private network (`10.0.0.0/16`) for all application resources. |
| **Public Subnets** | Networking | Subnets connected to the Internet Gateway that host public-facing resources like the Load Balancer. |
| **Private Subnets** | Networking | Isolated subnets with no direct internet access that safely host the application containers and database. |
| **AWS NAT Gateway** | Networking | Allows private subnet containers to send outbound requests (e.g. pulling images or dependencies) without exposing them to incoming internet traffic. |
| **AWS ALB (Application Load Balancer)** | Traffic Distribution | Accepts incoming public HTTP requests on port 80 and evenly distributes traffic to healthy backend containers. |
| **AWS ECS Fargate** | Serverless Compute | Runs Docker containers in private subnets without requiring you to manage EC2 virtual servers or operating system patches. |
| **Amazon RDS (MySQL)** | Managed Database | Fully managed MySQL database (`db.t3.micro`) placed in private subnets for persistent ticket storage. |
| **AWS Secrets Manager** | Security | Automatically generates and securely stores the RDS database administrator password. |
| **AWS SSM Parameter Store** | Configuration | Securely stores non-changing configuration settings like `JWT_SECRET`. |
| **Amazon S3** | Static Web Hosting | Stores and serves the built static frontend files (`index.html`, JavaScript, CSS) as a fast web portal. |
| **GitHub Actions** | CI/CD Automation | Automatically runs tests, builds Docker images, pushes to ECR, and deploys updates to ECS whenever code is pushed to GitHub. |
| **Amazon CloudWatch** | Observability | Collects application logs (`/ecs/ticketdesk-backend`) with a 7-day retention period for debugging and health monitoring. |

---

## 3. 📝 Step-by-Step Detailed Deployment Process

### Phase 1: Containerising the Backend API (Milestone M1)
1. **Multi-Stage Dockerfile Setup**: We created a 2-stage Dockerfile:
   - **Stage 1 (Builder)**: Uses `maven:3.9.6-eclipse-temurin-17` to compile Java source code into a runnable JAR file (`app.jar`).
   - **Stage 2 (Runtime)**: Copies *only* the compiled `app.jar` into a lightweight `eclipse-temurin:17-jre-alpine` runtime image. This eliminates compilers and build tools from the final container.
2. **Non-Root User Security**: We created an unprivileged user `appuser` (`USER appuser`) to run the application, preventing container breakout security risks.
3. **ECR Repository Creation**: We created an ECR repository `ticketdesk-backend` in region `ap-south-1` with vulnerability scanning enabled on image push.

### Phase 2: Building AWS Infrastructure using Terraform (Milestone M2)
1. **VPC & Subnet Topology**:
   - Created a custom VPC (`10.0.0.0/16`).
   - Created **2 Public Subnets** across two Availability Zones (`ap-south-1a`, `ap-south-1b`).
   - Created **2 Private Subnets** across two Availability Zones (`ap-south-1a`, `ap-south-1b`).
   - Attached an **Internet Gateway** to public subnets and a **NAT Gateway** with an Elastic IP to private subnets.
2. **Security Group Chaining**:
   - **`alb-sg`**: Accepts HTTP traffic on port 80 from anywhere (`0.0.0.0/0`).
   - **`ecs-tasks-sg`**: Accepts HTTP traffic on port 8080 *only* from `alb-sg`.
   - **`rds-sg`**: Accepts MySQL traffic on port 3306 *only* from `ecs-tasks-sg` and private VPC CIDR (`10.0.0.0/16`).
3. **Load Balancer & Target Group Setup**:
   - Created an Application Load Balancer (`ticketdesk-alb`) in public subnets.
   - Configured a Target Group (`ticketdesk-ecs-tg`) pointing to target port 8080 with health check path `/api/v1/actuator/health`.

### Phase 3: Provisioning Database & Secrets (Milestone M3)
1. **Private RDS MySQL Instance**: Provisioned MySQL (`db.t3.micro`) inside a private DB subnet group with `publicly_accessible = false` and `storage_encrypted = true`.
2. **Secrets Manager Integration**: Configured Terraform `random_password` to generate a database password and store it in AWS Secrets Manager.
3. **SSM Parameter Store**: Saved the JWT secret string under `/ticketdesk/config/JWT_SECRET`.
4. **ECS Task Execution Role**: Attached IAM policies allowing ECS tasks to pull database credentials and parameter values at runtime.

### Phase 4: Backend Container Deployment on ECS Fargate (Milestone M3 & M7)
1. **Task Definition**: Configured Fargate Task Definition (0.25 vCPU, 512 MB RAM) injecting database connection strings (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`) as environment variables.
2. **Health Check Grace Period**: Added `health_check_grace_period_seconds = 180` to the ECS service so Fargate gives Spring Boot up to 3 minutes to complete Hibernate table creation on RDS before running health checks.
3. **Spring Boot Actuator & CORS Fix**:
   - Enabled Spring Boot Actuator health endpoint (`/api/v1/actuator/health`).
   - Configured `CorsConfigurationSource` in `SecurityConfig.java` to explicitly permit requests from the S3 static website frontend URL.

### Phase 5: Deploying the Frontend Portal (Milestone M4)
1. **Frontend SPA Compilation**: Built the React Vite application (`npm run build`) with `VITE_API_BASE_URL` pointing to the public ALB URL (`http://ticketdesk-alb-359273091.ap-south-1.elb.amazonaws.com/api/v1`).
2. **S3 Static Website Hosting**: Created an S3 bucket `ticketdesk-frontend-420151437872-ap-south-1`, enabled static website hosting with `index.html` fallback, and uploaded the `dist/` production assets.

### Phase 6: Automating CI/CD with GitHub Actions (Milestone M6)
1. **Workflow Configuration**: Created `.github/workflows/deploy.yml` triggered on push to `main`.
2. **Automated Pipeline Steps**:
   - Compiles and runs backend unit tests (`mvn test`).
   - Builds the Docker image locally on the GitHub runner.
   - Logs into AWS ECR using GitHub Secrets (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`).
   - Pushes the image tagged with the Git Commit SHA (`b0854f0`).
   - Executes `aws ecs update-service --force-new-deployment` to update Fargate.
   - Runs an automated curl smoke test against `/api/v1/actuator/health`.

---

## 4. 🧠 Key Technical Concepts Explained Simply

### 1. Multi-Stage Docker Builds
- **What it is**: Using multiple `FROM` instructions in a single Dockerfile.
- **Why it matters**: Stage 1 downloads Maven and compiles the code. Stage 2 copies *only* the compiled JAR file into a clean JRE image. This keeps the final container lightweight (~200MB vs ~800MB) and secure.

### 2. Public vs. Private Subnets
- **Public Subnet**: Connected directly to the internet via an Internet Gateway. Used for the Load Balancer so external web browsers can connect.
- **Private Subnet**: Has no direct route to the internet. Used for ECS Fargate containers and RDS MySQL database so external hackers cannot access them directly.

### 3. Security Group Chaining
- Instead of using IP addresses, Security Groups reference other Security Groups.
- Example: The database Security Group rule says *"Only allow incoming traffic on port 3306 if it comes from servers attached to `ecs-tasks-sg`"*.

### 4. Health Check Grace Period
- **Problem**: When Spring Boot starts up, it connects to RDS, initializes connection pools, and updates database tables. This takes 30–45 seconds. If the Load Balancer checks health immediately, it receives no response and kills the container.
- **Solution**: `health_check_grace_period_seconds = 180` tells AWS ECS to ignore failed health checks for the first 3 minutes while the container is booting up.

### 5. CORS (Cross-Origin Resource Sharing)
- **Problem**: Browsers block a website on Domain A (`s3-website.amazonaws.com`) from sending background API requests to Domain B (`elb.amazonaws.com`) unless Domain B explicitly gives permission.
- **Solution**: Configured Spring Security's `CorsConfigurationSource` to send `Access-Control-Allow-Origin` headers matching the S3 website frontend URL.

---

## 🚀 Live Demo Summary & Access Links

- 🌐 **Frontend Web Portal**: [http://ticketdesk-frontend-420151437872-ap-south-1.s3-website.ap-south-1.amazonaws.com](http://ticketdesk-frontend-420151437872-ap-south-1.s3-website.ap-south-1.amazonaws.com)
- ⚡ **Backend REST API**: `http://ticketdesk-alb-359273091.ap-south-1.elb.amazonaws.com`
- 💚 **Actuator Health Check**: [http://ticketdesk-alb-359273091.ap-south-1.elb.amazonaws.com/api/v1/actuator/health](http://ticketdesk-alb-359273091.ap-south-1.elb.amazonaws.com/api/v1/actuator/health)
- 📁 **GitHub Repository**: [https://github.com/VAppalanaidu/ticketdesk](https://github.com/VAppalanaidu/ticketdesk)
