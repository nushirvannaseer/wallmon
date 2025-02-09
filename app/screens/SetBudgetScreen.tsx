import { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Screen, Text, Button, TextField } from "@/components"
import { saveString } from "@/utils/storage"
import { useNavigation } from "@react-navigation/native"

// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

interface SetBudgetScreenProps extends AppStackScreenProps<"SetBudget"> {}

export const SetBudgetScreen: FC<SetBudgetScreenProps> = observer(function SetBudgetScreen(_props) {
  const [budget, setBudget] = useState(0)
  const navigation = useNavigation()

  const handleSetBudget = (text: string) => {
    setBudget(parseInt(text))
    saveString("budget", text)
  }

  return (
    <Screen
      style={$root}
      preset="scroll"
      safeAreaEdges={["top"]}
      contentContainerStyle={$contentContainer}
    >
      {/* <Button style={$menuButton} onPress={navigation.toggleDrawer} text="☰" /> */}
      <Text style={$title} tx={"setBudgetScreen:title"} />
      <View style={$inputContainer}>
        <TextField
          placeholder="Enter your budget"
          onChangeText={handleSetBudget}
          keyboardType="numeric"
          style={$input}
        />
      </View>
      <Button
        style={$button}
        onPress={() => navigation.navigate("Settings" as never)}
        text="Settings"
      />
      <Button
        style={$button}
        onPress={() => navigation.navigate("DetectedTransactions" as never)}
        text="Detected Transactions"
      />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $contentContainer: ViewStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
}

const $title: TextStyle = {
  fontSize: 24,
  fontWeight: "bold",
  textAlign: "center",
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
}

const $menuButton: ViewStyle = {
  position: "absolute",
  top: 10,
  left: 10,
  width: 50,
  height: 50,
}
