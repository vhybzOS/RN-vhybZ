const en = {
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back",
    logOut: "Log Out",
    edit: "Edit",
    save: "Save",
    add: "Add",
    new: "New",
    not_found: "Item not found!"
  },
  welcomeScreen: {
    postscript: "P.S.: Usually apps don't look like this",
    readyForLaunch: "Your application is ready to launch!",
    exciting: "(Oh, this is exciting!)",
    letsGo: "Let's go!",
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle:
      "This is the screen your users will see when an error is thrown during production. You'll want to customize this message (located at 'app/i18n/en.ts') and probably the layout ('app/screens/ErrorScreen'). If you want to remove it altogether, check 'app/app.tsx' for the <ErrorBoundary> component.",
    reset: "Restart the app",
    traceTitle: "Error stack from %{name}",
  },
  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content:
        "No data found yet. Click the button to refresh or reload the app.",
      button: "Let's try again",
    },
  },
  errors: {
    invalidEmail: "The email address is invalid.",
  },
  loginScreen: {
    signIn: "Sign In",
    enterDetails:
      "Enter your details below to unlock secret information. You'll never guess what we're waiting for. Or maybe you will; it's not rocket science.",
    emailFieldLabel: "Email",
    passwordFieldLabel: "Password",
    emailFieldPlaceholder: "Enter your email address",
    passwordFieldPlaceholder: "The super secret password goes here",
    tapToSignIn: "Tap to sign in!",
    hint: "Hint: You can use any email and password you like :)",
    signup: "Sign Up",
  },
  signupScreen: {
    signUp: "Sign Up",
    enterDetails: "Enter your details below to create an account.",
    emailFieldLabel: "Email",
    emailFieldPlaceholder: "Enter your email address",
    passwordFieldLabel: "Password",
    passwordFieldPlaceholder: "Enter your password",
    confirmPasswordFieldLabel: "Confirm Password",
    confirmPasswordFieldPlaceholder: "Confirm your password",
    tapToSignUp: "Tap to sign up!",
  },
  tabNavigator: {
    tankhahTab: "Petty Cash",
    attendanceTab: "Attendance",
    noteTab: "Note"
  },
}
export default en
export type Translations = typeof en
