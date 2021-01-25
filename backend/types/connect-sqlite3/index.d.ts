declare module 'connect-sqlite3' {
  import { Store } from 'express-session'

  interface SqliteStoreOptions {
    table: string
    db: string
    dir: string
    concurrentDB: boolean
  }

  type SqliteStore = new (options?: Partial<SqliteStoreOptions>) => Store

  export default function init (session: any): SqliteStore
}
