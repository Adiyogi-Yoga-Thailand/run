import { Handler } from "@netlify/functions"
import fetch from "node-fetch"

import { handleRequest } from "./lib/utils"

const { API_BASE_URL, TOKEN } = process.env

export const handler: Handler = async (event, context) =>
  handleRequest(event, async () => {
    const response = await fetch(`${API_BASE_URL}/api/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
      body: event.body,
    })
    const json: any = await response.json()
    if (json.error !== undefined || json.error !== null) {
      if (
        json.error.name === "ValidationError" &&
        json.error.message === "This attribute must be unique"
      ) {
        return {
          statusCode: json.error.status,
          body: JSON.stringify({
            success: json.data !== null,
            error: {
              id: "ErrorAlreadyRegistered",
              message: "This LINE account has already been registered",
            },
          }),
        }
      }
      return {
        statusCode: json.error.status,
        body: JSON.stringify({
          success: json.data !== null,
          error: {
            id: json.error.name,
            message: json.error.message,
            detail: json.error.detail,
          },
        }),
      }
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ success: json.data !== null }),
    }
  })
