import { NewTodo, Todo } from "@/common/models/todo-models"
import { TodoStorage } from "@/common/storage/todo/todo-storage"
import { serviceError } from "../errors"

export class TodoService {
    constructor(private readonly todoStorage: TodoStorage) {}

    public async createTodo(newTodo: NewTodo): Promise<void> {
        const todo: Todo = {
            id: crypto.randomUUID(),
            completed: false,
            title: newTodo.title
        }

        await this.todoStorage.createTodo(todo)
    }

    public async getTodos(): Promise<Todo[]> {
        return await this.todoStorage.getTodos()
    }

    public async getTodo(id: string): Promise<Todo> {
        const todo = await this.todoStorage.getTodo(id)
        if (!todo) {
            throw serviceError("ItemNotFound", `Todo with id ${id} not found`)
        }

        return todo
    }

    public async deleteTodo(id: string): Promise<void> {
        await this.todoStorage.deleteTodo(id)
    }
}
