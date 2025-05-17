import { Planner, Action, ToolSchema } from './types';

interface GeminiToolUseRequest {
  goal: string;
  tools: ToolSchema[];
  context: Record<string, any>;
}

interface GeminiToolUseResponse {
  actions: Action[];
}

export class GeminiPlanner implements Planner {
  private apiKey: string;
  private endpoint: string;
  private tools: ToolSchema[];

  constructor(apiKey: string, tools: ToolSchema[], endpoint = 'https://api.gemini.com/v1/tooluse') {
    this.apiKey = apiKey;
    this.tools = tools;
    this.endpoint = endpoint;
  }

  async plan(goal: string, context: Record<string, any>): Promise<Action[]> {
    const req: GeminiToolUseRequest = {
      goal,
      tools: this.tools,
      context,
    };

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data: GeminiToolUseResponse = await response.json();
    return data.actions;
  }
}
