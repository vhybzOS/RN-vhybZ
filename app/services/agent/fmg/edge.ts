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
          const td = currentThread(output);
          const tdf = td.filter(i => i.name === from)
          if (tdf.length === 0) {
            throw new Error(`Node ${from} not found in the thread`);
          }
          const lastMsg = td[0].messages.at(-1)
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
