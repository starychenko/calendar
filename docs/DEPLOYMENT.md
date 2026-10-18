# Calendar deployment on Komodo

## Existing production contract

Komodo stack calendar on server contabo reads /opt/stacks/calendar/compose.yaml (files_on_host). Service app creates calendar-app. Its existing edge network is lwhs_edge_calendar_app and port mapping is 127.0.0.1:13000 -> 3000. Preserve these identities when applying the template.

deploy/compose.yaml is a proposed replacement template, not evidence that production has already changed. CALENDAR_IMAGE is required and must reference a release tag containing its commit or an image digest. The template intentionally has no automatic build or destructive data operation.

## Build and qualify

1. Use Node 24 LTS, npm ci, lint, typecheck, npm test and npm audit --audit-level=high.
2. Set NEXT_PUBLIC_SITE_URL to https://calendar.apps.lwhs.xyz when building the real release. Set NEXT_PUBLIC_GA_ID only if Analytics is intended. For local E2E use http://127.0.0.1:19118.
3. Run npm run build, install Playwright browsers, run npm run test:e2e against the standalone output. Check actual PNG content, local fonts, day/week boundaries and browser errors.
4. Build the image: `docker build --build-arg NEXT_PUBLIC_SITE_URL=https://calendar.apps.lwhs.xyz --build-arg NEXT_PUBLIC_GA_ID=... -t calendar:<commit> .` Omit the GA argument to disable Analytics.
5. Qualify that image under a separate name and unused loopback port, then record its digest. Do not replace calendar-app during qualification.

Public values are compiled into the image. Runtime environment overrides do not change existing client bundles. Never pass private credentials as NEXT_PUBLIC_*.

## Resource policy

The template proposes 512 MiB RAM, 1 CPU, 128 PIDs and a 256 MiB V8 old-space limit. These are conservative starting limits for a small calendar, not measured capacity guarantees. Qualify the image under these limits before applying them; inspect peak memory, errors and response latency. Log rotation remains 10 MiB x 3. The non-root process drops capabilities and uses no-new-privileges.

Local qualification on 2026-10-18 passed 69 browser checks and a 100-request/concurrency-5 HTTP check under these limits, with no OOM. This does not replace checking the released image and actual traffic on Contabo. See [AUDIT-RESOLUTION.md](AUDIT-RESOLUTION.md) for measured scope and remaining deployment steps.

## Authorized production update

Before deployment, record the existing image tag/digest and preserve the current Compose and app.env securely. Do not put secret env values in an audit report or Git. Check the actual Komodo stack state and external network.

Publish or load the qualified image through the agreed delivery path. Set CALENDAR_IMAGE in the stack's deployment environment, or replace that placeholder with the exact immutable image tag in the host copy of Compose. Validate docker compose config, then deploy through Komodo. Wait for its completion record; an accepted request is not a completed deployment.

Verify container health/runtime, public home/privacy/terms/robots/sitemap/manifest, a valid OG PNG, security headers and canonical URLs. Exercise ISO/GfK, year selection, EN/UK, theme and mobile panel in the public browser. Check container logs for errors. A green GET / healthcheck alone does not cover these functions.

## Rollback

Keep the previous image and Compose until the new release is verified. On a failed release, restore the previous image/config and redeploy the same stack. Recheck its public workflows and logs. The app has no application database or user-data volume; there is no reason to remove unrelated volumes or restart other services.

## CI

.github/workflows/ci.yml uses an isolated GitHub-hosted Ubuntu runner with read-only repository permission. It builds and tests only, with no deployment credentials. There were no repository self-hosted runners at setup. A future move to Contabo CI requires a separate isolated runner/workspace and agreed resource limits; do not run untrusted pull requests inside production services.
