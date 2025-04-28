import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { AppStackScreenProps } from "app/navigators"
import { View, ViewStyle, Text } from "react-native"
import { Chip, Icon, Button, useTheme, FAB, Menu, Appbar, List, Divider } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ChatInput } from "app/components"
import { tw } from "app/theme/tailwind"
import { WebView } from 'react-native-webview';
// import { useNavigation } from "@react-navigation/native"
import { useStores } from "app/models"

interface StudioScreenProps extends AppStackScreenProps<"Studio"> { }

export const StudioScreen: FC<StudioScreenProps> = observer(function StudioScreen() {
  // Pull in one of our MST stores
  const { studioStore: {textInput, setProp, loading, callAgent, html, resetHistory} } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  const safeArea = useSafeAreaInsets()
  return (
    <>
      <Appbar mode="small" safeAreaInsets={{ top: safeArea.top }}>
        <Appbar.Content
          // titleStyle={{ fontSize: 16 }}
          // mode="small"
          title={"Studio"}
        />
        <Appbar.Action icon="autorenew" onPress={resetHistory} />
        {/* <Appbar.Action */}
        {/*   icon={"basket"} */}
        {/*   onPress={() => { */}
        {/*     navigation.navigate("studio", {}) */}
        {/*   }} */}
        {/* /> */}
      </Appbar>
      <View style={[tw.flex,tw.pb10,tw.pl5, tw.pr5]}>
        <WebView
          source={html?{html:html} :{ uri: 'https://expo.dev' }}
        />
      </View>
      <View style={[tw.flexNone, tw.flexRow, tw.justifyAround]}>
        <Chip mode="outlined">Text</Chip>
        <Chip mode="outlined">Voice</Chip>
        <Chip mode="outlined">Camera</Chip>
      </View>
      <ChatInput text={textInput} loading={loading} onTextChange={(val)=>{setProp("textInput",val)}} onSendPress={callAgent}></ChatInput>
    </>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

