import { ExecuteOptions, Graph, GraphExecutionState, Observer } from "./types";
import { loadGraphState, saveGraphState, clearGraphState } from "./storage-helper";


export async function executeGraphPersistent(
  graph: Graph,
  input: any,
  options: ExecuteOptions,
  initialContext: any = {},
  observer?: Observer,
): Promise<any> {
  const {
    graphId,
    resume,
    fromNodeId,
    cancelToken,
    keepState = true, // default to true
  } = options;

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
      context: initialContext,
      completedNodes: [],
      startedAt: Date.now(),
    };
    observer?.onGraphStart?.(state.currentNodeId, input);
  }

  while (state.currentNodeId) {
    if (cancelToken?.isCancelled) {
      console.log(`[Execution Canceled] at node ${state.currentNodeId}`);
      if (keepState) await saveGraphState(graphId, state);
      return;
    }

    const node = graph.nodes[state.currentNodeId];
    if (!node) throw new Error(`Node not found: ${state.currentNodeId}`);

    observer?.onNodeStart?.(state.currentNodeId, state.currentInput, state.context);
    const nodeStart = Date.now();

    try {
      const output = await node.run(state.currentInput, state.context, cancelToken);
      if (cancelToken?.isCancelled) {
        console.log(`[Execution Canceled] after node ${state.currentNodeId}`);
        if (keepState) await saveGraphState(graphId, state);
        return;
      }

      const duration = Date.now() - nodeStart;
      observer?.onNodeComplete?.(state.currentNodeId, output, state.context, duration);

      const nextEdge = graph.edges.find(
        edge => edge.from === state.currentNodeId &&
          (!edge.condition || edge.condition(output, state.context))
      );

      if (!nextEdge) {
        observer?.onGraphComplete?.(output, state.context, Date.now() - state.startedAt);
        if (keepState) await clearGraphState(graphId);
        return output;
      }

      state.currentNodeId = typeof nextEdge.to === "string" ? nextEdge.to : nextEdge.to(output, state.context);
      state.currentInput = output;

      if (keepState) await saveGraphState(graphId, state);
    } catch (err) {
      observer?.onError?.(state.currentNodeId, err as Error, state.context);
      if (keepState) await saveGraphState(graphId, state);
      throw err;
    }
  }

  if (keepState) await clearGraphState(graphId);
  return state.currentInput;
}
