import { CancellationToken, CancellationTokenValue, ExecuteOptions, Graph, GraphExecutionState, Observer } from "./types";
import { loadGraphState, saveGraphState, clearGraphState } from "./storage-helper";
import { delay } from "app/utils/delay";

export class CancellationTokenImp implements CancellationTokenValue {
  private _isCancelled = false;
  cancel() {
    this._isCancelled = true;
  }
  get isCancelled() {
    return this._isCancelled;
  }
}

export async function executeGraphPersistent<T>(
  graph: Graph,
  input: T,
  options: ExecuteOptions,
  observer?: Observer,
): Promise<void> {
  const {
    graphId,
    resume,
    fromNodeId,
    cancelToken,
    keepState = false, // default to true
  } = options;
  console.log("graph start")
  let state: GraphExecutionState;

  if (resume) {
    const loaded = await loadGraphState(graphId);
    if (!loaded) throw new Error(`No saved state found for graph "${graphId}"`);
    state = loaded;
    observer?.onGraphStart?.(state.currentNodeId, state.currentInput);
  } else {
    state = {
      currentNodeId: fromNodeId || graph.entryNode,
      currentInput: input,
      completedNodes: [],
      startedAt: Date.now(),
    };
    observer?.onGraphStart?.(state.currentNodeId, input);
  }

  while (state.currentNodeId) {
    await delay(100)
    if (cancelToken?.isCancelled) {
      console.log(`[Execution Canceled] at node ${state.currentNodeId}`);
      if (keepState) await saveGraphState(graphId, state);
      return;
    }

    const node = graph.nodes[state.currentNodeId];
    if (!node) throw new Error(`Node not found: ${state.currentNodeId}`);

    observer?.onNodeStart?.(state.currentNodeId, state.currentInput);
    const nodeStart = Date.now();

    try {
      const output = await node.run(state.currentInput, cancelToken);
      if (cancelToken?.isCancelled) {
        console.log(`[Execution Canceled] after node ${state.currentNodeId}`);
        if (keepState) await saveGraphState(graphId, state);
        return;
      }

      const duration = Date.now() - nodeStart;

      const nextEdge = graph.edges.find(
        edge => edge.from === state.currentNodeId
      );

      if (!nextEdge) {
        observer?.onNodeComplete?.(state.currentNodeId, output, duration);
        observer?.onGraphComplete?.(output, Date.now() - state.startedAt);
        if (keepState) await clearGraphState(graphId);
        return output;
      }

      state.currentNodeId = typeof nextEdge.to === "string" ? nextEdge.to : nextEdge.to(output);
      state.currentInput = output;


      observer?.onNodeComplete?.(state.currentNodeId, output, duration, state.currentNodeId);

      if (keepState) await saveGraphState(graphId, state);
    } catch (err) {
      observer?.onError?.(state.currentNodeId, err as Error);
      if (keepState) await saveGraphState(graphId, state);
      throw err;
    }
  }

  if (keepState) await clearGraphState(graphId);
  return state.currentInput;
}
