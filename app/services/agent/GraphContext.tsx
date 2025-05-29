import React, { ReactNode, createContext, useContext, useEffect } from 'react';
import { Observer, ThreadItem, Graph } from './fmg/types';
import { Manifest } from './fmg/manifest';



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
}
export const GraphProvider = ({ children, apiKey }: GraphProviderProps) => {
  const manifest = new Manifest();
  const [graph, setGraph] = React.useState<Graph | null>(null);
  const [thread, setThread] = React.useState<ThreadItem[]>([]);
  const [executionState, setExecutionState] = React.useState<ExecutionState>('idle');
  const [activeNode, setActiveNode] = React.useState<string | null>(null);

  const observer: Observer = {
    onGraphStart(graphId, input) {
      console.log("Graph started", graphId, input);
      setExecutionState('running');
    },
    onNodeStart(nodeId, input) {
      console.log("Node started", nodeId, input);
      setThread(input as ThreadItem[]);
      setExecutionState('running');
      setActiveNode(nodeId);
    },
    onNodeComplete(nodeId, output, durationMs) {
      console.log("Node onNodeComplete", nodeId, JSON.stringify(output), durationMs);
      setThread(output as ThreadItem[]);
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
  useEffect(() => {
    if (apiKey) {
      manifest.setApiKey(apiKey);
      manifest.load(observer).then((g) => {
        g.execute([])
        setGraph(g);
      }).catch(e => { console.error("Error loading graph manifest:", e); });
    }
  }, [apiKey]);
  return (
    <GraphContext.Provider value={{ graph, setGraph, thread, setThread, activeNode, executionState }}>
      {children}
    </GraphContext.Provider>
  )
}

