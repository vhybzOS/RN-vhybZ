import { Content, createModelContent, createUserContent } from "@google/genai";
import { FocusFunction, FocusFunctionProvider, Prompt, PromptProvider, ThreadItem } from "./types";
import { getPrompt } from "./prompt";

export class GeminiFocusFunctionProvider implements FocusFunctionProvider {
  avalible(): string[] {
    return ["session", "all", "conversion"]
  }
  getFocusFunction(type: string, id?: string, promptFn?: Prompt): FocusFunction {
    let prompt: undefined | string = undefined

    if (type == "all") {
      return async (ctx: ThreadItem[] | undefined) => {
        if (ctx === undefined || ctx.length === 0) {
          return Promise.resolve([]);
        }
        let acc: Content[] = []
        ctx.forEach((i) => {
          return acc.concat(i.messages)
        })
        if (promptFn) {
          acc.push(createModelContent(await getPrompt(promptFn)))
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
        let lastestInput = ctx.at(-1)?.messages.at(-1);
        let latestThread = latest(ctx.filter(i => i.name === id))
        if (latestThread && latestThread.messages.length > 0) {
          const contetnt = [...latestThread.messages];
          if (lastestInput && lastestInput.parts) {
            contetnt.push(createUserContent(lastestInput.parts));
          }
          return contetnt
        }
        const content: Content[] = []
        if (promptFn) {
          content.push(createModelContent(await getPrompt(promptFn)));
        }
        if (lastestInput && lastestInput.parts) {
          content.push(createUserContent(lastestInput.parts));
        }
        return content;
      }
    }
    throw new Error(`Unknown focus function type: ${type}`);
  }
}

export const fnMemory: FocusFunction = (thread: ThreadItem[]) => {
  const msgs = thread.at(-1)?.messages
  if (!msgs) {
    throw Error("function call can not be empty")
  }
  return Promise.resolve(msgs)
}

function latest<T>(arr: Array<T> | undefined): T | undefined {
  if (!arr || arr.length === 0) {
    return undefined;
  }
  return arr[arr.length - 1];
}
