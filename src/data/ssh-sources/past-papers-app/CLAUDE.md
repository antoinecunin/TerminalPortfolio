# Past Papers App

Self-hosted exam archive for universities - PDF upload, annotations (text/image/LaTeX), voting, threaded discussions. Multi-instance, GDPR compliant, bilingual (FR/EN).

Stack: Docker Compose, Nginx, React 19, Express, MongoDB, Garage S3, Meilisearch.

See @README.md for setup and architecture.

## Commands

```bash
npm start -- dev --clean --seed    # Dev with fresh data
npm start -- prod                  # Production
npm run backup                     # Backup MongoDB + Garage files
npm run backup -- list             # List available backups
npm run backup -- restore          # Restore most recent backup
npm run import -- <dir> <pattern>  # Bulk import PDFs
cd annales-app/api && npm test
cd annales-app/api && npm run lint && npm run format:check
cd annales-app/web && npm run lint && npm run format:check
```

Test accounts: `admin@<domain>` / `admin123`, `test@<domain>` / `test1234`

## Critical rules

<!-- These are the rules Claude most often violates without explicit instruction -->

- **ALWAYS use `apiFetch`** (`web/src/utils/api.ts`) for API calls, NEVER raw `fetch`. It adds `credentials: 'include'` for HttpOnly cookie auth.
- **ALWAYS add i18n keys to BOTH** `web/src/i18n/en.json` AND `web/src/i18n/fr.json` when adding user-facing strings. Use `t('key')` in components, `i18n.t('key')` in non-React code.
- **NEVER store tokens in localStorage.** Auth uses HttpOnly cookies (`SameSite=Lax`, `Secure` in prod).
- **NEVER return different HTTP status codes** for "email exists" vs "email doesn't exist" - prevents enumeration.
- **Run tests AND lint** before considering work done.

## Non-obvious decisions

- **Token revocation**: `tokenVersion` on User, incremented on logout/password change/email change. Auth middleware rejects mismatched versions.
- **Garage** replaced MinIO (archived 2026). Init via `docker exec` in `start.ts`: the S3 keys are read from `.env` and registered with `garage key import`, never generated. Garage only accepts `GK` + 12 hex bytes as access key and 32 hex bytes as secret, and the keys shipped in `.env.example` are deliberately invalid so no instance runs on the public repo's credentials. `run()` swallows every `docker exec` failure, so `start.ts` asserts the end state instead: it checks the key exists after importing it, then that `key info` lists the bucket with `RW`, which can only happen once the layout, the bucket and the grant all succeeded. Both checks exit 1 - without them a broken sequence reported `Garage S3 ready` and surfaced only as 500s on upload.
- **`--clean` in prod** requires typing `yes` to confirm. Always backup first with `npm run backup`.
- **`backup.ts` and `import.ts` find their stack by container name across the whole host**, development first, ignoring the directory they run from. Both take an optional `dev`/`prod` argument to settle it. Compare names exactly, never with `includes`: `annales-api-dev` contains `annales-api`, which is how a production run once matched a development container.
- **`instance.config.json` is bind-mounted** by both composes, so a missing file makes Docker create a root-owned directory at that path and the API dies on `EISDIR`. `start.ts` now refuses to start on either state. The fallback to the example config in `instance-config.service.ts` is therefore unreachable under Docker; it only ever fires outside containers (tests, direct node run).
- **Images**: uploaded to Garage, converted to WebP via sharp, served publicly at `GET /api/files/image/:filename` (UUID, no auth). PDFs require auth.
- **Initial admin** (`INITIAL_ADMIN_EMAIL` env var) is the only one who can promote/demote roles. Any admin can toggle `canComment`/`canUpload`. The `INITIAL_ADMIN_*` vars are read at runtime, not just at bootstrap: `auth.ts` gates role management on `INITIAL_ADMIN_EMAIL`, and `scripts/import.ts` logs in with the email/password pair, so they must stay in `.env` and stay current, which is what `admin-init.service.ts` now says once it has created the account. `AdminInitService` (called from `index.ts` on every boot, no-op once an admin exists) is the only code path granting the admin role.
- **Theme**: Tailwind v4, so the design tokens live in the `@theme` block of `web/src/index.css` and nowhere else. There is no JS config: v4 only reads one if a `@config` directive points at it. Colours are deliberately not per-instance: `9650c9a` removed `branding.primaryColor` from the instance config because a free hex value produced unreadable interfaces. Do not propose putting it back without solving that; a short list of vetted themes is the shape that could work.
- **LaTeX**: KaTeX with `trust: false` + DOMPurify on output to prevent XSS.
- **Legal pages** (PrivacyPage, TermsPage, CookieBanner) are NOT yet migrated to i18n.
- **Tests** use `Authorization: Bearer` header (not cookies) via fallback in auth middleware.
- **Full-text search**: PDF text extracted at upload via `pdfjs-dist`, indexed in Meili as one document per page (id `examId-pageNumber`). Indexing is fire-and-forget - a Meili outage never blocks upload or delete. Exams whose pages carry negligible text (>50% below 50 chars) are flagged `searchable: false` and not indexed; the UI surfaces a badge instead of pretending to search them.
- **Search snippets**: API post-processes Meili's highlighted output in `utils/snippet.ts`, trimming to the nearest sentence boundary with an 80-char hard cap. Meili's native word-based crop is disabled.
- **The search index cannot be rebuilt.** Page text lives only in Meili; Mongo keeps a page count and the `searchable` flag. `backup.ts` covers Mongo and Garage only, so a restore leaves search silently empty and there is no reindex command. Rebuilding one would mean re-downloading every PDF from Garage and re-running `pdf-extract.service.ts`. Worth writing before anyone runs this in production.

## Patterns

**New API route**: route in `api/src/routes/` → Zod validation → service → Swagger JSDoc → register in `index.ts` → tests

**New page**: component in `web/src/pages/` → `useRouter.ts` (type union + buildPath + parseCurrentPath + title) → `App.tsx` (switch + nav)

**New translatable string**: key in both `en.json` and `fr.json` → `t('section.key')` in component

**Version bump**: the docs quote versions in three places and they must stay in step with the code. `README.md` stack line (React, MongoDB, Meilisearch), `CLAUDE.md` line 5 (React), `docs/INSTALL.md` prerequisites (Node, Docker Compose). Sources of truth: the `image:` lines of both compose files, `web/package.json`, and `FROM node:` in `docker/*/Dockerfile`. The test Mongo comes from `mongodb-memory-server`'s default binary, deliberately unpinned so it tracks the compose version.
