# syntax=docker/dockerfile:1

FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /workspace
COPY pom.xml .
RUN --mount=type=cache,target=/root/.m2 mvn -B -q dependency:go-offline
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn -B -q -Dmaven.test.skip=true package \
    && cp target/atendix-*.jar /workspace/app.jar

FROM eclipse-temurin:25-jre-alpine
RUN addgroup -S atendix && adduser -S atendix -G atendix
WORKDIR /app
COPY --from=build /workspace/app.jar app.jar
USER atendix
EXPOSE 8080
# Without a configured secret each start signs tokens with a fresh random key,
# so a restart only ends the open sessions instead of refusing to boot.
ENTRYPOINT ["sh", "-c", "if [ -z \"$JWT_SECRET\" ]; then JWT_SECRET=$(head -c 48 /dev/urandom | base64 | tr -d '\\n'); export JWT_SECRET; echo 'JWT_SECRET not set: using a random key generated for this run'; fi; exec java -jar /app/app.jar"]
