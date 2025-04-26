import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { AppStackScreenProps } from "app/navigators"
import { View, ViewStyle } from "react-native"
import { Chip, Icon, Button, useTheme, FAB, Menu, Appbar, List, Divider } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface StudioScreenProps extends AppStackScreenProps<"Studio"> { }

export const StudioScreen: FC<StudioScreenProps> = observer(function StudioScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  const safeArea = useSafeAreaInsets()
  return (
    <>
      <Appbar mode="small" safeAreaInsets={{ top: safeArea.top }}>
        <Appbar.Content
          // titleStyle={{ fontSize: 16 }}
          mode="small"
          title={"hello"}
        />
        {/* <Appbar.Action icon={"printer"} onPress={handlePrint} /> */}
        {/* <Appbar.Action */}
        {/*   icon={"basket"} */}
        {/*   onPress={() => { */}
        {/*     navigation.navigate("studio", {}) */}
        {/*   }} */}
        {/* /> */}
      </Appbar>
    </>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
