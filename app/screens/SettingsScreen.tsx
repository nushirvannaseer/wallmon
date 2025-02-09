import { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { AppState, TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Screen, Switch, Text } from "@/components"
import NotificationListener from "react-native-notification-listener"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

interface SettingsScreenProps extends AppStackScreenProps<"Settings"> {}

export const SettingsScreen: FC<SettingsScreenProps> = observer(function SettingsScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  const [hasNotificationPermission, setHasNotificationPermission] = useState("denied")

  const checkPermission = async () => {
    const status = await NotificationListener.getPermissionStatus()
    setHasNotificationPermission(status)
    console.log("status:", status)
    return status
  }

  useEffect(() => {
    // Listen for app state changes
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        // App has come to the foreground
        checkPermission()
      }
    })

    // Initial check
    checkPermission()

    // Cleanup subscription
    return () => {
      subscription.remove()
    }
  }, []) // Remove hasNotificationPermission from dependencies

  return (
    <Screen
      style={$root}
      preset="scroll"
      safeAreaEdges={["top"]}
      contentContainerStyle={$contentContainer}
    >
      <Text text="settings" style={$title} />
      <View style={$switchContainer}>
        <Text
          text="Allow the app to read your notifications and determine whether you spent or received money"
          style={$switchTitle}
        />
        <Switch
          value={hasNotificationPermission === "authorized"}
          onValueChange={() => NotificationListener.requestPermission()}
        />
      </View>
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

const $switchTitle: TextStyle = {
  fontSize: 16,
  fontWeight: "bold",
  textAlign: "center",
}

const $switchContainer: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "space-between",
  margin: 10,
  width: "75%",
}
