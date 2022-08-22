import { HandlerEvent, HandlerResponse } from "@netlify/functions"
// import { GoogleApis } from "googleapis"

export function checkHttpMethod(event: HandlerEvent, httpMethod: string): [boolean, any] {
  if (event.httpMethod === httpMethod) {
    return [true, null]
  } else {
    return [
      false,
      {
        statusCode: 405,
        body: JSON.stringify({ error: `This API accepets only ${httpMethod} request.` }),
      },
    ]
  }
}

export async function handleRequest(
  event: HandlerEvent,
  callback: () => Promise<HandlerResponse>
): Promise<HandlerResponse> {
  const [pass, error] = checkHttpMethod(event, "POST")
  if (!pass) return error
  try {
    return await callback()
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify(e) }
  }
}

// export async function auth(google: GoogleApis) {
//   const auth = await new google.auth.GoogleAuth({
//     // Scopes can be specified either as an array or as a single, space-delimited string.
//     scopes: [
//       "https://www.googleapis.com/auth/drive",
//       "https://www.googleapis.com/auth/drive.file",
//       "https://www.googleapis.com/auth/drive.readonly",
//       "https://www.googleapis.com/auth/spreadsheets",
//       "https://www.googleapis.com/auth/spreadsheets.readonly",
//     ],
//   }).getClient()
//   google.options({ auth })
// }
