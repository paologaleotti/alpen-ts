import { Hono } from "hono"
import { HelloService } from "../services/hello-service"

export function buildHelloRouter(service: HelloService) {
    const router = new Hono()

    router.get("/hello/:name", (c) => {
        const { name } = c.req.param()
        return c.text(service.sayHello(name))
    })

    return router
}
