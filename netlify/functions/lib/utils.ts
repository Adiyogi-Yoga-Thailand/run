import { HandlerEvent, HandlerResponse } from "@netlify/functions"

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