// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'qgvacgk94g'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-1o6-2g9v.auth0.com',            // Auth0 domain
  clientId: 'iHzrdIZO1yY4Kgxx07aw0DrtD9Oe4Pxb',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
