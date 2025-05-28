import { Content, createModelContent } from "@google/genai";
import { FocusFunction, FocusFunctionProvider, ThreadItem } from "./types";

export class GeminiFocusFunctionProvider implements FocusFunctionProvider {
  avalible(): string[] {
    return ["session", "all"]
  }
  getFocusFunction(type: string, id?: string, prompt?: string): FocusFunction {
    if (type == "all") {
      return async (ctx: ThreadItem[]) => {
        let acc: Content[] = []
        ctx.forEach((i) => {
          return acc.concat(i.messages)
        })
        if (prompt) {
          acc.push(createModelContent(prompt))
        }
        return Promise.resolve(acc)
      }
    }
    if (type == "session") {
      return async (ctx: ThreadItem[]) => {
        let c = ctx.filter(p => p.name == id)
        if (c.length > 0) {
          return c[c.length - 1].messages
        }
        if (prompt) {
          return [createModelContent(prompt)]
        }
        return [] as Content[]
      }
    }
    throw new Error(`Unknown focus function type: ${type}`);
  }
}
