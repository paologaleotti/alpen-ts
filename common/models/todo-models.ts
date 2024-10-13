import z from "zod"

export const todoSchema = z.object({
    id: z.string(),
    title: z.string(),
    completed: z.boolean()
})
export type Todo = z.infer<typeof todoSchema>

export const newTodoSchema = z.object({
    title: z.string()
})
export type NewTodo = z.infer<typeof newTodoSchema>
