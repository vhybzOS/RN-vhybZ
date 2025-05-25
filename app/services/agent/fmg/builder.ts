import { Graph, GraphNode, GraphEdge, NodeFn, Observer } from "./types";
import { executeGraphPersistent } from "./graph-executor";

export class GraphBuilder {
  private id: string;
  private nodes: Record<string, GraphNode> = {};
  private edges: GraphEdge[] = [];
  private entryNode: string | null = null;
  private observer: Observer | undefined;

  constructor(id: string) {
    this.id = id;
  }

  addNode(id: string, fn: NodeFn): this {
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
