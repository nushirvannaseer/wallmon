import "@expo/metro-runtime" // this is for fast refresh on web w/o expo-router
import { registerRootComponent } from "expo"
import { Alert, AppRegistry } from "react-native"
import { App } from "@/app"
import { GEMINI_API_KEY } from "@env"
import { load, save } from "@/utils/storage"

// Define your headless task

const headlessNotificationListener = async ({ notification }: any) => {
  // Handle the notification here
  // * This notification is a JSON string in the follow format:
  //  *  {
  //  *      "app": string,
  //  *      "title": string,
  //  *      "titleBig": string,
  //  *      "text": string,
  //  *      "subText": string,
  //  *      "summaryText": string,
  //  *      "bigText": string,
  //  *      "audioContentsURI": string,
  //  *      "imageBackgroundURI": string,
  //  *      "extraInfoText": string,
  //  *      "groupedMessages": Array<Object> [
  //  *          {
  //  *              "title": string,
  //  *              "text": string
  //  *          }
  //  *      ]
  //  *  }
  const {
    app,
    title,
    text,
    titleBig,
    subText,
    summaryText,
    bigText,
    extraInfoText,
    groupedMessages,
  } = JSON.parse(notification)
  console.log(
    "Notification received in background",
    "app: ",
    app,
    "\ntitle: ",
    title,
    "\ntext: ",
    text,
    "\ntitleBig: ",
    titleBig,
    "\nsubText: ",
    subText,
    "\nsummaryText: ",
    summaryText,
    "\nbigText: ",
    bigText,
    "\nextraInfoText: ",
    extraInfoText,
    "\ngroupedMessages: ",
    groupedMessages,
  )
  Alert.prompt("Notification received in background", `${title} - ${text}`)
  const prompt = `
    You are a financial assistant. You are given a notification from an app.
    You are given the following information:
    - app: ${app}
    - title: ${title}
    - text: ${text}
    - titleBig: ${titleBig}
    - subText: ${subText}
    - summaryText: ${summaryText}
    - bigText: ${bigText}
    - extraInfoText: ${extraInfoText}
    - groupedMessages: ${groupedMessages}

    First, you need to determine if the notification is from a financial app.
    Examples of financial apps are:
    - Venmo
    - Cash App
    - Chase
    - Wells Fargo
    - Bank of America
    - Meezan Bank
    - Sadapay
    - etc.
    Please make sure that random notifications are not classified as financial transactions. Financial transactions may
    however be from the Messaging app, since a lot of financial apps use the Messaging app to send notifications.
    If it is not from a financial app, you need to respond with:
    {
      "summary": string,
      "isTransaction": boolean,
      "transactionDetails": null
    }

    If it is, you need to extract the transaction details.
    Please respond with a json in the format:
    {
      "summary": string,
      "isTransaction": boolean,
      "transactionDetails": {
        "amount": number,
        "type": "deposit" | "withdrawal" | "transfer" | "other",
        "date": string,
        "description": string
      }
    }

    Make sure to respond with a valid json that can be parsed by JSON.parse().
    Do not include any other text or comments in your response, e.g. json or backticks. etc.
  `
  callGemini(prompt)
}

const registerHeadlessTask = () => {
  AppRegistry.registerHeadlessTask(
    "RNAndroidNotificationListenerHeadlessJs",
    () => headlessNotificationListener,
  )
  console.log("Headless task registered")
}

const callGemini = async (prompt: string) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      },
    )

    const data = await response.json()
    const parsed = JSON.parse(
      data.candidates[0].content.parts[0].text.replace("```json", "").replace("```", ""),
    )
    console.log("Gemini response:", parsed)
    let history = load<any[]>("geminiResponse") ?? []
    history = JSON.parse(history.toString())
    console.log("\nHistory:", history, typeof history)
    history.push(parsed)
    save("geminiResponse", JSON.stringify(history))
    return parsed
  } catch (error) {
    console.error("Error calling Gemini:", error)
    throw error
  }
}

registerHeadlessTask()
// Register the main app component
registerRootComponent(App)
