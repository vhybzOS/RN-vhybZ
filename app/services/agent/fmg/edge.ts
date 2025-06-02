import { currentThread } from "app/utils/threadHelper";
import { ThreadItem } from "./types";

export function makeEdge(from: string, to: string): [string, string | ((output: ThreadItem[]) => string)] {
  const breakpoints = /[:!?]/g;
  const tokens = to.split(breakpoints);
  if (tokens.length === 1) {
    return [from, to];
  }
  if (tokens.length === 4) {
    switch (tokens[0]) {
      case "contains":
        return [from, (output: ThreadItem[]) => {
          console.log("Checking for contains condition");
          const lastMsg = output.at(-1)?.messages.at(-1)
          console.log("Last message:", lastMsg);
          if (lastMsg && lastMsg.parts) {
            for (const part of lastMsg.parts) {
              if (part.text?.includes(tokens[1])) {
                return tokens[2];
              }
            }
          }
          return tokens[3]
        }]
    }

  }
  return [from, to];
}
