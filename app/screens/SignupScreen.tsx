import { observer } from "mobx-react-lite"
import React, { FC, useRef, useState } from "react"
import { TextInput, TextStyle, ViewStyle } from "react-native"
import { Button, Screen, Text, TextField } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"

interface SignupScreenProps extends AppStackScreenProps<"Signup"> { }

export const SignupScreen: FC<SignupScreenProps> = observer(function SignupScreen(_props) {
  const passwordInput = useRef<TextInput>(null)
  const confirmPasswordInput = useRef<TextInput>(null)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isPasswordHidden, setIsPasswordHidden] = useState(true)
  const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const {
    authenticationStore: { setAuthEmail, validationError, signUp },
  } = useStores()

  const handleSignup = async () => {
    setIsSubmitted(true)
    setError("")
    console.log("email", email)
    setAuthEmail(email)
    
    if (validationError) {
      setError(validationError)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    const { error: signupError } = await signUp(email, password)
    
    if (signupError) {
      setError(signupError instanceof Error ? signupError.message : "An error occurred during signup")
      return
    }

    setIsSubmitted(false)
    setPassword("")
    setConfirmPassword("")
    setError("")
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text testID="signup-heading" tx="signupScreen.signUp" style={$signUp} />
      <Text tx="signupScreen.enterDetails" style={$enterDetails} />
      {error ? <Text text={error} style={$error} /> : null}

      <TextField
        value={email}
        onChangeText={setEmail}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="signupScreen.emailFieldLabel"
        placeholderTx="signupScreen.emailFieldPlaceholder"
        helper={isSubmitted ? validationError : ""}
        onSubmitEditing={() => passwordInput.current?.focus()}
      />

      <TextField
        ref={passwordInput}
        value={password}
        onChangeText={setPassword}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isPasswordHidden}
        labelTx="signupScreen.passwordFieldLabel"
        placeholderTx="signupScreen.passwordFieldPlaceholder"
        onSubmitEditing={() => confirmPasswordInput.current?.focus()}
      />

      <TextField
        ref={confirmPasswordInput}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isConfirmPasswordHidden}
        labelTx="signupScreen.confirmPasswordFieldLabel"
        placeholderTx="signupScreen.confirmPasswordFieldPlaceholder"
        onSubmitEditing={handleSignup}
      />

      <Button
        testID="signup-button"
        tx="signupScreen.tapToSignUp"
        style={$tapButton}
        onPress={handleSignup}
      />
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
}

const $signUp: TextStyle = {
  marginBottom: spacing.sm,
}

const $enterDetails: TextStyle = {
  marginBottom: spacing.lg,
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