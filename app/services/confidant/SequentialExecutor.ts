// confidant/SequentialExecutor.ts
import { Executor, Action, Result, Tool } from './types';
import { ToolRegistry } from './ToolRegistry';
import { Observer } from './types';

export class SequentialExecutor implements Executor {
  private registry: ToolRegistry;
  private observer: Observer;

  constructor(registry: ToolRegistry, observer: Observer) {
    this.registry = registry;
    this.observer = observer;
  }

  async execute(actions: Action[]): Promise<Result[]> {
    const results: Result[] = [];

    for (const action of actions) {
      const tool: Tool | undefined = this.registry.get(action.toolName);
      if (!tool) {
        const error = `Tool ${action.toolName} not found`;
        results.push({ output: {}, error });
        this.observer.onToolRun(action.toolName, action.input, {}, error);
        continue;
      }

      try {
        const output = await tool.run(action.input);
        results.push({ output });
        this.observer.onToolRun(action.toolName, action.input, output);
      } catch (err) {
        const error = (err instanceof Error) ? err.message : String(err);
        results.push({ output: {}, error });
        this.observer.onToolRun(action.toolName, action.input, {}, error);
      }
    }

    return results;
  }
}
