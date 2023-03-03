import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

// TODO: Implement businessLogic

const logger = createLogger('TodoAccess')
const attachmentUtils = new AttachmentUtils()
const todosAccess = new TodosAccess()

// get todo items for user
export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
  logger.info('get todo items for user called')
  return  todosAccess.getAllTodos(userId)
}

// create todo create item
export async function createTodo(newTodo: CreateTodoRequest, userId: string) {
  logger.info('Create todo function called')

  const todoId = uuid.v4()
  const createdAt = new Date().toDateString()
  const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
  const newItem: TodoItem = {
    userId,
    todoId,
    createdAt,
    done: false,
    attachmentUrl: s3AttachmentUrl,
    ...newTodo
  }

  return await todosAccess.createTodoItem(newItem)
}
