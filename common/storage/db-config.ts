import { Kysely, PostgresDialect } from "kysely"
import { Pool, PoolConfig } from "pg"
import { DatabaseSchema } from "./db-schema"

export function buildDbInstance(config: PoolConfig): Kysely<DatabaseSchema> {
    const dbConfigPostgres = new PostgresDialect({
        pool: new Pool(config)
    })

    return new Kysely<DatabaseSchema>({
        dialect: dbConfigPostgres
    })
}
