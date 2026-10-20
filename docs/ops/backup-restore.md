# Backup / restore (stub runbook)

## What to back up

1. **Postgres/SQLite** — metadata only (posts, pages, users, media URLs).  
2. **Media** — `apps/cms/media` locally, or R2 bucket prefix `orgs/{slug}/` in prod.

## Local (v0.1)

```bash
# DB file
cp apps/cms/payload.db ~/backups/cpa-$(date +%F).db

# Media directory (if not on R2)
tar -czf ~/backups/cpa-media-$(date +%F).tgz -C apps/cms media
```

## Restore sketch

1. Stop CMS.  
2. Replace `payload.db` (or restore Postgres dump).  
3. Restore media dir **or** point `R2_*` at the existing bucket.  
4. Start CMS; verify `/admin` and a known post slug.

## Prod target

- Nightly: `pg_dump` + R2 versioning / rclone sync.  
- Restore drill twice a year (Mode A shared calendar; Mode B partner-owned).
