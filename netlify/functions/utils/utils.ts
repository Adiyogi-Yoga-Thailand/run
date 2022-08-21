import { HandlerEvent } from "@netlify/functions"

export function checkHttpMethod(event: HandlerEvent, httpMethod: string): [boolean, any] {
  if (event.httpMethod === httpMethod) {
    return [true, null]
  } else {
    return [
      false,
      {
        statusCode: 400,
        body: JSON.stringify({ error: `This API accepets only ${httpMethod} request.` }),
      },
    ]
  }
}
