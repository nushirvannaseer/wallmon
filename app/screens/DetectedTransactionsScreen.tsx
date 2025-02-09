import { FC } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Screen, Text, Button } from "@/components"
import { load } from "@/utils/storage"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

interface DetectedTransactionsScreenProps extends AppStackScreenProps<"DetectedTransactions"> {}

export const DetectedTransactionsScreen: FC<DetectedTransactionsScreenProps> = observer(
  function DetectedTransactionsScreen() {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()
    let history = load<any[]>("geminiResponse") ?? []
    history = JSON.parse(history.toString())

    // Pull in navigation via hook
    // const navigation = useNavigation()
    return (
      <Screen style={$root} preset="scroll" safeAreaEdges={["top", "bottom"]}>
        <Text text="detectedTransactions" />
        <View>
          {history
            .filter((item) => item.isTransaction)
            .map((response, index) => (
              <View style={$responseContainer} key={index}>
                <Text style={$responseText} text={response.summary} />
                <Text style={$responseIsTransaction} text={response.isTransaction.toString()} />
              </View>
            ))}
        </View>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}

const $responseContainer: ViewStyle = {
  flex: 1,
  backgroundColor: "black",
  padding: 10,
  marginHorizontal: 20,
  marginVertical: 0,
  shadowColor: "white",
  borderBottomColor: "gray",
  borderBottomWidth: 1,
  height: 100,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
}

const $responseText: TextStyle = {
  fontSize: 14,
  fontWeight: "bold",
}

const $responseIsTransaction: TextStyle = {
  fontSize: 12,
  fontWeight: "bold",
}
