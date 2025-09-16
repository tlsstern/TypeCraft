# Stage 1: Build the application
FROM gradle:jdk17 AS build
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle build --no-daemon

# Stage 2: Create the final image
FROM openjdk:17-jdk-slim
EXPOSE 8080
ADD /home/gradle/src/build/libs/TypeCraftBackend-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]