# Project Context

This project follows the AI Unified Process. Read `docs/vision.md`, `docs/requirements.md`,
and `docs/entity_model.md` for product context before making decisions. Always follow the skill
when changing requirements, entity-model or use-cases.

## AI Unified Process Workflow

1. `/requirements`        → derives `docs/requirements.md` from `docs/vision.md`
2. `/entity-model`        → derives `docs/entity_model.md` from requirements
3. `/use-case-diagram`    → produces `docs/use_cases.puml`
4. `/use-case-spec UC-XX` → produces `docs/use_cases/UC-XX-*.md`
5. No specific skill for implementation. Make sure to write tests for all changes and features.
6. All newly written code must be checked for Sonar Issues (see Sonar MCP with analyze snippet tool)

Never skip the spec for a use case before implementing it.
Always read the entity model before writing data access code.

The user is watching. You can ask for help, input or also things like visual verification

## Commands

All commands run via Docker; no local runtimes required.

**Note on `backend:test` output:** The final `Tests run:` summary belongs to Failsafe (IT-tests only). Surefire unit test results (`*Test.java`) appear earlier in the log — don't confuse the two.

```bash
# Frontend
tooling/docker.sh frontend:devInt       # Dev server against int backend (port 4200)
tooling/docker.sh frontend:devProd      # Dev server against prod backend
tooling/docker.sh frontend:build        # Production build
tooling/docker.sh frontend:lint         # ESLint
tooling/docker.sh frontend:test         # Unit tests headless (Vitest + jsdom)
tooling/docker.sh frontend:ng <args>    # Angular CLI (ng update / schematics)
tooling/docker.sh npm <args>            # Arbitrary npm command

# Backend
tooling/docker.sh backend:runInt        # Spring Boot on port 8080 (int token)
tooling/docker.sh backend:runProd       # Spring Boot on port 8080 (prod token)
tooling/docker.sh backend:build         # Build JAR, skip tests
tooling/docker.sh backend:test          # Run all tests
tooling/docker.sh mvn <args>            # Arbitrary Maven command

# Combined
tooling/docker.sh devLocal              # Frontend + backend together (port 4200 + 8080)
```