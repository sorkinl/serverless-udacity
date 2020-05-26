import 'source-map-support/register'
/* import * as uuid from 'uuid' */
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
/* import * as AWS from 'aws-sdk'
import { parseUserId } from '../../auth/utils' */
import { createTodo } from '../../businessLogic/todoLogic'



export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const createdTodo: CreateTodoRequest = JSON.parse(event.body)
  /* const itemId = uuid.v4(); */
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const newTodo = await createTodo(createdTodo, jwtToken);
  

  // TODO: Implement creating a new TODO item
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      item:newTodo
    })
  }
}
