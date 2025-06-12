import React, { FC, useLayoutEffect } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, FocusComponent } from "app/components"
import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface FocusScreenProps extends AppStackScreenProps<"Focus"> { }

export const FocusScreen: FC<FocusScreenProps> = observer(function FocusScreen({ route: { params } }) {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  const navigation = useNavigation()
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true, // or any other header configuration
      headerTitle: "Focus",
      isBack: true,
    });
  }, [navigation]);

  return (
    <Screen style={$root} preset="scroll">
      <FocusComponent content={params.msg} ></FocusComponent>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
