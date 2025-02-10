export const prompts = {
  generateExpense: (text: string) => `
    Extract the expense details from the following text: ${text}. Now use the details to generate a json object in the following format:
    {
      "summary": string,
      "isExpense": boolean,
      "expenseDetails": {
        "name": string,
        "amount": number,
        "date": string,
        "description": string
      }
    }
  `,
  generateFromNotification: (
    app: string,
    title: string,
    text: string,
    titleBig: string,
    subText: string,
    summaryText: string,
    bigText: string,
    extraInfoText: string,
    groupedMessages: string,
  ) => `
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
  `,
}
