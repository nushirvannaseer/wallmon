import { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Button, Card, Icon, Screen, Switch, Text } from "@/components"
import { load, save } from "@/utils/storage"
import { colors } from "@/theme"
import { Expense, Notification } from "@/types/Storage"

interface DetectedTransactionsScreenProps extends AppStackScreenProps<"DetectedTransactions"> {}

export const DetectedTransactionsScreen: FC<DetectedTransactionsScreenProps> = observer(
  function DetectedTransactionsScreen() {
    const [history, setHistory] = useState<Notification[]>([])
    const [showOnlyTransactions, setShowOnlyTransactions] = useState<boolean>(true)

    useEffect(() => {
      const loadHistory = async () => {
        const history = (await load<any[]>("geminiResponse")) ?? []
        setHistory(JSON.parse(history.toString()))
      }
      loadHistory()
    }, [])

    const deleteTransaction = async (id: string) => {
      const updatedHistory = history.filter((item) => item.id !== id)
      await save("geminiResponse", JSON.stringify(updatedHistory))
      setHistory(updatedHistory)
    }

    const addTransactionToExpenseHistory = async (transaction: Notification) => {
      const expenseHistory = JSON.parse((await load("expenseHistory")) as string) ?? []
      const expense = {
        name: transaction.summary,
        amount: transaction.transactionDetails?.amount ?? 0,
        date: transaction.transactionDetails?.date ?? new Date().toISOString(),
        id: transaction.id,
        description: transaction.transactionDetails?.description ?? "",
      } as Expense

      expenseHistory.push(expense)
      await save("expenseHistory", JSON.stringify(expenseHistory))
      await deleteTransaction(transaction.id)
    }

    return (
      <Screen style={$root} preset="scroll" safeAreaEdges={["top", "bottom"]}>
        <Text text="detectedTransactions" />
        <Switch
          value={showOnlyTransactions}
          onValueChange={() => setShowOnlyTransactions(!showOnlyTransactions)}
        />
        <View>
          {history
            .filter((item) => (showOnlyTransactions ? item.isTransaction : true))
            .map((response) => (
              <Card
                key={response.id}
                preset="reversed"
                headingStyle={$cardHeadingStyle}
                heading={response.summary}
                contentStyle={$cardContentStyle}
                ContentComponent={
                  <View>
                    <Text
                      style={$cardContentStyle}
                      text={`Transaction: ${response.isTransaction}`}
                    />
                    <Text
                      style={$cardContentStyle}
                      text={`From: ${response.transactionDetails?.from}`}
                    />
                    <Text
                      style={$cardContentStyle}
                      text={`To: ${response.transactionDetails?.to}`}
                    />
                    <Text
                      style={$cardContentStyle}
                      text={`App: ${response.transactionDetails?.detectedFromApp}`}
                    />
                    <Text style={$cardContentStyle} text={`${response.summary}`} />
                    <View style={$cardFooterContainer}>
                      <Button
                        text="Add to history"
                        preset="filled"
                        style={{ backgroundColor: colors.palette.secondary500 }}
                        onPress={() => addTransactionToExpenseHistory(response)}
                        RightAccessory={(_props) => (
                          <Icon color={colors.palette.neutral100} icon="check" />
                        )}
                      />
                      <Button
                        text="Remove"
                        preset="default"
                        style={{ backgroundColor: colors.palette.angry500 }}
                        onPress={() => deleteTransaction(response.id)}
                        RightAccessory={(_props) => (
                          <Icon color={colors.palette.neutral100} icon="x" />
                        )}
                      />
                    </View>
                  </View>
                }
                style={{ marginHorizontal: 20, marginVertical: 5 } as ViewStyle}
              />
            ))}
        </View>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}

const $cardHeadingStyle: TextStyle = {
  fontSize: 20,
  fontWeight: "bold",
}

const $cardContentStyle: TextStyle = {
  fontSize: 16,
  color: colors.palette.neutral900,
}

const $cardFooterContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  gap: 10,
}
