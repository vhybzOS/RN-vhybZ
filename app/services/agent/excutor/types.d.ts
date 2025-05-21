
export type Node = {
  id: string;
  run: (input: any, context: any, cancelToken: CancellationToken) => Promise<any> | any;
};

export type Edge = {
  from: string;
  to: string;
  condition?: (output: any, context: any) => boolean;
};

export type Graph = {
  nodes: Record<string, Node>;
  edges: Edge[];
  entryNode: string;
};

export type Observer = {
  onGraphStart?: (graphId: string, input: any) => void;
  onNodeStart?: (nodeId: string, input: any, context: any) => void;
  onNodeComplete?: (nodeId: string, output: any, context: any, durationMs: number) => void;
  onError?: (nodeId: string, error: Error, context: any) => void;
  onGraphComplete?: (output: any, context: any, durationMs: number) => void;
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
