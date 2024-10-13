export interface DatabaseSchema {
    todos: TodoTable
}

interface TodoTable {
    id: string
    title: string
    is_completed: boolean
}
