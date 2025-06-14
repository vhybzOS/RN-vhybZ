import { Content, GenerateContentResponse } from "@google/genai";
import { Graph as glGraph } from "graphlib"
import { string } from "mobx-state-tree/dist/internal";

export type ThreadItem = {
  name: string
  messages: Content[]
}

export type FocusFunction = (ctx: ThreadItem[]) => Promise<Content | Content[]>

interface Agent {
  name: string;
  complete(ctx: ThreadItem[], focus: FocusFunction): Promise<ThreadItem[]>;
}

export type Observer = {
  onGraphStart?: (graphId: string, input: any) => void;
  onNodeStart?: (nodeId: string, input: any) => void;
  onNodeComplete?: (nodeId: string, output: any, durationMs: number, next?: string) => void;
  onError?: (nodeId: string, error: Error) => void;
  onGraphComplete?: (output: any, durationMs: number) => void;
};

type NodeFn<T> = (input: T, cancelToken?: CancellationToken) => Promise<T> | T;

export interface CancellationTokenValue {
  cancel: () => void;
  isCancelled: boolean;
}

export type CancellationToken = CancellationTokenValue | undefined

export type GraphNode<T> = {
  id: string;
  run: NodeFn<T>;
};

export type GraphEdge = {
  from: string;
  to: string | ((output: any) => string);
  hint?: string[]
};

export type Graph = {
  id: string;
  entryNode: string;
  nodes: Record<string, GraphNode>;
  edges: GraphEdge[];
  observer: Observer | undefined;

  cancel: () => Promise<void>;
  reset: () => void;
  execute: (
    input: any,
    options?: Partial<ExecuteOptions>,
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
  completedNodes: string[];
  startedAt: number;
};

export type Tools = {
  declarations: FunctionDeclaration[];
  functions: Record<string, Function>;
}

export interface ToolProvider {
  avalible(): string[];
  getTools(...name: string[]): Tools | undefined;
}

export interface FocusFunctionProvider {
  avalible(): string[];
  getFocusFunction(name: string, id?: string, prompt?: Prompt): FocusFunction
}

export interface NodeManifest {
  id: string;
  type: "agent" | "input";
  memory?: string;
  prompt?: string;
  tools?: string[];
}

export interface GraphManifest {
  id: string;
  nodes: NodeManifest[];
  edges: [string, string][]
  entryNode: string;
}

export type Prompt = string | ((params?: Record<string, any>) => string | Promise<string>)

export type PromptProvider = (name: string) => string | Prompt;

export type RetryOptions = {
  retries: number;                              // Max retry attempts
  baseDelay?: number;                           // Initial delay in ms (default: 100)
  maxDelay?: number;                            // Max delay cap in ms (default: 10000)
  timeout?: number;                             // Total time budget in ms
  jitter?: boolean;                             // Add randomness to backoff
  shouldRetry?: (error: unknown) => boolean;    // Error filter
};

