## Working Rules

- Use `tooling/docker.sh` for **all** commands — never run `npm`, `npx`, `mvn`, or `ng` directly. Add new commands to `docker.sh` when needed.
- Before any non-trivial implementation, create a plan as a `.md` file under `docs/` and wait for user confirmation.
- When implementation is finished, write a `git-commit-message.md` in the root folder with a brief commit message.
- Implement new tests or extend existing ones for any change in behavior.
- Add a changelog entry to the relevant `CHANGELOG.md` (backend or frontend has independent versioning). Start a new `Unreleased` section if needed.
- No backwards-compatibility required — there is a single installation deployed from `main`.

## Commands

All commands run via Docker; no local runtimes required.

```bash
# Frontend
tooling/docker.sh frontend:devInt       # Dev server against int backend (port 4200)
tooling/docker.sh frontend:devProd      # Dev server against prod backend
tooling/docker.sh frontend:build        # Production build
tooling/docker.sh frontend:lint         # ESLint
tooling/docker.sh frontend:test         # Unit tests headless (builds test image on first run)
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