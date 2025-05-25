import { Content, GenerateContentResponse } from "@google/genai";

export type ThreadItem = {
  name: string
  messages: Content[]
}

interface Agent {
  name: string;
  complete(ctx: ThreadItem[]): Promise<ThreadItem[]>;
  focus(ctx: ThreadItem[]): Promise<Content | Content[]>;
}

export type Observer = {
  onGraphStart?: (graphId: string, input: any) => void;
  onNodeStart?: (nodeId: string, input: any, context: any) => void;
  onNodeComplete?: (nodeId: string, output: any, context: any, durationMs: number) => void;
  onError?: (nodeId: string, error: Error, context: any) => void;
  onGraphComplete?: (output: any, context: any, durationMs: number) => void;
};

type NodeFn = (input: any, context: any, cancelToken?: CancellationToken) => Promise<any> | any;

export interface CancellationTokenValue {
  cancel: () => void;
  isCancelled: () => boolean;
}

export type CancellationToken = CancellationTokenValue | undefined

export type GraphNode = {
  id: string;
  run: (input: any, context: any, cancelToken: CancellationToken) => Promise<any> | any;
};

export type GraphEdge = {
  from: string;
  to: string | ((output: any, context: any) => string);
  condition?: (output: any, context: any) => boolean;
};

type Graph = {
  id: string;
  entryNode: string;
  nodes: Record<string, GraphNode>;
  edges: GraphEdge[];
  observer: Observer | undefined;

  execute: (
    input: any,
    options?: ExecuteOptions,
    initialContext?: any
  ) => Promise<any>;
};

export type ExecuteOptions = {
  graphId: string;
  resume?: boolean;
  fromNodeId?: string;
  cancelToken?: CancellationToken;
  keepState?: boolean;
};

export type GraphExecutionState = {
  currentNodeId: string;
  currentInput: any;
  context: any;
  completedNodes: string[];
  startedAt: number;
};
