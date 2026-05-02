#!/usr/bin/env bash
set -euo pipefail

CMD="${1:-}"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

CURRENT_USER="$(id -u):$(id -g)"
# HOME=/tmp: the host user has no home dir inside the container
NODE_USER_ARGS=(--user "${CURRENT_USER}" -e HOME=/tmp)
# Maven repo is mounted to /tmp/.m2 which is writable by any user
MAVEN_USER_ARGS=(--user "${CURRENT_USER}" -e HOME=/tmp
  -e MAVEN_OPTS="-Dmaven.repo.local=/tmp/.m2/repository"
  -v "${HOME}/.m2:/tmp/.m2")

case "$CMD" in
  devLocal)
    CURRENT_UID="$(id -u)" CURRENT_GID="$(id -g)" \
      docker compose -f "${PROJECT_ROOT}/tooling/compose.local.yml" up
    ;;
  frontend:devInt)
    docker run --rm -it \
      "${NODE_USER_ARGS[@]}" \
      --network host \
      -v "${PROJECT_ROOT}/frontend:/app" \
      -w /app \
      node:24-alpine \
      sh -c "npm install && npm run start:int"
    ;;
  frontend:devProd)
    docker run --rm -it \
      "${NODE_USER_ARGS[@]}" \
      --network host \
      -v "${PROJECT_ROOT}/frontend:/app" \
      -w /app \
      node:24-alpine \
      sh -c "npm install && npm run start:prod"
    ;;
  frontend:build)
    docker run --rm -i \
      "${NODE_USER_ARGS[@]}" \
      -v "${PROJECT_ROOT}/frontend:/app" \
      -w /app \
      node:24-alpine \
      sh -c "npm install && npm run build"
    ;;
  frontend:lint)
    docker run --rm -i \
      "${NODE_USER_ARGS[@]}" \
      -v "${PROJECT_ROOT}/frontend:/app" \
      -w /app \
      node:24-alpine \
      sh -c "npm install && npm run lint"
    ;;
  frontend:test)
    TEST_IMAGE="event-overview-frontend-test"
    if ! docker image inspect "${TEST_IMAGE}" &>/dev/null; then
      echo "Building test image (one-time)..."
      docker build -t "${TEST_IMAGE}" -f "${PROJECT_ROOT}/tooling/Dockerfile.frontend-test" "${PROJECT_ROOT}/tooling"
    fi
    docker run --rm -i \
      "${NODE_USER_ARGS[@]}" \
      -v "${PROJECT_ROOT}/frontend:/app" \
      -w /app \
      "${TEST_IMAGE}" \
      sh -c "npm install && npm run test:ci"
    ;;
  backend:runInt)
    docker run --rm -it --network host \
      "${MAVEN_USER_ARGS[@]}" \
      -v "/home/patrick/Data/Settings/Secrets/event-overview-hitobito-token-int:/run/secrets/token:ro" \
      -e APPLICATION_HITOBITO_API_TOKEN_FILE=/run/secrets/token \
      -e SPRING_PROFILES_ACTIVE=int \
      -v "${PROJECT_ROOT}/backend:/app" \
      -w /app \
      eclipse-temurin:25-jdk \
      ./mvnw spring-boot:run
    ;;
  backend:runProd)
    docker run --rm -it --network host \
      "${MAVEN_USER_ARGS[@]}" \
      -v "/home/patrick/Data/Settings/Secrets/event-overview-hitobito-token-prod:/run/secrets/token:ro" \
      -e APPLICATION_HITOBITO_API_TOKEN_FILE=/run/secrets/token \
      -v "${PROJECT_ROOT}/backend:/app" \
      -w /app \
      eclipse-temurin:25-jdk \
      ./mvnw spring-boot:run
    ;;
  backend:build)
    docker run --rm -i \
      "${MAVEN_USER_ARGS[@]}" \
      -v "${PROJECT_ROOT}/backend:/app" \
      -w /app \
      eclipse-temurin:25-jdk \
      ./mvnw package -DskipTests
    ;;
  backend:test)
    docker run --rm -i \
      "${MAVEN_USER_ARGS[@]}" \
      -v "/home/patrick/Data/Settings/Secrets/event-overview-hitobito-token-prod:/run/secrets/token:ro" \
      -e APPLICATION_HITOBITO_API_TOKEN_FILE=/run/secrets/token \
      -v "${PROJECT_ROOT}/backend:/app" \
      -w /app \
      eclipse-temurin:25-jdk \
      ./mvnw verify
    ;;
  npm)
    docker run --rm -i \
      "${NODE_USER_ARGS[@]}" \
      -v "${PROJECT_ROOT}/frontend:/app" \
      -w /app \
      node:24-alpine \
      npm "${@:2}"
    ;;
  mvn)
    docker run --rm -i \
      "${MAVEN_USER_ARGS[@]}" \
      -v "${PROJECT_ROOT}/backend:/app" \
      -w /app \
      eclipse-temurin:25-jdk \
      ./mvnw "${@:2}"
    ;;
  *)
    echo "Usage: tooling/docker.sh <command>"
    echo ""
    echo "  Combined:"
    echo "    devLocal           Start frontend + backend together (port 4200 + 8080)"
    echo ""
    echo "  Frontend only:"
    echo "    frontend:devInt    Angular dev server against int backend"
    echo "    frontend:devProd   Angular dev server against prod backend"
    echo "    frontend:build     Build for production"
    echo "    frontend:lint      Run ESLint"
    echo "    frontend:test      Run unit tests headless (builds local image on first run)"
    echo "    npm <args>         Run arbitrary npm command"
    echo ""
    echo "  Backend only:"
    echo "    backend:runInt     Start Spring Boot on port 8080 (int token)"
    echo "    backend:runProd    Start Spring Boot on port 8080 (prod token)"
    echo "    backend:build      Build JAR, skip tests"
    echo "    backend:test       Run all tests"
    echo "    mvn <args>         Run arbitrary Maven command"
    echo ""
    exit 1
    ;;
esac
