import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { GraphView, Screen, Text } from "app/components"
import { useGraph } from "app/services/agent/GraphContext"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface FlowScreenProps extends AppStackScreenProps<"Flow"> { }

export const FlowScreen: FC<FlowScreenProps> = observer(function FlowScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()

  const graph = useGraph()
  return (
    <Screen style={$root} preset="fixed">
      {graph && graph.graph && <GraphView graph={graph.graph} />}
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
