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
      sh -c "echo '{\"apiUri\":\"https://events-api-int.cevi.tools\"}' > /app/src/assets/config.json && npm install && npm run start:int"
    ;;
  frontend:devProd)
    docker run --rm -it \
      "${NODE_USER_ARGS[@]}" \
      --network host \
      -v "${PROJECT_ROOT}/frontend:/app" \
      -w /app \
      node:24-alpine \
      sh -c "echo '{\"apiUri\":\"https://events-api.cevi.tools\"}' > /app/src/assets/config.json && npm install && npm run start:prod"
    ;;
  frontend:devFr)
    docker run --rm -it \
      "${NODE_USER_ARGS[@]}" \
      --network host \
      -v "${PROJECT_ROOT}/frontend:/app" \
      -w /app \
      node:24-alpine \
      sh -c "npm install && npm run start:fr"
    ;;
  frontend:prod)
    PROD_IMAGE="event-overview-frontend"
    echo "Building frontend image (de + fr)..."
    docker build \
      -t "${PROD_IMAGE}" \
      "${PROJECT_ROOT}/frontend"
    echo "Serving on http://localhost:4200 (Ctrl-C to stop, default: prod API)"
    docker run --rm -it \
      -p 4200:80 \
      "${PROD_IMAGE}"
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
    # Vitest runs in Node.js + jsdom, so no browser/custom image is needed.
    docker run --rm -i \
      "${NODE_USER_ARGS[@]}" \
      -v "${PROJECT_ROOT}/frontend:/app" \
      -w /app \
      node:24-alpine \
      sh -c "npm install && npm run test:ci"
    ;;
  frontend:e2e)
    # Spins up backend (fake-Hitobito mode, no secrets needed) + frontend +
    # a Playwright runner via compose, then tears everything down again.
    set +e
    CURRENT_UID="$(id -u)" CURRENT_GID="$(id -g)" \
      docker compose -f "${PROJECT_ROOT}/tooling/compose.e2e.yml" up \
        --abort-on-container-exit --exit-code-from playwright
    ret=$?
    set -e
    CURRENT_UID="$(id -u)" CURRENT_GID="$(id -g)" \
      docker compose -f "${PROJECT_ROOT}/tooling/compose.e2e.yml" down
    exit $ret
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
  frontend:ng)
    # Angular CLI (ng update / schematics). Runs as root so apk can install git,
    # which ng update requires; chowns generated files back to the host user afterwards.
    # Mounts the whole repo so the .git dir (at the root) is visible; works in /app/frontend.
    # Use a TTY only when one is attached (interactive shell) so it also works in CI/tools.
    if [ -t 0 ]; then TTY_ARGS=(-it); else TTY_ARGS=(-i); fi
    docker run --rm "${TTY_ARGS[@]}" \
      -e HOME=/tmp \
      -v "${PROJECT_ROOT}:/app" \
      -w /app/frontend \
      node:24-alpine \
      sh -c "apk add --no-cache git >/dev/null && git config --global --add safe.directory /app && npm install && npx ng ${*:2}; ret=\$?; chown -R ${CURRENT_USER} /app/frontend; exit \$ret"
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
    echo "    frontend:devFr     Angular dev server in French (port 4200, prod backend)"
    echo "    frontend:prod      Build + serve prod image with all locales (port 4200, via nginx)"
    echo "    frontend:build     Build for production"
    echo "    frontend:lint      Run ESLint"
    echo "    frontend:test      Run unit tests headless (Vitest + jsdom)"
    echo "    frontend:e2e       Run Playwright e2e tests (backend + frontend + browser via compose)"
    echo "    npm <args>         Run arbitrary npm command"
    echo "    ng <args>          Run Angular CLI (ng update / schematics; git available)"
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
