import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoUpdate } from '../models/TodoUpdate'
import { TodoItem } from '../models/TodoItem'



export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    /* private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION, */
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly bucketName = process.env.TODOS_BUCKET,
    /* private readonly XAWS = AWSXRay.captureAWS(AWS), */
    private readonly s3 = new AWS.S3({ signatureVersion: 'v4' })
  ) {}

  async getTodos(userId: string): Promise<TodoItem[]> {
    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        KeyConditionExpression: '#userId = :userId',
        ExpressionAttributeNames: {
          '#userId': 'userId'
        },
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    return result.Items as TodoItem[]
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: todo
      })
      .promise()

    return todo as TodoItem
  }
  async deleteTodo(todoId: string, userId: string) {
    await this.docClient
      .delete({
        TableName: this.todosTable,
        Key: {
          userId: userId,
          todoId: todoId
        }
      })
      .promise()

  }

  async updateTodo(updatedTodo: TodoUpdate, userId: string, todoId: string): Promise<TodoUpdate> {
    const returnValue = await this.docClient.update({
        TableName: this.todosTable,
        Key: {
          todoId: todoId,
          userId: userId
        },
        UpdateExpression: "set #name = :name, #done = :done, #dueDate = :dueDate",
        ExpressionAttributeNames: {
          "#name": "name",
          "#done": "done",
          "#dueDate": "dueDate"
        },
        ExpressionAttributeValues: {
          ":name": updatedTodo.name,
          ":done": updatedTodo.done,
          ":dueDate": updatedTodo.dueDate,
        }
      }).promise()

      return returnValue.Attributes as TodoUpdate
  }

  async updateURL(todoId: string, userId: string): Promise<String> {
    const url = this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: todoId,
      Expires: 300
  })
    const attachmentUrl: string = 'https://' + this.bucketName + '.s3.amazonaws.com/' + todoId
    const options = {
        TableName: this.todosTable,
        Key: {
            todoId: todoId,
            userId: userId
        },
        UpdateExpression: "set attachmentUrl = :r",
        ExpressionAttributeValues: {
            ":r": attachmentUrl
        },
        ReturnValues: "UPDATED_NEW"
    };
    await this.docClient.update(options).promise()
    
    return url;
}
  
}
