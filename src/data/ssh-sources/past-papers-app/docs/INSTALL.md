# Installation

This guide walks you through deploying Past Papers App on a server you control. For local development, jump to [Development setup](#development-setup) at the end.

If you're a student looking for free hosting credits, read [`HOSTING_FREE.md`](HOSTING_FREE.md) first - it covers how to obtain the server itself.

## Prerequisites

- A server with **2 GB of RAM** and ~20 GB of free disk, plus **2 GB of swap** as a safety net. The containers can briefly need more than 2 GB during indexing or image processing; without swap, the server may kill a process under load. Set up swap once with:

  ```bash
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
  ```
- **Docker** and **Docker Compose v2** (Compose is bundled with recent Docker installs). The management scripts call `docker` directly, without `sudo`, so your user must be in the `docker` group: `sudo usermod -aG docker $USER`, then log out and back in for it to take effect.
- **Node.js 20 or newer** on the host. Management scripts (`npm start`, `npm run backup`, `npm run import`) run outside the containers via `tsx`.
- An **SMTP service** for sending verification emails. Brevo, Mailgun and Postmark all work. Avoid self-hosting a relay unless that is already your trade: mail leaving a small server is usually filed as spam, and you lose verification emails without ever seeing an error.
- A **domain name** is strongly recommended so you can serve the app over HTTPS.

## 1. Clone the repository

```bash
git clone https://github.com/antoinecunin/Past-Papers-App
cd Past-Papers-App/annales-app

cp .env.example .env
cp instance.config.example.json instance.config.json
```

## 2. Configure `.env`

Set every variable flagged `MUST BE CONFIGURED` in the file's own comments.

> **Only the S3 keys are enforced.** The shipped `JWT_SECRET` and `MEILI_MASTER_KEY` are long enough to pass every check, so an instance left on the defaults starts happily, running on secrets published in this repository. `JWT_SECRET` signs the authentication tokens: leave it and a stranger can forge an administrator session. Replace both.

| Variable                 | What to set                                                              |
|--------------------------|--------------------------------------------------------------------------|
| `JWT_SECRET`             | Signs auth tokens. The API refuses to start under 16 characters; use more.|
| `MEILI_MASTER_KEY`       | Authenticates the search index. 16 bytes minimum, see the gotchas.       |
| `SMTP_HOST`, `SMTP_PORT` | Your email provider's SMTP endpoint.                                     |
| `SMTP_USER`, `SMTP_PASS` | The credentials your provider issued you.                                |
| `EMAIL_FROM_ADDRESS`     | The address users will see in confirmation emails.                       |
| `EMAIL_FROM_NAME`        | The display name for that address.                                       |
| `FRONTEND_URL`           | The public URL of your instance (e.g. `https://annales.monasso.fr`).     |
| `S3_ACCESS_KEY`          | Storage access key, see below. Garage rejects any other format.          |
| `S3_SECRET_KEY`          | Storage secret key, see below. Garage rejects any other format.          |

Generate the S3 pair before the first boot. Garage never creates these keys: it registers whatever `.env` holds, and accepts nothing but `GK` plus 12 hex bytes as the access key, and 32 hex bytes as the secret.

```bash
echo "GK$(openssl rand -hex 12)"   # S3_ACCESS_KEY
openssl rand -hex 32               # S3_SECRET_KEY
```

The four `INITIAL_ADMIN_*` variables are the only code path that ever grants the admin role. Without them your instance has no administrator and no way to appoint one short of editing MongoDB. Set all four or none, since one missing value skips the bootstrap. Two further conditions are checked silently, the API logging the reason and starting anyway:

- the email must match one of the `allowedDomains` from step 3;
- the password needs 8 characters or more, with a letter and a digit.

The bootstrap runs at every startup until an admin exists, so correcting `.env` and restarting is enough to recover.

Leave the rest alone, `CORS_ORIGIN` included: the browser reaches the API through the same Nginx and the same origin, so no cross-origin request occurs.

> Generate random strings with `openssl rand -base64 48`.

## 3. Configure your instance

The API mounts this file, so `npm start` refuses to run without it and tells you how to create it.

Open `instance.config.json` and set:

- `instance.name` - displayed in the navbar, so keep it short or it will crowd the layout.
- `instance.organizationName` - used on legal pages.
- `instance.contactEmail` - shown to users for support and GDPR requests.
- `email.allowedDomains` - only users with an email matching one of these domains can register. Use an array of suffixes, e.g. `["@students.example.edu", "@example.edu"]`. Each entry must start with `@`, the schema rejects anything else.
- `uploads.maxFileSizeMB` and `uploads.maxStorageMB` - both optional; the defaults sit in `instance.config.example.json`. Adjust `maxStorageMB` to your disk. `maxFileSizeMB` has an upper bound in `instance.config.schema.json` and a larger value is rejected, so check the schema before raising it.

## 4. First start

```bash
npm install
npm start
```

The first run builds the images, the longest and most memory-hungry step of the install; a long silence there is normal, and this is where the swap earns its keep.

The script then starts the containers, waits for Garage, applies its storage layout, creates the bucket, and registers the S3 keys from your `.env`. There is no credential to copy back: keys flow from `.env` into Garage, never the other way round.

It finishes by printing the web interface, API docs and health URLs.

If you left the placeholder S3 keys in place, the script stops here rather than starting a half-working instance:

```
❌ Garage rejected the S3 credentials.
   .env must carry a key pair Garage accepts:
     S3_ACCESS_KEY   "GK" followed by 12 hex-encoded bytes
     S3_SECRET_KEY   32 hex-encoded bytes
```

Generate a valid pair as shown in step 2, put it in `.env`, and run `npm start` again. The containers are already up at that point, so the second run picks up where this one stopped.

The app is now available on `http://localhost:8080` (or whichever port you set in `WEB_PORT`).

## 5. Put it behind HTTPS

The containers serve plain HTTP. **Never expose port 8080 to the internet without TLS in front of it.**

The simplest setup is [Caddy](https://caddyserver.com/), which obtains and renews Let's Encrypt certificates automatically. Install Caddy on the host, then add to `/etc/caddy/Caddyfile`:

```
annales.monasso.fr {
    reverse_proxy localhost:8080
}
```

Reload Caddy (`sudo systemctl reload caddy`) and point your domain's `A` record at the server's IP.

If you prefer Nginx or another reverse proxy, terminate TLS there and forward to `localhost:8080`.

### Close the plain HTTP port

Caddy in front is only half the job: Docker publishes the web port on every interface, so `http://your-server-ip:8080` still answers in clear text, and anyone using that address sends their password unencrypted.

Block it with your provider's firewall (DigitalOcean Cloud Firewall, AWS security group, your university's network rules), allowing only SSH, 80 and 443. Be careful with `ufw`: Docker is known to publish ports through rules that a plain `ufw deny 8080` does not cover, so verify rather than assume. If a host firewall is all you have, look at `ufw-docker`, which writes to the chain Docker uses.

Confirm from another machine that the port no longer answers before announcing the address.

## 6. Log in for the first time

Open `https://your-domain` and sign in with the `INITIAL_ADMIN_EMAIL` / `INITIAL_ADMIN_PASSWORD` from `.env`. **Change that password immediately** from the profile page, then update `INITIAL_ADMIN_PASSWORD` to match.

Keep the `INITIAL_ADMIN_*` variables. Both are read at runtime, long after the bootstrap:

- `INITIAL_ADMIN_EMAIL` permanently designates the only account allowed to promote and demote admins. Remove it and nobody can manage roles again.
- The bulk import script logs in with the pair, so a password changed in the interface but not in `.env` breaks `npm run import`.

## 7. Set up backups

Don't put real exams in production without a backup story. The bundled script handles MongoDB and Garage together:

```bash
npm run backup
```

Add it to cron for automatic daily backups:

```bash
crontab -e
# Add: 0 3 * * * cd /path/to/Past-Papers-App/annales-app && npm run backup
```

Archives land in `annales-app/backups/`, on the same disk as the application, and only the two most recent are kept. That cron line also has three ways of failing without telling you. Read [`BACKUP.md`](BACKUP.md) before you depend on it: it covers those traps, restoring, and getting copies off the machine.

## Bulk import existing PDFs

If you already have a folder full of past exams, the import script crawls a directory recursively and creates exams from filename patterns:

```bash
npm run import -- /path/to/pdfs "{module}_{year}.pdf"
```

The script uploads as your administrator, authenticating with `INITIAL_ADMIN_EMAIL` and `INITIAL_ADMIN_PASSWORD` from the environment. Both must still be present and current, which is why step 6 tells you to keep them in sync with the password you actually use.

The available placeholders are `{module}`, `{year}`, `{title}` and `{_}` (ignore a path segment); a pattern must contain at least `{module}` and `{year}`. Add `--dry-run` to preview what would be created without touching the database.

Run `npm run import -- --help` for the full list. The wrapper looks for a running API container before it reads its arguments, so start the stack first or `--help` exits with "No active API container found". It finds that container by name across the whole host, so add `dev` or `prod` when the machine runs more than one stack:

```bash
npm run import -- prod /path/to/pdfs "{module}_{year}.pdf"
```

## Development setup

For contributing, testing, or trying the app locally without a domain.

You still need steps 1 and 3: clone the repository, and create `instance.config.json`. You can skip the SMTP settings, because the seeded accounts are created already verified and can log in without any email being sent.

Development mode reads **`.env.dev`**, not `.env`, and refuses to start if that file is missing. Create it, then put its own S3 keys in it, exactly as in step 2. The copied placeholders are invalid on purpose, so skipping this stops the start:

```bash
cp .env.example .env.dev
echo "GK$(openssl rand -hex 12)"   # S3_ACCESS_KEY
openssl rand -hex 32               # S3_SECRET_KEY
```

Then start the full stack with a fresh database and seed users:

```bash
npm start -- dev --clean --seed
```

The ports below are the defaults from `.env.example`; each one is configurable, so check your own `.env.dev` if a URL does not answer.

| URL                              | Purpose                           | Variable            |
|----------------------------------|-----------------------------------|---------------------|
| `http://localhost:8080`          | App via the reverse proxy         | `WEB_PORT`          |
| `http://localhost:5173`          | Vite dev server (direct, HMR)     | `VITE_PORT`         |
| `http://localhost:3000`          | API (direct)                      | `API_EXTERNAL_PORT` |
| `http://localhost:8080/api/docs` | Swagger API reference             | `WEB_PORT`          |

The seed prints every account it creates, with its password and your own domain filled in. They are defined in `dev-seed.json`. The two you will use most are `admin` and `test`, on the first domain of your `allowedDomains`:

- `admin@...` / `admin123`
- `test@...` / `test1234`

Run the test suite:

```bash
cd api
npm install
npm test              # Jest + mongodb-memory-server
npm run test:coverage
```

If that `npm install` fails with `EACCES: permission denied` on `node_modules`, the development stack got there first: the containers mount an anonymous volume over `api/node_modules` and `web/node_modules`, and Docker creates those mount points owned by root. They are empty, so no `sudo` is needed to undo it:

```bash
docker compose -f docker-compose.dev.yml --env-file .env.dev down
rmdir api/node_modules web/node_modules
```

Installing the host dependencies before the first `npm start -- dev` avoids it entirely, since Docker then mounts over a directory that is already yours.

## Common gotchas

- **`npm start -- --clean`** wipes all data and (in production) requires typing `yes` to confirm. **Always run `npm run backup` first.**
- **Emails not arriving** - most providers require domain verification (SPF/DKIM/DMARC). Check the provider's onboarding page; Brevo and Mailgun both walk you through it.
- **Registration answers `500 Internal server error`** - wrong SMTP credentials. The API log carries the real cause, `EAUTH` and `Failed to send email`; the response says nothing about email. Nothing needs cleaning up afterwards: the unverified account left behind is replaced on the next attempt, so once the settings are fixed the person just registers again, or asks for a new verification email from the address confirmation page.
- **`MEILI_MASTER_KEY` must be at least 16 bytes** in production, or Meilisearch refuses to start. Only the production compose sets `MEILI_ENV=production` and enables that check, so a key short enough to break your deployment still works in development.
- **`Garage rejected the S3 credentials`** - your keys are not in the format from step 2. The ones in `.env.example` are deliberately invalid, so that no instance runs on the public repository's credentials. The start script stops here rather than booting an instance whose uploads would all fail.
- **Uploads fail with a 500 even though startup succeeded** - the key is registered but has lost its permissions on the bucket. Check it:

  ```bash
  docker exec annales-garage /garage key info GKyouraccesskey
  ```

  Under `BUCKETS FOR THIS KEY`, your bucket must appear with the `RWO` permissions. If that section is empty, re-running `npm start` grants them again.

A more complete error catalogue will live in [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md) *(coming soon)*.

## One instance per machine

Compose derives its project name from the directory, always `annales-app`, so two checkouts on one machine look like a single deployment. `npm start` shuts down whatever it believes belongs to its project before starting, which means launching one copy **stops the other**, silently.

Setting `COMPOSE_PROJECT_NAME` in the second copy's `.env` gives it its own volumes and networks, and stops the two from tearing each other down. Never change it on an instance that already holds data: its volumes are named after it and would be orphaned.

That is not enough to run both at once, because the container names are fixed: the second instance will refuse to start on a name conflict rather than damage the first. `npm run backup` and `npm run import` also identify their target by container name across the whole host, so pass `dev` or `prod` to either one when the machine runs more than one stack. Without it they pick the development stack, wherever it lives.

For a dedicated server, the normal case, none of this matters. To rehearse an upgrade beside a live instance, use a separate machine.
