import React, { FC, useLayoutEffect } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text, TextField } from "app/components"
// import { useNavigation } from "@react-navigation/native"
import { useStores } from "app/models"

interface ConfigScreenProps extends AppStackScreenProps<"Config"> { }

export const ConfigScreen: FC<ConfigScreenProps> = observer(function ConfigScreen() {
  // Pull in one of our MST stores
  const { configStore: { geminiAPIKey, setProp } } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  //
  return (
    <Screen style={$root} preset="fixed">
      <TextField labelTx="configScreen.geminiKey" style={[]} value={geminiAPIKey} onChangeText={t => setProp("geminiAPIKey", t)} />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  padding: 10,
}
