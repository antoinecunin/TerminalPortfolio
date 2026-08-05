# Past Papers App

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](LICENSE)

A self-hosted exam archive for student associations and universities. Upload past papers, annotate them, search through them, discuss them - without locking your community into a third-party service.

**Live demo:** https://pastpapersapp.antoinecunin.fr - the login form pre-fills credentials that sign you in as the main admin.

## Who this is for

- Student associations and societies that collect old exams from year to year.
- Faculties or universities looking for an in-house alternative to Google Drive.
- Anyone running a study community that needs to share, annotate, and search past papers.

If you currently share PDFs in a Google Drive folder, a Notion database, or a Discord channel, this gives you the same archive with full-text search, structured annotations, threaded discussions, moderation tools, and your own branding - running on your own hardware, under your own rules.

## What it does

- PDF upload with metadata (module, year), drag-and-drop in the browser, plus a script for bulk imports
- In-browser PDF viewer with filtering and sorting
- Full-text search page by page, with highlighted snippets (Meilisearch). Scanned PDFs carry no extractable text, so they are detected at upload and flagged as not searchable rather than pretending to be
- Annotations with text, image upload (auto-converted to WebP), and LaTeX
- Threaded discussions with @mentions and up/down voting
- "Best answer" marking by admins
- Content moderation: reports queue and admin review
- User roles and granular permissions (`canUpload`, `canComment`)
- Multi-instance setup through one config file: instance name, organisation, contact address, accepted email domains, upload limits. Colours still live in the stylesheet and need a rebuild
- Bilingual interface (French / English), switchable at runtime. The privacy policy and terms pages are not translated yet and stay in English
- GDPR: data export, account deletion with content anonymisation
- HttpOnly cookie auth, token revocation, rate limiting, XSS protection out of the box

## What it costs

It can be free. As a student, you can host it at no cost using the GitHub Student Developer Pack or your university's infrastructure. See [`docs/HOSTING_FREE.md`](docs/HOSTING_FREE.md).

## Stack

React 19, TypeScript, Express, MongoDB 8, Meilisearch v1, Garage S3, Nginx, Docker Compose. Bilingual UI via react-i18next.

```
                    ┌─────────┐
                    │  Nginx  │
                    └────┬────┘
              ┌──────────┴──────────┐
        ┌─────┴─────┐        ┌─────┴─────┐
        │    Web    │        │    API    │
        │  (React)  │        │ (Express) │
        └───────────┘        └─────┬─────┘
                    ┌───────────────┼───────────────┐
              ┌─────┴─────┐   ┌─────┴─────┐   ┌─────┴─────┐
              │  MongoDB  │   │  Garage   │   │   Meili   │
              │ (metadata)│   │(PDFs+imgs)│   │  (search) │
              └───────────┘   └───────────┘   └───────────┘
```

## Quick links

- **Install your own instance:** [`docs/INSTALL.md`](docs/INSTALL.md)
- **Host it for free (student-friendly):** [`docs/HOSTING_FREE.md`](docs/HOSTING_FREE.md)
- **Backups:** [`docs/BACKUP.md`](docs/BACKUP.md)
- **Upgrading:** [`docs/UPGRADING.md`](docs/UPGRADING.md) *(coming soon)*
- **Troubleshooting:** [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md) *(coming soon)*
- **Architecture & contributing:** [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) *(coming soon)*, [`CONTRIBUTING.md`](CONTRIBUTING.md) *(coming soon)*
- **Reporting a vulnerability:** [`SECURITY.md`](SECURITY.md) *(coming soon)*

## License

Free software, released under the [GNU Affero General Public License v3.0](LICENSE). You can run it, study it, modify it, and redistribute it. If you run a modified version as a network service, you must publish your modifications under the same licence.
