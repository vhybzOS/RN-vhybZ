import { Planner, Executor, Observer, Memory, Action } from './types';

export class BasicAgent {
  private goal: string = '';
  private planner: Planner;
  private executor: Executor;
  private observer: Observer;
  private memory: Memory;

  constructor(planner: Planner, executor: Executor, observer: Observer, memory: Memory) {
    this.planner = planner;
    this.executor = executor;
    this.observer = observer;
    this.memory = memory;
  }

  async setGoal(goal: string): Promise<void> {
    this.goal = goal;
    this.observer.onGoalSet(goal);
    await this.memory.save('goal', goal);
  }

  async step(): Promise<void> {
    const context = {};
    const actions: Action[] = await this.planner.plan(this.goal, context);
    for (const action of actions) {
      this.observer.onActionPlanned(action);
    }
    await this.executor.execute(actions);
  }

  async run(): Promise<void> {
    // For simplicity, single step run
    await this.step();
  }
}
