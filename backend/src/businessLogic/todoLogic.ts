import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { TodosAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { parseUserId } from '../auth/utils'
import * as uuid from 'uuid'

const todosAccess = new TodosAccess();

export async function getTodos(jwtToken: string): Promise<TodoItem[]> {
    const userId = parseUserId(jwtToken)
    return todosAccess.getTodos(userId)
}

export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    jwtToken: string
): Promise<TodoItem> {
    
    const userId = parseUserId(jwtToken)
    const todoId = uuid.v4()
    const timeStamp = new Date().toISOString()
    return await todosAccess.createTodo({
        todoId: todoId,
        userId: userId,
        done: false,
        createdAt: timeStamp,
        ...createTodoRequest
    })
}
export async function deleteTodo(
    todoId: string,
    jwtToken: string
): Promise<any> {
    const userId = parseUserId(jwtToken)
    return await todosAccess.deleteTodo(todoId, userId)
}
export async function updateTodo(
    todoId: string,
    updateTodoRequest: UpdateTodoRequest,
    jwtToken: string
): Promise<TodoUpdate> {
    const userId = parseUserId(jwtToken)

    const returnValue = await todosAccess.updateTodo({
        name: updateTodoRequest.name,
        dueDate: updateTodoRequest.dueDate,
        done: updateTodoRequest.done,
        },
        userId, 
        todoId
        )
    return returnValue;
}

export async function updateTodoImageUrl(todoId: string, jwtToken: string): Promise<any> {
    const userId = parseUserId(jwtToken)
    const url = todosAccess.updateURL(todoId, userId)
    return url;
    
}