import * as React from "react"
import { StyleProp, TextInput, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "app/theme"
import { IconButton, useTheme } from "react-native-paper"
import { tw } from "app/theme/tailwind"

export interface ChatInputProps {
  text: string
  onTextChange: (s: string) => void
  onSendPress: () => void
  loading: boolean
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const ChatInput = observer(function ChatInput(props: ChatInputProps) {
  const { style } = props
  const $styles = [$container, style]
  const theme = useTheme()

  return (
    <View style={[tw.flexNone, tw.flexRow, $styles]}>
      <TextInput onChangeText={props.onTextChange} value={props.text} numberOfLines={3} multiline style={[
        tw.flex,
        tw.bgGray300,
        tw.p10,
        tw.pb10,
        tw.m5,
        tw.rounded,
        { backgroundColor: theme.colors.surface, color: theme.colors.onSurface },
        { textAlignVertical: 'top' }]}></TextInput>
      <IconButton icon="send" onPress={props.onSendPress} loading={props.loading}></IconButton>
    </View >
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
}
