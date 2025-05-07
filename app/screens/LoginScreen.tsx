import { observer } from "mobx-react-lite"
import React, { FC, useRef, useState } from "react"
import { TextInput, TextStyle, ViewStyle } from "react-native"
import { Button, Screen, Text, TextField } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps, AppNavigation } from "../navigators"
import { colors, spacing } from "../theme"
import { useNavigation } from "@react-navigation/native"

interface LoginScreenProps extends AppStackScreenProps<"Login"> { }

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const navigation = useNavigation<AppNavigation>()
  const authPasswordInput = useRef<TextInput>(null)

  const [authPassword, setAuthPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const [error, setError] = useState("")
  const {
    authenticationStore: { authEmail, setAuthEmail, validationError, login },
  } = useStores()

  const handleLogin = async () => {
    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)

    if (validationError) {
      setError(validationError)
      return
    }

    const { error: loginError } = await login(authEmail, authPassword)
    
    if (loginError) {
      setError(loginError instanceof Error ? loginError.message : "An error occurred during login")
      return
    }

    setIsSubmitted(false)
    setAuthPassword("")
    setError("")
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text testID="login-heading" tx="loginScreen.signIn" style={$signIn} />
      <Text tx="loginScreen.enterDetails" style={$enterDetails} />
      {attemptsCount > 2 && <Text tx="loginScreen.hint" style={$hint} />}
      {error ? <Text text={error} style={$error} /> : null}

      <TextField
        value={authEmail}
        onChangeText={setAuthEmail}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="loginScreen.emailFieldLabel"
        placeholderTx="loginScreen.emailFieldPlaceholder"
        helper={isSubmitted ? validationError : ""}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <TextField
        ref={authPasswordInput}
        value={authPassword}
        onChangeText={setAuthPassword}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        labelTx="loginScreen.passwordFieldLabel"
        placeholderTx="loginScreen.passwordFieldPlaceholder"
        onSubmitEditing={handleLogin}
      />

      <Button
        testID="login-button"
        tx="loginScreen.tapToSignIn"
        style={$tapButton}
        onPress={handleLogin}
      />
      
      <Button
        testID="signup-button"
        tx="loginScreen.signup"
        style={$tapButton}
        onPress={() => navigation.navigate("Signup")}
      />
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
}

const $signIn: TextStyle = {
  marginBottom: spacing.sm,
}

const $enterDetails: TextStyle = {
  marginBottom: spacing.lg,
}

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.md,
}

const $error: TextStyle = {
  color: colors.error,
  marginBottom: spacing.md,
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
}
