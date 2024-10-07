import { Hono } from "hono";
import { buildHelloRouter } from "./routers/hello-router";
import { HelloService } from "./services/hello-service";

export function buildServer() {
    const app = new Hono();

    const helloService = new HelloService();
    const helloRouter = buildHelloRouter(helloService);

    app.route("/", helloRouter);

    return app;
}
