import { GraphManifest } from "./types"

export const HtmlGeneratorManifest: GraphManifest = {
  id: "htmlGenerator",
  nodes: [{
    type: "agent",
    id: "doc",
    prompt: `you are the best software engineer, base on user request create a mobile responsive html.
response example:
\`\`\`html
<!doctype html>
<html>
  <head>
    <title>This is the title of the webpage!</title>
  </head>
  <body>
    <p>This is an example paragraph. Anything in the <strong>body</strong> tag will appear on the page, just like this <strong>p</strong> tag and its contents.</p>
  </body>
</html>
\`\`\``,
    tools: ["createImage"],
    memory: "conversion"
  }, { type: "input", id: "docInput", prompt: "Please provide the user request for the HTML generation." }],
  entryNode: "docInput",
  edges: [["doc", "docInput"], ["docInput", "doc"]]
}

