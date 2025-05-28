import React, { ReactNode, createContext, useContext, useEffect } from 'react';
import { Observer, ThreadItem, Graph } from './fmg/types';
import { Manifest } from './fmg/manifest';

interface GraphContextType {
  graph: Graph | null;
  setGraph: React.Dispatch<React.SetStateAction<Graph | null>>;
  thread: ThreadItem[];
}

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

export const GraphProvider = ({ children, apiKey }: GraphProviderProps) => {
  const manifest = new Manifest();
  const [graph, setGraph] = React.useState<Graph | null>(null);
  const [thread, setThread] = React.useState<ThreadItem[]>([]);

  const observer: Observer = {
    onGraphStart(graphId, input) {
      console.log("Graph started", graphId, input);
    },
    onNodeStart(nodeId, input) {
      console.log("Node started", nodeId, input);
      setThread(input as ThreadItem[]);
    },
    onNodeComplete(nodeId, output, durationMs) {
      console.log("Node onNodeComplete", nodeId, JSON.stringify(output), durationMs);
      setThread(output as ThreadItem[]);
    },
    onError(nodeId, error) {
      console.error("Node error", nodeId, error);
    }
  }
  useEffect(() => {
    if (apiKey) {
      console.log("apikey setted", apiKey);
      manifest.setApiKey(apiKey);
      manifest.load(observer).then((g) => {
        setGraph(g);
      }).catch(e => { console.error("Error loading graph manifest:", e); });
    }
  }, [apiKey]);
  return (
    <GraphContext.Provider value={{ graph, setGraph, thread }}>
      {children}
    </GraphContext.Provider>
  )
}

