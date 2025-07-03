FROM maven:3.9.2-eclipse-temurin-17 AS build
WORKDIR /app

COPY mvnw .
COPY .mvn .mvn

COPY pom.xml .

RUN ./mvnw dependency:go-offline -B

COPY src src

EXPOSE 8080

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /backend

COPY --from=build /backend/target/backendtfg-3.4.2.jar backendtfg-3.4.2.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
