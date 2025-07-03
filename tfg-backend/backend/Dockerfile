FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY target/backendtfg-3.4.2.jar backendtfg.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
