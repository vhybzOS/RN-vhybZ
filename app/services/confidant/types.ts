export interface Action {
  toolName: string;
  input: Record<string, any>;
}

export interface Result {
  output: Record<string, any>;
  error?: string;
}

export interface Tool {
  name: string;
  run(input: Record<string, any>): Promise<Record<string, any>>;
}

export interface ToolSchema {
  name: string;
  description: string;
  parameters: Record<string, any>; // JSON Schema or MCP schema
}

export interface Planner {
  plan(goal: string, context: Record<string, any>): Promise<Action[]>;
}

export interface Executor {
  execute(actions: Action[]): Promise<Result[]>;
}

export interface Observer {
  onGoalSet(goal: string): void;
  onActionPlanned(action: Action): void;
  onToolRun(tool: string, input: Record<string, any>, output: Record<string, any>, error?: string): void;
}

export interface Memory {
  save(key: string, value: any): Promise<void>;
  recall(key: string): Promise<any | undefined>;
  search(query: string): Promise<any[]>;
}
