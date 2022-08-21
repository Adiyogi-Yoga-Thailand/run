import { Handler } from "@netlify/functions"
import { google } from "googleapis"

const sheets = google.sheets("v4")

export const handler: Handler = async (event, context) => {
  const auth = await new google.auth.GoogleAuth({
    // Scopes can be specified either as an array or as a single, space-delimited string.
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/spreadsheets",
    ],
  }).getClient()
  google.options({ auth })

  try {
    const spreadsheetId = event.queryStringParameters.id
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A1",
    })
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: response.data,
      }),
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify(e),
    }
  }
}
