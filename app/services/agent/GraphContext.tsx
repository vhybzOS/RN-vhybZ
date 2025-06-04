import React, { ReactNode, createContext, useContext, useEffect } from 'react';
import { Observer, ThreadItem, Graph } from './fmg/types';
import { Manifest } from './fmg/manifest';
import { load, save } from 'app/utils/storage';



const GraphContext = createContext<GraphContextType | undefined>(undefined);

export const useGraph = (): GraphContextType => {
  const context = useContext(GraphContext);
  if (!context) {
    throw new Error('useGraph must be used within a GraphProvider');
  }
  return context;
}

interface GraphProviderProps {
  apiKey?: string;
  children: ReactNode;
}

export type ExecutionState = 'idle' | 'running' | 'wait' | 'error' | 'complete';
interface GraphContextType {
  graph: Graph | null;
  setGraph: React.Dispatch<React.SetStateAction<Graph | null>>;
  thread: ThreadItem[];
  setThread: React.Dispatch<React.SetStateAction<ThreadItem[]>>;
  activeNode: string | null;
  executionState?: ExecutionState;
  runFrom: (ti: number) => Promise<void>;
  reset: () => void;
}
export const GraphProvider = ({ children, apiKey }: GraphProviderProps) => {
  const manifest = new Manifest();
  const [graph, setGraph] = React.useState<Graph | null>(null);
  const [thread, setThread] = React.useState<ThreadItem[]>([]);
  const [executionState, setExecutionState] = React.useState<ExecutionState>('idle');
  const [activeNode, setActiveNode] = React.useState<string | null>(null);


  const reset = () => {
    setThread([])
    graph?.reset();
  }



  const observer: Observer = {
    onGraphStart(graphId, input) {
      console.log("Graph started", graphId, input);
      setExecutionState('running');
    },
    onNodeStart(nodeId, input) {
      console.log("Node started", nodeId, input);
      setExecutionState('running');
      setActiveNode(nodeId);
    },
    onNodeComplete(nodeId, output, durationMs, next) {
      console.log("Node onNodeComplete", nodeId, JSON.stringify(output), durationMs);
      setThread(output as ThreadItem[]);
      save("thread", { nodeId, output, next })
      setActiveNode(null);
    },
    onGraphComplete(output, durationMs) {
      setExecutionState('complete');
    },
    onError(nodeId, error) {
      console.error("Node error", nodeId, error);
      setExecutionState('error');
    }
  }
  const runFrom = async (threadIdx: number) => {
    if (!graph) {
      throw new Error("Graph is not initialized");
    }
    await graph?.cancel()
    const ntd = thread.slice(0, threadIdx);
    setThread(ntd);
    graph.execute(ntd, { fromNodeId: thread[threadIdx].name })
  }
  useEffect(() => {
    if (apiKey) {
      manifest.setApiKey(apiKey);
      Promise.all([manifest.load(observer), load("thread") as Promise<{ nodeId: string, output: ThreadItem[], next: string }>]).then(([graphResult, threadResult]) => {
        if (threadResult) {
          const { nodeId, output, next } = threadResult
          graphResult.execute(output as ThreadItem[] || [], { fromNodeId: next })
          setGraph(graphResult);
          setThread(output as ThreadItem[] || []);
        } else {
          graphResult.execute([])
          setThread([])
        }
      }).catch(e => { console.error("Error loading graph manifest:", e); })

    }
  }, [apiKey]);
  return (
    <GraphContext.Provider value={{ graph, setGraph, thread, setThread, activeNode, executionState, runFrom, reset }}>
      {children}
    </GraphContext.Provider>
  )
}

