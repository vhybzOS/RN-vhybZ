import { Content, FunctionCallingConfigMode, GenerateContentConfig, GoogleGenAI, createModelContent, createPartFromFunctionResponse, createUserContent } from "@google/genai";
import { Agent, FocusFunction, ThreadItem, Tools } from "./types";
import { fnMemory } from "./memory";
import { retry } from "./retry";



export class GeminiAgent implements Agent {
  genAI: GoogleGenAI | undefined
  name: string
  tools: Tools | undefined

  constructor(name: string, tools?: Tools) {
    this.name = name
    this.tools = tools
  }

  setAPIKey(key: string) {
    this.genAI = new GoogleGenAI({ apiKey: key })
  }

  async complete(ctx: ThreadItem[], focus: FocusFunction): Promise<ThreadItem[]> {
    if (this.genAI === undefined) {
      throw new Error("API key not set")
    }

    let tdi: ThreadItem = {
      name: this.name,
      messages: []
    }

    const input = await focus(ctx)
    if (input === undefined) {
      throw new Error("No input provided")
    }

    tdi = {
      name: this.name,
      messages: Array.isArray(input) ? input : [input]
    }


    let gc: GenerateContentConfig | undefined = undefined
    if (this.tools && this.tools.declarations.length > 0) {
      gc = {
        toolConfig: {
          functionCallingConfig: {
            mode: FunctionCallingConfigMode.AUTO,
            // allowedFunctionNames: ['createImage']
          }
        },
        tools: [{ functionDeclarations: this.tools?.declarations }]
      }
    }

    const response = await retry(() => this.genAI!.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: tdi.messages,
      config: gc,
    }), {
      retries: 5,
      baseDelay: 200,
      maxDelay: 5000,
      timeout: 100000,
      jitter: true
    })
    if (response.candidates && response.candidates.length > 0 && response.candidates[0].content) {
      tdi.messages.push(response.candidates[0].content)
    }

    if (response.functionCalls && response.functionCalls.length > 0 && response.functionCalls[0].name) {
      const func = this.tools?.functions[response.functionCalls[0].name]
      const args = response.functionCalls[0].args
      if (func !== undefined && args != undefined) {
        let res = await func(args.prompt as string, this.genAI)
        console.log(JSON.stringify(tdi.messages.at(-1)))
        let c = createUserContent(createPartFromFunctionResponse(response.functionCalls[0].id!, response.functionCalls[0].name, { output: res }))
        tdi.messages.push(c)
        return await this.complete([...ctx, tdi], fnMemory)
      }
    }
    return [...ctx, tdi]
  }
}


