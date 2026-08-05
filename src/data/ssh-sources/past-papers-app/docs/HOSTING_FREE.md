# Hosting for Free

Past Papers App needs about **2 GB of RAM** and **20 GB of disk** for a typical student-association deployment. This guide covers the ways to run it at **no cost**. Once you have a server, follow [`INSTALL.md`](INSTALL.md) to deploy the app on it.

The right option depends on what you already have. The decision tree below gets you to the right section fast.

```
Do you have a student email?
├── Yes ──► Does your faculty IT department already offer you a VM?
│           ├── Yes ──► Use that. Skip to the SMTP section below.
│           └── No  ──► Try Option 1 (GitHub Student Pack).
└── No  ──► Try Option 2 (University IT sponsorship).
```

## Option 1: GitHub Student Developer Pack

The [GitHub Student Developer Pack](https://education.github.com/pack) bundles free credits and discounts from dozens of providers, including several VPS hosts. Eligibility:

- You need a verifiable student email or an upload of your student card.
- Verification typically takes a few hours to a few days.
- The Pack is renewable as long as you remain a student.

Once you're verified, the most useful entries for hosting this app are:

### DigitalOcean (recommended)

DigitalOcean is the provider to build around: its Pack credit is the most generous on offer, and it stretches a long way on a server this size. Credit amounts and expiry dates change regularly, so check the Pack page when you sign up to know what you are actually getting.

- Pick a **Basic Regular server with 2 GB of RAM** (DigitalOcean calls its servers "droplets").
- Choose a region close to your users (Frankfurt or London for European universities).

### Namecheap

The Pack includes a free `.me` domain. Handy if your association doesn't already own one.

### Other entries worth checking

The Pack roster changes regularly. As of writing, the following are worth a look. Confirm the current offer on the Pack page before committing:

- **Microsoft Azure**: recurring student credit. Useful if you're already in the Microsoft ecosystem; the UI is more involved than DigitalOcean.
- **Linode / Akamai**: one-time credit, short expiry.

Anything offering less than 2 GB of RAM will not fit out of the box. Adding swap buys you some headroom (see the prerequisites in [`INSTALL.md`](INSTALL.md)), but a 512 MB instance will struggle whatever you do.

### Staying free year after year

The DigitalOcean credit belongs to one person and eventually runs out. Students graduate, so the idea is to keep the hosting on the credit of a member who is still active in the association.

When it runs low, hand the hosting over to a member who hasn't used their own DigitalOcean credit yet: they claim the Pack, get a fresh credit, and you move the instance to their account. Back up with `npm run backup`, create a droplet on the new account, and restore. See [`BACKUP.md`](BACKUP.md) for the flow.

As long as your association keeps recruiting students with unused credits, the bill stays on a free credit indefinitely. If you'd rather set it up once and not think about it again, University IT sponsorship (Option 2) is the lower-maintenance choice.

## Option 2: University IT sponsorship

Frequently the best long-term option is a VM provided by your university's IT department. Many faculties have unused capacity and welcome student-led projects, especially when the platform directly serves the students they support.

What to prepare before you ask:

- A one-page summary of what the app does, who it serves, and why a Drive folder isn't enough.
- A demo link, yours or the [public demo](https://pastpapersapp.antoinecunin.fr).
- A resource estimate: **2 GB RAM, 1 vCPU, 20 GB disk**, plus a domain or subdomain.
- A backup story (see [`BACKUP.md`](BACKUP.md)).
- A privacy story: the app is GDPR-compliant out of the box, with on-platform data export and deletion.

If you can name a faculty member who's interested, this gets dramatically easier.

## What about Oracle Cloud Always Free?

On paper it offers a generous free ARM instance, large enough to run the app. In practice it's very hard to actually get one: expect weeks of waiting and frequent account rejections. Don't plan around it.

## Trying it locally first, no server

You can run the entire stack on a laptop with Docker installed, with no cloud cost at all, before deciding whether to deploy publicly. Follow the [Development setup](INSTALL.md#development-setup) section of `INSTALL.md`. The app will be reachable on `http://localhost:8080` from your machine.

## A word on SMTP

Whatever server you pick, you'll need an SMTP service: without one, nobody can confirm their address and therefore nobody can register. The free options:

- **Brevo** (ex-Sendinblue): a free tier generous enough for an association's registration emails, French-hosted.
- **Mailgun**: also offers a free tier.

Both cap the number of emails per day, and both move that cap from time to time, so check their current pricing page. The app only sends account emails: address verification, password resets, and a notice when someone tries to register with an address that already exists. Your volume therefore follows how often members join or lose their password, not how much the archive is used.

**Avoid self-hosting SMTP** unless you really know what you're doing. Outgoing mail from a small server is almost always classified as spam by major providers. You will lose registration emails silently and have no easy way to fix it.
