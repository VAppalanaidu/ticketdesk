# TicketDesk Backend API Service

Spring Boot 3 REST API backend service for TicketDesk IT Support Tracker.

## Features
- Stateless JWT Security with Access Token & Refresh Token rotation
- Database Auto Seeding (`DataInitializer.java`) for `ADMIN`, `SUPPORT_ENGINEER`, and `EMPLOYEE` roles
- Ticket Lifecycle Validation (`OPEN` -> `IN_PROGRESS` -> `RESOLVED` -> `CLOSED`)
- Multipart File Attachments Storage
- Threaded Ticket Comments API
- Dashboard Aggregation Analytics API

## Prerequisites
- Java 21+
- Maven 3.9+
- MySQL 8.0+

## Quickstart
```bash
# Create Database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS ticketdesk_db;"

# Build and Run
mvn clean install
mvn spring-boot:run
```

API URL: `http://localhost:8080/api/v1`
Swagger Docs: `http://localhost:8080/api/v1/swagger-ui.html`

## Default Seeded Credentials
- **Admin**: `admin@ticketdesk.com` / `admin` | `TicketDesk@123`
- **Support Engineer**: `support@ticketdesk.com` / `support` | `TicketDesk@123`
- **Employee**: `employee@ticketdesk.com` / `employee` | `TicketDesk@123`