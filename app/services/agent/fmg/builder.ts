import { Graph, GraphNode, GraphEdge, NodeFn, Observer, ThreadItem, FocusFunction, FocusFunctionProvider, Tools, ToolProvider } from "./types";
import { executeGraphPersistent } from "./graph-executor";
import { GeminiFocusFunctionProvider } from "./memory";
import { GeminiToolProvider } from "./tools";
import { GeminiAgent } from "./agent";

export class GraphBuilder {
  private id: string | undefined;
  private nodes: Record<string, GraphNode<ThreadItem[]>> = {};
  private edges: GraphEdge[] = [];
  private entryNode: string | null = null;
  private observer: Observer | undefined;

  setId(id: string) {
    this.id = id;
  }

  addNode(id: string, fn: NodeFn<ThreadItem[]>): this {
    this.nodes[id] = { id, run: fn };
    return this;
  }

  addEdge(from: string, to: string, condition?: (output: any) => boolean): this {
    this.edges.push({ from, to, condition });
    return this;
  }

  setEntry(id: string): this {
    if (!this.nodes[id]) {
      throw new Error(`Cannot set entry: Node "${id}" does not exist.`);
    }
    this.entryNode = id;
    return this;
  }

  setObserver(observer: Observer): this {
    this.observer = observer;
    return this;
  }

  build(): Graph {
    if (!this.entryNode) throw new Error("Entry node must be set.");
    if (!this.id) throw new Error("Graph ID must be set.");

    const self = this;

    return {
      id: this.id,
      entryNode: this.entryNode,
      nodes: this.nodes,
      edges: this.edges,
      observer: this.observer,

      async execute(input: string, undefined, thread: ThreadItem[]) {
        return executeGraphPersistent(
          self.build(), // rebuild to isolate runtime execution
          input,
          {
            graphId: self.id || "",
          },
          self.observer,
        );
      }
    };
  }
}

export class GemeniAgentBuilder {
  memoryProvider: FocusFunctionProvider = new GeminiFocusFunctionProvider()
  toolProvider: ToolProvider = new GeminiToolProvider()
  memoryName: string | undefined
  tools: Tools | undefined
  prompt: string | undefined
  id: string | undefined
  private apiKey: string | undefined

  constructor(mp: FocusFunctionProvider = new GeminiFocusFunctionProvider(), tp: ToolProvider = new GeminiToolProvider()) {
    this.memoryProvider = mp;
    this.toolProvider = tp;
  }

  setAPIKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  setId(id: string) {
    this.id = id
  }

  setMemory(name: string) {
    this.memoryName = name;
  }

  setTools(...toolName: string[]) {
    this.tools = this.toolProvider.getTools(...toolName);
  }

  setPrompt(prompt: string) {
    this.prompt = prompt;
  }

  build(): NodeFn<ThreadItem[]> {
    return async (ctx: ThreadItem[]): Promise<ThreadItem[]> => {
      if (!this.id) {
        throw new Error("Agent ID must be set");
      }
      if (!this.apiKey) {
        throw new Error("API key must be set");
      }
      const agent = new GeminiAgent(this.id, this.tools);
      agent.setAPIKey(this.apiKey);
      if (!this.memoryName) {
        throw new Error("Memory name must be set");
      }
      const fc = this.memoryProvider.getFocusFunction(this.memoryName, this.id, this.prompt);

      return await agent.complete(ctx, fc)
    }

  }

}
