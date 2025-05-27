import { Graph, GraphNode, GraphEdge, NodeFn, Observer, ThreadItem, FocusFunction } from "./types";
import { executeGraphPersistent } from "./graph-executor";
import dagre from "@dagrejs/dagre"
import { Content, createModelContent, createUserContent } from "@google/genai";
import { Tools } from "./agent";
import { string } from "mobx-state-tree/dist/internal";

export class GraphBuilder {
  private id: string;
  private nodes: Record<string, GraphNode> = {};
  private edges: GraphEdge[] = [];
  private entryNode: string | null = null;
  private observer: Observer | undefined;

  constructor(id: string) {
    this.id = id;
  }

  addNode(id: string, fn: NodeFn<ThreadItem[]>): this {
    this.nodes[id] = { id, run: fn };
    return this;
  }

  addEdge(from: string, to: string, condition?: (output: any, context: any) => boolean): this {
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

    const self = this;

    return {
      id: this.id,
      entryNode: this.entryNode,
      nodes: this.nodes,
      edges: this.edges,
      observer: this.observer,

      async execute(input) {
        return executeGraphPersistent(
          self.build(), // rebuild to isolate runtime execution
          input,
          {
            graphId: self.id,
          },
          [],
          self.observer,
        );
      }
    };
  }
}

export class GemeniAgentBuilder {
  memory: FocusFunction | undefined
  tools: Tools | undefined
  prompt: string | undefined
  id: string

  constructor(id: string) {
    this.id = id;
  }

  setMemory(type: "all" | "session") {
    if (type == "all") {
      this.memory = async (ctx: ThreadItem[]) => {
        let acc: Content[] = []
        ctx.forEach((i) => {
          return acc.concat(i.messages)
        })
        if (this.prompt) {
          acc.push(createModelContent(this.prompt))
        }
        return Promise.resolve(acc)
      }
    }
    if (type == "session") {
      this.memory = async (ctx: ThreadItem[]) => {
        let c = ctx.filter(p => p.name == this.id)
        if (c.length > 0) {
          return c[c.length - 1].messages
        }
        if (this.prompt) {
          return [createModelContent(this.prompt)]
        }
        return [] as Content[]
      }
    }
  }

  addTools(toolName: string) {

  }

  setPrompt(prompt: string) {

  }

  build(): NodeFunction {

  }

}
