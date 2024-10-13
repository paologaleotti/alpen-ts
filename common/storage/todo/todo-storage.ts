import { Todo } from "@/common/models/todo-models"

export interface TodoStorage {
    createTodo: (todo: Todo) => Promise<void>
    getTodos: () => Promise<Todo[]>
    getTodo: (id: string) => Promise<Todo | null>
    deleteTodo: (id: string) => Promise<void>
}
