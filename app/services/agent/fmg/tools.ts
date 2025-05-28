import { GoogleGenAI, Modality, FunctionDeclaration, Type } from "@google/genai"
import { ToolProvider, Tools } from "./types"

async function createImageFn(prompt: string, genAI: GoogleGenAI): Promise<string> {
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

const createImageDec: FunctionDeclaration =
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


export class GeminiToolProvider implements ToolProvider {
  private funcs: Map<string, [FunctionDeclaration, Function]> = new Map()

  constructor() {
    this.funcs.set('createImage', [createImageDec, createImageFn])
  }

  avalible(): string[] {
    return Object.keys(this.funcs)
  }

  getTools(...name: string[]): Tools | undefined {
    let tools: Tools = {
      functions: {},
      declarations: []
    }
    for (const n of name) {
      if (this.funcs.has(n)) {
        tools.functions[n] = this.funcs.get(n)![1]
        tools.declarations.push(this.funcs.get(n)![0])
      }
    }
    return tools.declarations.length > 0 ? tools : undefined
  }
}

