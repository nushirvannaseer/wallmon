import { FC, useEffect, useState, Fragment } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { AppStackParamList, AppStackScreenProps } from "@/navigators"
import { Screen, Text, Button, TextField, Header } from "@/components"
import { loadString, remove, saveString } from "@/utils/storage"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { colors } from "@/theme"

interface SetBudgetScreenProps extends AppStackScreenProps<"SetBudget"> {}

export const SetBudgetScreen: FC<SetBudgetScreenProps> = observer(function SetBudgetScreen(_props) {
  const [budget, setBudget] = useState<number>(0)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const navigation = useNavigation<NavigationProp<AppStackParamList>>()

  const handleSetBudget = async () => {
    await saveString("Budget", budget.toString())
    setIsEditing(false)
  }

  useEffect(() => {
    const loadBudget = async () => {
      const _budget = await loadString("Budget")
      if (_budget) {
        setBudget(parseInt(_budget))
      }
    }
    loadBudget()
  }, [])

  return (
    <Fragment>
      <Header backgroundColor={colors.palette.primary600} titleTx="setBudgetScreen:title" />
      <Screen
        style={$root}
        preset="scroll"
        safeAreaEdges={["top"]}
        contentContainerStyle={$contentContainer}
      >
        <View style={$inputContainer}>
          {budget === 0 || isEditing ? (
            <Fragment>
              <TextField
                placeholder="Enter your budget"
                onChangeText={(text) => setBudget(parseInt(text))}
                keyboardType="numeric"
                style={$input}
              />
              <View style={$buttonContainer}>
                <Button style={$editButton} onPress={handleSetBudget} text="Set Budget" />
              </View>
            </Fragment>
          ) : (
            <View style={$editContainer}>
              <Text style={$budgetText}>Rs. {budget}</Text>
              <Button style={$editButton} onPress={() => setIsEditing(true)} text="Edit Budget" />
            </View>
          )}
        </View>
        <Button
          style={$button}
          onPress={() => navigation.navigate("AddExpense")}
          text="Add Expense"
        />
        <Button style={$button} onPress={() => navigation.navigate("Settings")} text="Settings" />
        <Button
          style={$button}
          onPress={() => navigation.navigate("DetectedTransactions")}
          text="Detected Transactions"
        />
        <Button
          style={$button}
          onPress={() => navigation.navigate("ExpenseHistory")}
          text="Expense History"
        />
        <View style={$buttonContainer}>
          <Button
            style={$button}
            onPress={() => remove("geminiResponse")}
            text="Clear Notification History"
          />
          <Button
            style={$button}
            onPress={() => remove("expenseHistory")}
            text="Clear Expense History"
          />
        </View>
      </Screen>
    </Fragment>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $contentContainer: ViewStyle = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  alignItems: "center",
}

const $inputContainer: ViewStyle = {
  padding: 20,
  width: "100%",
}

const $input: TextStyle = {
  borderRadius: 10,
  margin: 10,
  height: "100%",
  width: "100%",
}

const $button: ViewStyle = {
  margin: 10,
  width: "75%",
  backgroundColor: colors.palette.primary500,
  borderRadius: 10,
}

const $editButton: ViewStyle = {
  width: "50%",
  marginTop: 10,
}

const $buttonContainer: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
}

const $budgetText: TextStyle = {
  fontSize: 24,
  fontWeight: "bold",
  textAlign: "center",
}

const $editContainer: ViewStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
}
