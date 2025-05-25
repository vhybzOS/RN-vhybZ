import { createModelContent, createUserContent, GoogleGenAI, Modality, FunctionDeclaration, Type } from "@google/genai"
import { GeminiAgent } from "./fmg/agent"
import { NodeFn, Graph, ThreadItem, Observer } from "./fmg/types"
import { GraphBuilder } from "./fmg/builder"

export function makeGraph(apiKey: string, observer: Observer): Graph {
  return new GraphBuilder("makeJSGame").addNode("doc", singleNodeHtmlGenerator(apiKey)).setEntry("doc").setObserver(observer).build()
}

export function singleNodeHtmlGenerator(apiKey: string): NodeFn {
  return async (prompt, thread: ThreadItem[]) => {
    let agent = new GeminiAgent("doctor", { functions: { "createImage": makeImage }, declarations: tools })
    agent.setAPIKey(apiKey)
    let c: ThreadItem = { name: agent.name, messages: [] }
    if (!Array.isArray(thread) || thread.length === 0 || thread[thread.length - 1].messages.length == 0 || thread[thread.length - 1].name !== "doctor") {
      c.messages.push(createModelContent(
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
\`\`\``))
      thread.push(c)
    } else {
      c = thread[thread.length - 1]
    }
    c.messages.push(createUserContent(prompt))
    return await agent.complete(thread, true)
  }
}

async function makeImage(prompt: string, genAI: GoogleGenAI): Promise<string> {
  const resp = await genAI.models.generateContent({
    model: 'gemini-2.0-flash-preview-image-generation',
    contents: prompt,
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT]

    }
  })
  if (resp.candidates && resp.candidates.length > 0 && resp.candidates[0].content?.parts && resp.candidates[0].content?.parts.length > 0) {
    for (const p of resp.candidates && resp.candidates.length > 0 && resp.candidates[0].content?.parts || []) {
      if (p.inlineData?.data)
        return p.inlineData?.data
    }
  }
  throw "no image found"
}

const tools: FunctionDeclaration[] = [
  {
    name: 'createImage',
    description: 'Create a base64 image from a prompt',
    parameters: {
      type: Type.OBJECT,
      properties: {
        prompt: {
          type: Type.STRING,
          description: "Prompt to generate image"
        }
      }
    },
  }
]
