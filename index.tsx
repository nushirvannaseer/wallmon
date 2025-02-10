import "@expo/metro-runtime" // this is for fast refresh on web w/o expo-router
import { registerRootComponent } from "expo"
import { AppRegistry } from "react-native"
import { App } from "@/app"
// eslint-disable-next-line import/no-unresolved
import { load, save } from "@/utils/storage"
import { History, Notification } from "@/types/Storage"
import { geminiApi } from "@/services/api/api"
import uuid from "react-native-uuid"
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
    Do not classify notifications as transactions unless you are 100% sure that it is a financial transaction.
    It is better to classify a notification as not a transaction than to classify it as a transaction when it is not.
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
        "from": string,
        "to": string,
        "detectedFromApp": string,
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
}

const callGemini = async (prompt: string) => {
  try {
    const response = await geminiApi.generateContent(prompt)

    const storedHistory = await load("geminiResponse")
    let history: History = []

    if (storedHistory) {
      try {
        history = JSON.parse(storedHistory.toString())
      } catch {
        history = []
      }
    }

    history.push({ ...response, id: uuid.v4() } as Notification)
    await save("geminiResponse", JSON.stringify(history))
    return response
  } catch (error) {
    console.error("Error calling Gemini:", error)
    throw error
  }
}

registerHeadlessTask()
// Register the main app component
registerRootComponent(App)
