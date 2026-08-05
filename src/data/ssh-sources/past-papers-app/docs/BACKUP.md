# Backups

One command saves both halves of your instance: the database and the uploaded files. Losing either one loses the archive, so they are always captured together.

```bash
npm run backup
```

Run it from `annales-app/`, with the stack up. The script works through the running containers and stops with `No running containers found` if they are down.

## What a backup holds

Each run creates `annales-app/backups/<date>-<time>/` with two entries:

- `mongo.archive` - every exam record, comment, vote, report and user account.
- `files/` - the PDFs and images stored in Garage.

It does not include `.env` or `instance.config.json`: those are configuration, they hold your secrets, and you should keep them somewhere safe yourself.

**It does not include the search index either, and that one cannot be rebuilt.** The text of each page lives only in Meilisearch; the database keeps a page count and nothing more. Restoring gives you back every exam, comment and file, with a search that answers nothing, and no command exists to reindex. Treat the Meilisearch volume as data worth keeping: `docker volume ls` will show it as `<project>_meili_data`, and any volume backup tool can capture it alongside these archives.

## Listing what you have

```bash
npm run backup -- list
```

```
20260802-184424  (92K)  mongo:✓  files:✓
20260415-155911  (672K)  mongo:✓  files:✓
```

The two marks tell you whether each half made it. A backup showing `mongo:❌` is missing its database and is not a backup; find out why before you rely on it.

## Restoring

```bash
npm run backup -- restore        # the most recent one
npm run backup -- restore 20260802-184424   # a specific one
```

Both ask you to type `yes` first, because a restore replaces live data.

**The database is replaced, the files are not.** The restore drops the current collections and rebuilds them from the archive, so the database ends up exactly as it was. Storage only receives what the backup contains: any file uploaded since then stays in Garage, without a database record pointing at it. Those orphans waste space but break nothing.

## Only two backups are kept

Each run deletes everything but the two most recent (`MAX_BACKUPS` in `backup.ts`). A nightly job therefore gives you two days of history, not a week.

That retention exists to protect a small disk, not your data. **Copy the archives off the machine**, on whatever rhythm suits you: they sit on the same disk as the application, so a dead server takes the backups with it. Any file transfer will do.

```bash
rsync -a annales-app/backups/ user@another-host:/somewhere/safe/
```

## Automating it

```bash
crontab -e
# 0 3 * * * cd /path/to/Past-Papers-App/annales-app && npm run backup
```

Three things make a cron backup fail quietly, all worth checking once:

- **The `cd` is required.** The script writes to a relative path, so without it the backup lands wherever cron started, if it runs at all.
- **`npm` must be on cron's `PATH`**, which is far shorter than your shell's. This bites hardest when Node comes from `nvm`. Test the line as cron will see it:

  ```bash
  env -i /bin/sh -c 'cd /path/to/Past-Papers-App/annales-app && npm run backup'
  ```

- **The stack must be up.** A nightly job on a stopped instance fails every night, and cron mails the error to a local mailbox nobody reads.

Check `npm run backup -- list` from time to time. If the newest entry is old, the job has been failing.

## When the machine runs two stacks

The script identifies its target by container name across the whole host, so a development stack running anywhere can answer for production. Name the one you mean:

```bash
npm run backup -- prod
npm run backup -- prod restore
```

On a dedicated server, the normal case, you never need it.

## Before anything destructive

`npm start -- --clean` erases the database and every uploaded file. Take a backup first, and confirm it is there with `list`. The same goes for an upgrade you are unsure about: a fresh backup costs seconds.
