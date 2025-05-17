// confidant/LoggingObserver.ts
import { Observer, Action } from './types';

export class LoggingObserver implements Observer {
  onGoalSet(goal: string): void {
    console.log("🧠 Goal Set:", goal);
  }

  onActionPlanned(action: Action): void {
    console.log(`📋 Planned: ${action.toolName}`, action.input);
  }

  onToolRun(tool: string, input: Record<string, any>, output: Record<string, any>, error?: string): void {
    if (error) {
      console.error(`❌ Tool ${tool} failed:`, error);
    } else {
      console.log(`✅ Tool ${tool} ran with input`, input, "and output", output);
    }
  }
}
