import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
// import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate'

const XAWS: any = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class TodosAccess {
  constructor(
    private readonly docClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todoIndex = process.env.INDEX_NAME
  ) {}

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    logger.info('Get all todos items')
    logger.info(`Index name ${this.todoIndex}`)

    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        IndexName: this.todoIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()
    
    const items = result.Items
    return items as TodoItem[]
  }

  async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
    logger.info('Create todo item')

    const result = await this.docClient
      .put({
        TableName: this.todosTable,
        Item: todoItem
      })
      .promise()

    logger.info('Todo item created', result)

    return todoItem
  }
}
