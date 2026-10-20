import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'

export type DbDialect = 'sqlite' | 'postgres'

/** SQLite (`file:` / `libsql:`) is local-only. Hosted CMS must use Postgres. */
export function getDbDialect(url = process.env.DATABASE_URL || 'file:./payload.db'): DbDialect {
  if (url.startsWith('postgres://') || url.startsWith('postgresql://')) {
    return 'postgres'
  }
  return 'sqlite'
}

export function createDbAdapter() {
  const url = process.env.DATABASE_URL || 'file:./payload.db'
  const dialect = getDbDialect(url)

  if (dialect === 'postgres') {
    return postgresAdapter({
      pool: {
        connectionString: url,
      },
    })
  }

  return sqliteAdapter({
    client: {
      url,
    },
  })
}
