import { Handler } from "@netlify/functions"
import fetch from "node-fetch"
import qs from "qs"

import { handleRequest } from "./lib/utils"

const { API_BASE_URL, TOKEN } = process.env

export const handler: Handler = async (event, context) =>
  handleRequest(event, async () => {
    const body = JSON.parse(event.body)
    const query = qs.stringify(
      { filters: { lineId: { $eq: body.data.lineId } } },
      { encodeValuesOnly: true }
    )
    const response = await fetch(`${API_BASE_URL}/api/customers?${query}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${TOKEN}` },
    })
    const json: any = await response.json()
    if (Array.isArray(json.data) && json.data.length === 0) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ isRegistered: false }),
      }
    }
    return {
      statusCode: response.status,
      body: JSON.stringify({ isRegistered: true }),
    }
  })
