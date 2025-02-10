import { FC, Fragment, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, View, ViewStyle } from "react-native"
import { AppStackParamList, AppStackScreenProps } from "@/navigators"
import { Header, Screen, Text, TextField, Button, Loader } from "@/components"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { spacing } from "@/theme"
import { geminiApi } from "@/services/api/api"
import { prompts } from "@/utils/prompts/prompts"
import { ExpenseHistory, Expense } from "@/types/Storage"
import { save } from "@/utils/storage"
import { load } from "@/utils/storage"
import uuid from "react-native-uuid"

interface AddExpenseScreenProps extends AppStackScreenProps<"AddExpense"> {}

export const AddExpenseScreen: FC<AddExpenseScreenProps> = observer(function AddExpenseScreen() {
  const [naturalLanguageExpense, setNaturalLanguageExpense] = useState("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [expense, setExpense] = useState<Expense | null>({
    name: "",
    amount: 0,
    date: new Date().toISOString(),
    description: "",
    id: "",
  })

  const generateExpense = async () => {
    setIsLoading(true)
    try {
      const response = await geminiApi.generateContent(
        prompts.generateExpense(naturalLanguageExpense),
      )
      if (response.isExpense) {
        const expense = response.expenseDetails
        setExpense(expense as Expense)
        Alert.alert("Expense generated", `Expense generated: ${expense.name}`)
      }
    } catch (error) {
      console.error("error", error)
      Alert.alert("Error", `Error generating expense from your prompt: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const saveExpense = async () => {
    try {
      let expenseHistory: ExpenseHistory = []
      try {
        expenseHistory =
          (JSON.parse((await load("expenseHistory")) as string) as ExpenseHistory) ?? []
      } catch (error) {
        console.error("error", error)
        Alert.alert("Error", `Error loading expense history: ${error}`)
      }
      expenseHistory.push({ ...expense, id: uuid.v4() } as Expense)
      await save("expenseHistory", JSON.stringify(expenseHistory))
      navigation.navigate("SetBudget")
    } catch (error) {
      console.error("error", error)
      Alert.alert("Error", `Error saving expense: ${error}`)
    }
  }

  // Pull in navigation via hook
  const navigation = useNavigation<NavigationProp<AppStackParamList>>()
  return (
    <Fragment>
      <Header
        titleTx="addExpenseScreen:title"
        leftIcon="back"
        onLeftPress={() => navigation.goBack()}
      />
      <Screen style={$root} safeAreaEdges={["top"]} preset="scroll">
        <View style={$form}>
          <Text>Generate from natural language</Text>
          <TextField value={naturalLanguageExpense} onChangeText={setNaturalLanguageExpense} />

          {isLoading ? <Loader /> : <Button onPress={() => generateExpense()} text={"Generate"} />}
          <View style={$orContainer}>
            <Text>OR</Text>
          </View>
          <Text>Name</Text>
          <TextField
            keyboardType="default"
            value={expense?.name}
            onChangeText={(text) => setExpense(expense ? { ...expense, name: text } : null)}
          />
          <Text>Amount</Text>
          <TextField
            keyboardType="numeric"
            value={expense?.amount?.toString()}
            onChangeText={(text) =>
              setExpense(expense ? { ...expense, amount: Number(text) || 0 } : null)
            }
          />
          <Text>Date</Text>
          <TextField
            value={expense?.date}
            onChangeText={(text) => setExpense(expense ? { ...expense, date: text } : null)}
          />
          <Text>Description</Text>
          <TextField
            value={expense?.description}
            onChangeText={(text) => setExpense(expense ? { ...expense, description: text } : null)}
          />
          <Button onPress={saveExpense} text="Save" />
        </View>
      </Screen>
    </Fragment>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $form: ViewStyle = {
  flex: 1,
  padding: "10%",
  gap: spacing.sm,
  width: "100%",
  justifyContent: "center",
}

const $orContainer: ViewStyle = {
  alignItems: "center",
  width: "100%",
  justifyContent: "center",
}
