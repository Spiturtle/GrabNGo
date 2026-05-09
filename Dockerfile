# Root Dockerfile for Render deployments
# Builds the Spring Boot app located in Backend/lim

FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app

# Copy Maven wrapper and pom first for layer caching
COPY Backend/lim/.mvn/ .mvn
COPY Backend/lim/mvnw Backend/lim/pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

# Copy source and build
COPY Backend/lim/src ./src
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]
