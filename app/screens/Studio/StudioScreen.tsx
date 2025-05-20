import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { AppStackScreenProps } from "app/navigators"
import { View } from "react-native"
import { Chip, Text, Appbar, Surface } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ChatInput } from "app/components"
import { tw } from "app/theme/tailwind"
import { WebView } from 'react-native-webview';
// import { useNavigation } from "@react-navigation/native"
import { useStores } from "app/models"

interface StudioScreenProps extends AppStackScreenProps<"Studio"> { }

export const StudioScreen: FC<StudioScreenProps> = observer(function StudioScreen() {
  // Pull in one of our MST stores
  const { studioStore: { textInput, setProp, loading, callAgent, html, resetHistory } } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  const safeArea = useSafeAreaInsets()
  return (
    <>
      <Appbar mode="small" safeAreaInsets={{ top: safeArea.top }}>
        {/* <Appbar.Content */}
        {/*   // titleStyle={{ fontSize: 16 }} */}
        {/*   // mode="small" */}
        {/*   title={"Studio"} */}
        {/* /> */}
        <Appbar.Action icon="autorenew" onPress={resetHistory} />
      </Appbar>
      {!html && <Surface style={[tw.flex, tw.justifyCenter, tw.itemsCenter]}>
        <Text variant="bodyLarge">Make your idea interactive</Text>
      </Surface>
      }
      {html && <View style={[tw.flex, tw.pb10, tw.pl5, tw.pr5]}>
        <WebView
          source={html ? { html: html } : { html: defaultPage }}
        />
      </View>}
      <Surface elevation={2} style={[tw.pt10]}>
        <View style={[tw.flexNone, tw.flexRow, tw.justifyAround, tw.pb5]}>
          <Chip selected mode="outlined">Text</Chip>
          <Chip mode="outlined">Voice</Chip>
          <Chip mode="outlined">Camera</Chip>
        </View>
        <ChatInput text={textInput} loading={loading} onTextChange={(val) => { setProp("textInput", val) }} onSendPress={callAgent}></ChatInput>
      </Surface>
    </>
  )
})

const defaultPage = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Make Your Idea Interactive</title>
  <style>
    body {
      margin: 0;
      font-family: 'Segoe UI', sans-serif;
      background: linear-gradient(to bottom right, #f9fafb, #e0f7fa);
      color: #333;
      overflow-x: hidden;
    }

    header {
      background: #00bcd4;
      color: white;
      padding: 3rem 2rem;
      text-align: center;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    header h1 {
      font-size: 3rem;
      margin: 0;
      animation: floatIn 1s ease-in-out;
    }

    header p {
      font-size: 1.2rem;
      margin-top: 1rem;
      animation: fadeIn 2s ease-in-out;
    }

    main {
      padding: 2rem;
      max-width: 800px;
      margin: auto;
    }

    .card {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 8px 20px rgba(0,0,0,0.05);
      margin-bottom: 2rem;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
    }

    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.1);
    }

    .card h2 {
      margin-top: 0;
      font-size: 1.5rem;
    }

    .card p {
      font-size: 1rem;
      color: #666;
    }

    .interactive-zone {
      margin-top: 2rem;
      text-align: center;
    }

    button {
      background-color: #00bcd4;
      border: none;
      color: white;
      padding: 1rem 2rem;
      font-size: 1rem;
      border-radius: 2rem;
      cursor: pointer;
      transition: background 0.3s;
    }

    button:hover {
      background-color: #0097a7;
    }

    #ideaOutput {
      margin-top: 1.5rem;
      font-size: 1.2rem;
      color: #444;
    }

    @keyframes floatIn {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    footer {
      text-align: center;
      padding: 2rem;
      font-size: 0.9rem;
      color: #888;
    }
  </style>
</head>
<body>

<header>
  <h1>✨ Make Your Idea Interactive</h1>
  <p>Engage your users with interactive design and smooth experiences</p>
</header>

<main>
  <div class="card">
    <h2>Why Interactive Matters</h2>
    <p>Interactive design keeps users engaged, helps them understand your value, and turns ideas into experiences.</p>
  </div>

  <div class="card">
    <h2>Your Idea in Action</h2>
    <p>Click the button below to generate a personalized interactive pitch for your user.</p>
  </div>
</main>


<script>
  const ideas = [
    "You're not just building a product—you're shaping the future of interaction.",
    "Every click, every animation, every response is a piece of magic.",
    "This is not just an interface. It's a journey.",
    "Ideas become unforgettable when users feel them."
  ];

  function showIdea() {
    const output = document.getElementById('ideaOutput');
    const idea = ideas[Math.floor(Math.random() * ideas.length)];
    output.textContent = idea;
    output.style.opacity = 0;
    setTimeout(() => {
      output.style.opacity = 1;
      output.style.transition = 'opacity 0.5s ease-in-out';
    }, 100);
  }
</script>

</body>
</html>
`


