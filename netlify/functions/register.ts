import { Handler } from "@netlify/functions"
import fetch from "node-fetch"
// import { google } from "googleapis"

// import { auth, checkHttpMethod } from "./lib/utils"
import { handleRequest } from "./lib/utils"

// const sheets = google.sheets("v4")

export const handler: Handler = async (event, context) =>
  handleRequest(event, async () => {
    const response = await fetch(`${process.env.API_BASE_URL}/api/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.TOKEN}` },
      body: event.body,
    })
    const json: any = await response.json()
    if (json.error !== null) {
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

// export const handler: Handler = async (event, context) => {
//   const [pass, error] = checkHttpMethod(event, "POST")
//   if (!pass) return error
//   try {
//     await auth(google)

//     const body = JSON.parse(event.body)
//     const response = await sheets.spreadsheets.values.append({
//       spreadsheetId: body.query.spreadsheetId,
//       range: body.query.range,
//       valueInputOption: "RAW",
//       insertDataOption: "INSERT_ROWS",
//       requestBody: {
//         range: body.query.range,
//         majorDimension: "ROWS",
//         values: [
//           [
//             body.data.lineId,
//             body.data.firstname,
//             body.data.lastname,
//             body.data.nickname,
//             body.data.telno,
//             body.data.address,
//           ],
//         ],
//       },
//     })
//     return { statusCode: response.status, body: JSON.stringify({ status: response.statusText }) }
//   } catch (e) {
//     return { statusCode: 500, body: JSON.stringify(e) }
//   }
// }
