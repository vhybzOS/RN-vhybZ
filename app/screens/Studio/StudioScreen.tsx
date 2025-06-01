import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { AppNavigation, AppStackScreenProps } from "app/navigators"
import { View } from "react-native"
import { Chip, Text, Appbar, Surface, FAB } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ChatInput } from "app/components"
import { tw } from "app/theme/tailwind"
import { WebView } from 'react-native-webview';
import { useNavigation } from "@react-navigation/native"
import { useStores } from "app/models"
import { useGraph } from "app/services/agent/GraphContext"
import { provideUserInput } from "app/services/agent/fmg/input"
import { ThreadComponent } from "app/components"

interface StudioScreenProps extends AppStackScreenProps<"Studio"> { }

export const StudioScreen: FC<StudioScreenProps> = observer(function StudioScreen() {
  // Pull in one of our MST stores
  const { studioStore: { textInput, setProp, loading, callAgent, html, resetHistory } } = useStores()

  // Pull in navigation via hook
  const navigation = useNavigation<AppNavigation>()
  const safeArea = useSafeAreaInsets()
  const graph = useGraph()

  return (
    <>
      <Appbar mode="small" safeAreaInsets={{ top: safeArea.top }}>
        <Appbar.Content
          // titleStyle={{ fontSize: 16 }}
          // mode="small"
          title={""}
        />
        <Appbar.Action icon="alpha-f-circle" onPress={() => { navigation.navigate("Flow", undefined) }} />
        <Appbar.Action icon="autorenew" onPress={() => graph.reset()} />
        <Appbar.Action icon="cog" onPress={() => {
          navigation.navigate("Config", undefined)
        }} />
      </Appbar>
      {graph.thread.length < 1 && <Surface style={[tw.flex, tw.justifyCenter, tw.itemsCenter]}>
        <Text variant="bodyLarge">Make your idea interactive</Text>
      </Surface>
      }
      {graph.thread.length > 0 && <View style={[tw.flex]}>
        <ThreadComponent thread={graph.thread}></ThreadComponent>
      </View>}
      <Surface elevation={2} style={[tw.pt10]}>
        <View style={[tw.flexNone, tw.flexRow, tw.justifyAround, tw.pb5]}>
          <Chip selected mode="outlined">Text</Chip>
          <Chip mode="outlined">Voice</Chip>
          <Chip mode="outlined">Camera</Chip>
        </View>
        <ChatInput text={textInput} loading={loading} onTextChange={(val) => { setProp("textInput", val) }} onSendPress={() => { provideUserInput("id", textInput.trim()) }}></ChatInput>
      </Surface >
    </>
  )
})

