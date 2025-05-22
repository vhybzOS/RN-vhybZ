import { Content, FunctionCallingConfigMode, FunctionDeclaration, GoogleGenAI, createModelContent, createPartFromFunctionResponse } from "@google/genai";
import { Agent, ThreadItem } from "./types";

export type Tool = {
  declarations: FunctionDeclaration[];
  functions: Record<string, Function>;
}

export class GeminiAgent implements Agent {
  genAI: GoogleGenAI | undefined
  name: string
  tools: Tool | undefined

  constructor(name: string, tools?: Tool) {
    this.name = name
    this.tools = tools
  }

  setAPIKey(key: string) {
    this.genAI = new GoogleGenAI({ apiKey: key })
  }

  async complete(ctx: ThreadItem[], sesstion?: boolean): Promise<ThreadItem[]> {
    if (this.genAI === undefined) {
      throw new Error("API key not set")
    }

    let tdi: ThreadItem = {
      name: this.name,
      messages: []
    }
    if (sesstion && ctx.length > 0) {
      tdi = {
        name: ctx[ctx.length - 1].name,
        messages: [...ctx[ctx.length - 1].messages]
      }
    } else {
      const input = await this.focus(ctx)
      if (input === undefined) {
        throw new Error("No input provided")
      }

      tdi = {
        name: this.name,
        messages: Array.isArray(input) ? input : [input]
      }
    }

    const response = await this.genAI.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: tdi.messages,
      config: {
        toolConfig: {
          functionCallingConfig: {
            mode: FunctionCallingConfigMode.AUTO,
            // allowedFunctionNames: ['createImage']
          }
        },
        tools: [{ functionDeclarations: this.tools?.declarations }]
      }
    })
    if (response.candidates && response.candidates.length > 0 && response.candidates[0].content) {
      tdi.messages.push(response.candidates[0].content)
    }

    if (response.functionCalls && response.functionCalls.length > 0 && response.functionCalls[0].name) {
      const func = this.tools?.functions[response.functionCalls[0].name]
      const args = response.functionCalls[0].args
      if (func !== undefined && args != undefined) {
        console.log(response.functionCalls[0])
        let res = await func(args.prompt as string, this.genAI)
        console.log("inside func call")
        let c = createModelContent(createPartFromFunctionResponse(response.functionCalls[0].id || "", "createImage", { output: res }))
        tdi.messages.push(c)
        return await this.complete([...ctx.slice(0, ctx.length - 1), tdi], true)

      }
    }
    return [...ctx, tdi]
  }
  focus(ctx: ThreadItem[]): Promise<Content | Content[]> {
    let acc: Content[] = []
    ctx.forEach((i) => {
      return acc.concat(i.messages)
    })
    return Promise.resolve(acc)
  }
}


