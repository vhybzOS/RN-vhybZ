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
  observer?: Observer;
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
