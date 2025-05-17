import { Memory } from './types';

export class InMemoryMemory implements Memory {
  private store: Map<string, any>;

  constructor() {
    this.store = new Map();
  }

  async save(key: string, value: any): Promise<void> {
    this.store.set(key, value);
  }

  async recall(key: string): Promise<any | undefined> {
    return this.store.get(key);
  }

  async search(query: string): Promise<any[]> {
    const results: any[] = [];
    for (const [key, value] of this.store.entries()) {
      if (key.includes(query)) {
        results.push(value);
      }
    }
    return results;
  }
}
