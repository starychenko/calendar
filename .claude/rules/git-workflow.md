# Git workflow

Use a feature/<name> branch for scoped changes. Preserve unrelated working-tree changes. Do not pull, commit, push or deploy automatically: perform only the delivery steps authorized by the user.

Before delivery run npm run lint, npm run typecheck, npm test, npm audit --audit-level=high, npm run build and npm run test:e2e. A local pass does not imply that GitHub CI or production has been verified.

Use English Conventional Commits: <type>(<scope>): <imperative summary>, at most 72 characters, with no attribution trailers. Stage the reviewed scope explicitly.

Production is managed by Komodo on Contabo. Follow docs/DEPLOYMENT.md when deployment is authorized; preserve the previous image and Compose configuration for rollback.
