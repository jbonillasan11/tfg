FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY /app/target/backendtfg-3.4.2.jar backendtfg-3.4.2.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
