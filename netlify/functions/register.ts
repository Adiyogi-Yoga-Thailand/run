import { Handler } from "@netlify/functions"
import { google } from "googleapis"

import { checkHttpMethod } from "./utils/utils"

const sheets = google.sheets("v4")

export const handler: Handler = async (event, context) => {
  const [pass, error] = checkHttpMethod(event, "POST")
  if (!pass) return error
  try {
    const auth = await new google.auth.GoogleAuth({
      // Scopes can be specified either as an array or as a single, space-delimited string.
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    }).getClient()
    google.options({ auth })

    const body = JSON.parse(event.body)
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: body.query.spreadsheetId,
      range: body.query.range,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        range: body.query.range,
        majorDimension: "ROWS",
        values: [
          [
            body.data.lineId,
            body.data.firstname,
            body.data.lastname,
            body.data.nickname,
            body.data.telno,
            body.data.address,
          ],
        ],
      },
    })
    return { statusCode: response.status, body: JSON.stringify({ status: response.statusText }) }
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify(e) }
  }
}
