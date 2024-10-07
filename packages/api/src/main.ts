import { serve } from "@hono/node-server";
import { buildServer } from "./server";

serve({
    fetch: buildServer().fetch,
    port: 3000,
});
