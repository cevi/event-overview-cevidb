* No need to be backwards-compatible, there is only one installation that is regularly deployed from main
* Implement new tests or extend existing test for any change in behavior that is being implemented
* the backend and frontend have independent versioning and changelog file. Add an entry to the relevant file whenever you implement something. Start a new unreleased section if needed
* write a git-commit-message.md file when an implementation is finished in the root folder with a brief git commit message to be used when commiting
* create a plan as .md file under docs before any implementation (that is more than a few lines) and wait for user confirmation before implementing it
* use tooling/docker.sh to run commands using docker. Avoid running commands like npx, tsx, mvn or npm directly, add new commands to docker.sh when needed.