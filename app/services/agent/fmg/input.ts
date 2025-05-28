import { createUserContent } from "@google/genai";
import { GraphNode, NodeFn, ThreadItem } from "./types";

const pendingInputResolvers: Record<string, (value: any) => void> = {};

export function waitForUserInput(key: string): Promise<any> {
  return new Promise((resolve) => {
    pendingInputResolvers[key] = resolve;
  });
}

export function provideUserInput(key: string, value: any) {
  const resolver = pendingInputResolvers[key];
  if (resolver) {
    resolver(value);
    delete pendingInputResolvers[key];
  }
}

export function makeInputNode(id: string, prompt?: string): NodeFn<ThreadItem[]> {
  return async (ctx: ThreadItem[]) => {
    const userInput = await waitForUserInput("id");
    return [...ctx, { name: id, messages: [createUserContent(userInput)] }];
  }

}
