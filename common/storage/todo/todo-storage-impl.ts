import { Todo } from "@/common/models/todo-models"
import { Kysely } from "kysely"
import { DatabaseSchema } from "../db-schema"
import { TodoStorage } from "./todo-storage"

export class TodoStoragePg implements TodoStorage {
    constructor(private readonly db: Kysely<DatabaseSchema>) {}

    public async createTodo(todo: Todo): Promise<void> {
        await this.db
            .insertInto("todos")
            .values({
                id: todo.id,
                is_completed: todo.completed,
                title: todo.title
            })
            .executeTakeFirstOrThrow()
    }

    public async getTodos(): Promise<Todo[]> {
        const result = await this.db.selectFrom("todos").selectAll().execute()
        return result.map((t) => ({
            completed: t.is_completed,
            id: t.id,
            title: t.title
        }))
    }

    public async getTodo(id: string): Promise<Todo | null> {
        const result = await this.db
            .selectFrom("todos")
            .selectAll()
            .where("id", "=", id)
            .executeTakeFirst()

        return result
            ? {
                  completed: result.is_completed,
                  id: result.id,
                  title: result.title
              }
            : null
    }

    public async deleteTodo(id: string): Promise<void> {
        await this.db.deleteFrom("todos").where("id", "=", id).execute()
    }
}
