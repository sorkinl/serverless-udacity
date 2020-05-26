 import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
/* import { parseUserId } from '../../auth/utils' */
//import { ManagedUpload } from 'aws-sdk/clients/s3'
/* import * as AWS from 'aws-sdk' */
import { updateTodo } from '../../businessLogic/todoLogic'

/* const docClient = new AWS.DynamoDB.DocumentClient()

const todoTable = process.env.TODOS_TABLE */

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  /* const userId = parseUserId(jwtToken); */
  await updateTodo(todoId,updatedTodo,jwtToken);
  

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin' : '*'
    },
    body: ''
  }
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
}
 