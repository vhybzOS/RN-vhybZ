import { Content, createModelContent, createUserContent } from "@google/genai";
import { FocusFunction, FocusFunctionProvider, ThreadItem } from "./types";

export class GeminiFocusFunctionProvider implements FocusFunctionProvider {
  avalible(): string[] {
    return ["session", "all", "conversion"]
  }
  getFocusFunction(type: string, id?: string, prompt?: string): FocusFunction {
    if (type == "all") {
      return async (ctx: ThreadItem[] | undefined) => {
        if (ctx === undefined || ctx.length === 0) {
          return Promise.resolve([]);
        }
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
    if (type == "conversion") {
      if (!id) {
        throw new Error("ID is required for conversion focus function");
      }
      return async (ctx: ThreadItem[]) => {
        let lastestInput = latest(latest(ctx.filter(i => i.name?.startsWith(id) && i.name?.endsWith("Input")))?.messages);
        let latestThread = latest(ctx.filter(i => i.name === id))
        if (latestThread && latestThread.messages.length > 0) {
          return [...latestThread.messages, lastestInput || createModelContent(prompt || "No input provided")];
        }
        return [createModelContent(prompt || "No input provided"), lastestInput || createUserContent("no input")];
      }
    }
    throw new Error(`Unknown focus function type: ${type}`);
  }
}

function latest<T>(arr: Array<T> | undefined): T | undefined {
  if (!arr || arr.length === 0) {
    return undefined;
  }
  return arr[arr.length - 1];
}
