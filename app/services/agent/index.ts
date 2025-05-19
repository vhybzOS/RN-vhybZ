import Constants from 'expo-constants';
import { GoogleGenAI, FunctionCallingConfigMode, FunctionDeclaration, Type, Content, FunctionResponse, ContentUnion, createModelContent, createPartFromFunctionResponse, ContentListUnion, createUserContent, Modality } from "@google/genai";


class Agent {
  genAI: GoogleGenAI
  history: Content[] = []
  constructor(apiKey: string = Constants.expoConfig?.extra?.geminiAPIKey) {
    console.log("agent key:", apiKey)
    this.genAI = new GoogleGenAI({ apiKey })
  }

  async call(content: Content[] | Content): Promise<Content> {
    if (Array.isArray(content)) {
      this.history.push(...content)
    } else {
      this.history.push(content)
    }
    const response = await this.genAI.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: this.history,
      config: {
        toolConfig: {
          functionCallingConfig: {
            mode: FunctionCallingConfigMode.AUTO,
            // allowedFunctionNames: ['createImage']
          }
        },
        tools: [{ functionDeclarations: tools }]
      }
    })


    if (response.candidates && response.candidates.length > 0 && response.candidates[0].content) {
      this.history.push(response.candidates[0].content)
    }

    console.log("")
    if (response.functionCalls) {
      if (response.functionCalls[0].name === 'createImage') {
        if (response.functionCalls[0].args) {
          console.log(response.functionCalls[0])
          let res = await makeImage(response.functionCalls[0].args.prompt as string, this.genAI)
          console.log("inside func call")
          let c = createModelContent(createPartFromFunctionResponse(response.functionCalls[0].id || "", "createImage", { output: res }))
          await this.call(c)

        }
      }
    }
    if (response.candidates && response.candidates.length > 0 && response.candidates[0].content) {
      return this.history[this.history.length - 1]
    }
    else
      throw Error("No response from agent")


  }
}

const tools: FunctionDeclaration[] = [
  {
    name: 'createImage',
    description: 'Create an base64 image from a prompt',
    parameters: {
      type: Type.OBJECT,
      description: 'set prompt that describe image you want to create',
      properties: {
        prompt: {
          type: Type.STRING,
          description: "Prompt to generate image"
        }
      }
    },
  }
]

async function makeImage(prompt: string, genAI: GoogleGenAI): Promise<string> {
  const resp = await genAI.models.generateContent({
    model: 'gemini-2.0-flash-preview-image-generation',
    contents: prompt,
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT]

    }
  })
  console.log("image generation", resp.candidates[0].content)
  for (const p of resp.candidates[0].content?.parts || []) {
    if (p.inlineData)
      return resp.candidates[0].content?.parts[0].inlineData
  }
  throw "no image found"
}


export class HtmlGenerator extends Agent {
  async Generate(prompt: string): Promise<string> {
    let c = [createModelContent(
      `you are the best software engineer, base on user request create a mobile responsive html.
response example:
\`\`\`html
<!doctype html>
<html>
  <head>
    <title>This is the title of the webpage!</title>
  </head>
  <body>
    <p>This is an example paragraph. Anything in the <strong>body</strong> tag will appear on the page, just like this <strong>p</strong> tag and its contents.</p>
  </body>
</html>
\`\`\``), createUserContent(prompt)]
    let res = await this.call(c)
    return res.parts ? res.parts[0].text || "" : ""
  }
}

console.log((new HtmlGenerator()))

//export const htmlGenerator = new HtmlGenerator()
