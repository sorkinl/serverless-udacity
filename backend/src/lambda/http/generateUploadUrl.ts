import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
/* import { parseUserId } from '../../auth/utils'
import * as AWS from 'aws-sdk' */
import { updateTodoImageUrl } from '../../businessLogic/todoLogic'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const url = await updateTodoImageUrl(todoId, jwtToken);
  
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl:url
    })
  }
}


/* async function updateUrl(todoId: string, userId: string){
  const url: string = `https://${todosBucket}.s3.amazonaws.com/${todoId}`

  await docClient.update({
    TableName: todosTable,
    Key:{
      userId: userId,
      todoId: todoId
    },
    UpdateExpression: "set #attachmentUrl = :attachmentUrl",
    ExpressionAttributeNames: {
      "#attachmentUrl": "attachmentUrl"
    },
    ExpressionAttributeValues: {
      ":attachmentUrl": url
    }    
  }).promise()
}

function getUploadUrl(todoId: string){
  return s3.getSignedUrl('putObject', {
    Bucket: todosBucket,
    Key: todoId,
    Expires: 300
  })
} */
