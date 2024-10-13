import { logger } from "@/common/logger"
import { serve } from "@hono/node-server"
import { buildServer } from "./server"

logger.info("Server started on http://localhost:3000")
serve({
    fetch: buildServer().fetch,
    port: 3000
})
