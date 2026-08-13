# Multi-stage Dockerfile for TicketDesk Spring Boot Backend
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create non-root user and pre-create uploads & logs directories with appuser ownership
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && mkdir -p /app/uploads /app/logs && chown -R appuser:appgroup /app/uploads /app/logs /app

# Copy compiled JAR from builder stage and assign ownership
COPY --from=builder --chown=appuser:appgroup /app/target/ticketdesk-1.0.0.jar app.jar

# Switch to non-root user (Checklist #2)
USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
