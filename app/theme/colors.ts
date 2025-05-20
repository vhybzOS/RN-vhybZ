// TODO: write documentation for colors and palette in own markdown file and add links from here

const palette = {
  neutral100: "#FFFFFF",
  neutral200: "#F4F2F1",
  neutral300: "#D7CEC9",
  neutral400: "#B6ACA6",
  neutral500: "#978F8A",
  neutral600: "#564E4A",
  neutral700: "#3C3836",
  neutral800: "#191015",
  neutral900: "#000000",

  primary100: "#F4E0D9",
  primary200: "#E8C1B4",
  primary300: "#DDA28E",
  primary400: "#D28468",
  primary500: "#C76542",
  primary600: "#A54F31",

  secondary100: "#DCDDE9",
  secondary200: "#BCC0D6",
  secondary300: "#9196B9",
  secondary400: "#626894",
  secondary500: "#41476E",

  accent100: "#FFEED4",
  accent200: "#FFE1B2",
  accent300: "#FDD495",
  accent400: "#FBC878",
  accent500: "#FFBB50",

  angry100: "#F2D6CD",
  angry500: "#C03403",

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",
} as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: palette.neutral800,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral200,
  /**
   * The default border color.
   */
  border: palette.neutral400,
  /**
   * The main tinting color.
   */
  tint: palette.primary500,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.angry500,
  /**
   * Error Background.
   *
   */
  errorBackground: palette.angry100,
}



export const CustomMD3Dark = {
  "colors": {
    "primary": "rgb(246, 173, 255)",
    "onPrimary": "rgb(86, 0, 104)",
    "primaryContainer": "rgb(122, 0, 146)",
    "onPrimaryContainer": "rgb(254, 214, 255)",
    "secondary": "rgb(255, 185, 94)",
    "onSecondary": "rgb(71, 42, 0)",
    "secondaryContainer": "rgb(101, 62, 0)",
    "onSecondaryContainer": "rgb(255, 221, 184)",
    "tertiary": "rgb(171, 199, 255)",
    "onTertiary": "rgb(0, 47, 102)",
    "tertiaryContainer": "rgb(0, 69, 144)",
    "onTertiaryContainer": "rgb(215, 226, 255)",
    "error": "rgb(255, 180, 171)",
    "onError": "rgb(105, 0, 5)",
    "errorContainer": "rgb(147, 0, 10)",
    "onErrorContainer": "rgb(255, 180, 171)",
    "background": "rgb(30, 26, 30)",
    "onBackground": "rgb(233, 224, 228)",
    "surface": "rgb(30, 26, 30)",
    "onSurface": "rgb(233, 224, 228)",
    "surfaceVariant": "rgb(77, 68, 76)",
    "onSurfaceVariant": "rgb(208, 195, 205)",
    "outline": "rgb(153, 141, 150)",
    "outlineVariant": "rgb(77, 68, 76)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(233, 224, 228)",
    "inverseOnSurface": "rgb(51, 47, 50)",
    "inversePrimary": "rgb(160, 0, 191)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(41, 33, 41)",
      "level2": "rgb(47, 38, 48)",
      "level3": "rgb(54, 42, 55)",
      "level4": "rgb(56, 44, 57)",
      "level5": "rgb(60, 47, 62)"
    },
    "surfaceDisabled": "rgba(233, 224, 228, 0.12)",
    "onSurfaceDisabled": "rgba(233, 224, 228, 0.38)",
    "backdrop": "rgba(54, 46, 53, 0.4)"
  }
}

export const CustomMD3Light = {
  "colors": {
    "primary": "rgb(160, 0, 191)",
    "onPrimary": "rgb(255, 255, 255)",
    "primaryContainer": "rgb(254, 214, 255)",
    "onPrimaryContainer": "rgb(53, 0, 65)",
    "secondary": "rgb(133, 83, 0)",
    "onSecondary": "rgb(255, 255, 255)",
    "secondaryContainer": "rgb(255, 221, 184)",
    "onSecondaryContainer": "rgb(42, 23, 0)",
    "tertiary": "rgb(0, 92, 188)",
    "onTertiary": "rgb(255, 255, 255)",
    "tertiaryContainer": "rgb(215, 226, 255)",
    "onTertiaryContainer": "rgb(0, 27, 63)",
    "error": "rgb(186, 26, 26)",
    "onError": "rgb(255, 255, 255)",
    "errorContainer": "rgb(255, 218, 214)",
    "onErrorContainer": "rgb(65, 0, 2)",
    "background": "rgb(255, 251, 255)",
    "onBackground": "rgb(30, 26, 30)",
    "surface": "rgb(255, 251, 255)",
    "onSurface": "rgb(30, 26, 30)",
    "surfaceVariant": "rgb(236, 223, 233)",
    "onSurfaceVariant": "rgb(77, 68, 76)",
    "outline": "rgb(126, 116, 125)",
    "outlineVariant": "rgb(208, 195, 205)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(51, 47, 50)",
    "inverseOnSurface": "rgb(247, 238, 243)",
    "inversePrimary": "rgb(246, 173, 255)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(250, 238, 252)",
      "level2": "rgb(247, 231, 250)",
      "level3": "rgb(245, 223, 248)",
      "level4": "rgb(244, 221, 247)",
      "level5": "rgb(242, 216, 246)"
    },
    "surfaceDisabled": "rgba(30, 26, 30, 0.12)",
    "onSurfaceDisabled": "rgba(30, 26, 30, 0.38)",
    "backdrop": "rgba(54, 46, 53, 0.4)"
  }
}
