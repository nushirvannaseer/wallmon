import { ActivityIndicator, StyleProp, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { useAppTheme } from "@/utils/useAppTheme"

export interface LoaderProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  /**
   * Size of the loading indicator
   */
  size?: "small" | "large"
}

/**
 * A loading indicator component that displays a centered ActivityIndicator
 */
export const Loader = observer(function Loader(props: LoaderProps) {
  const { style, size = "large" } = props
  const $styles = [$container, style]
  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <View style={$styles}>
      <ActivityIndicator size={size} color={colors.palette.primary500} />
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  flex: 1,
}
