import { GraphManifest } from "./types"

export const HtmlGeneratorManifest: GraphManifest = {
  id: "htmlGenerator",
  nodes: [
    {
      type: "agent",
      id: "jodi",
      prompt: "jodi",
      tools: ["createImage"],
      memory: "conversion"
    },
    {
      type: "agent",
      id: "davici",
      prompt: "davici",
      memory: "conversion"
    },
    {
      type: "agent",
      id: "doc",
      prompt: 'jose',
      tools: ["createImage"],
      memory: "conversion"
    }, { type: "input", id: "jodiInput" },
    { type: "input", id: "docInput" },
    { type: "input", id: "daviciInput" }
  ],
  entryNode: "jodiInput",
  edges: [
    ["doc", "docInput"], ["docInput", "doc"],
    ["jodi", "contains:LETS BUILD!davici?jodiInput"], ["jodiInput", "jodi"],
    ["daviciInput", "davici"], ["davici", "daviciInput"],
  ]
}



