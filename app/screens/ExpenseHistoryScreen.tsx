import { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Button, Card, Header, Screen, Text } from "@/components"
import { ExpenseHistory } from "@/types/Storage"
import { load, save } from "@/utils/storage"
import { colors } from "@/theme"
import { useNavigation } from "@react-navigation/native"

interface ExpenseHistoryScreenProps extends AppStackScreenProps<"ExpenseHistory"> {}

export const ExpenseHistoryScreen: FC<ExpenseHistoryScreenProps> = observer(
  function ExpenseHistoryScreen() {
    const [expenseHistory, setExpenseHistory] = useState<ExpenseHistory>([])
    useEffect(() => {
      const loadExpenseHistory = async () => {
        const expenseHistory = JSON.parse(
          (await load("expenseHistory")) as string,
        ) as ExpenseHistory
        setExpenseHistory(expenseHistory)
      }
      loadExpenseHistory()
    }, [])

    const deleteExpense = async (id: string) => {
      try {
        const updatedExpenseHistory = expenseHistory.filter((expense) => expense.id !== id)
        await save("expenseHistory", JSON.stringify(updatedExpenseHistory))
        setExpenseHistory(updatedExpenseHistory)
      } catch (error) {
        console.error("error", error)
      }
    }

    const navigation = useNavigation()

    return (
      <Screen style={$root} safeAreaEdges={["top"]} preset="scroll">
        <Header title="Expense History" leftIcon="back" onLeftPress={() => navigation.goBack()} />
        {expenseHistory.map((expense) => (
          <Card
            key={expense.id}
            ContentComponent={
              <View>
                <Text text={`${expense.name} - Rs. ${expense.amount.toString()}`} />
                <Text text={expense.description} />
                <Text text={expense.date} />
                <Button
                  text="Delete"
                  onPress={() => deleteExpense(expense.id)}
                  style={{ backgroundColor: colors.palette.angry500 }}
                />
              </View>
            }
          />
        ))}
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}
