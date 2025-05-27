import React, { ReactNode, createContext, useContext, useEffect } from 'react';
import { makeGraph } from './htmlGenerator';
import gl from 'graphlib';
import dagre from '@dagrejs/dagre';
import { Observer, ThreadItem } from './fmg/types';

type Graph = ReturnType<typeof makeGraph>;

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
  const [graph, setGraph] = React.useState<Graph | null>(null);
  const [thread, setThread] = React.useState<ThreadItem[]>([]);

  const observer: Observer = {
    onGraphStart(graphId, input) {
      console.log("Graph started", graphId, input);
    },
    onNodeStart(nodeId, input, context) {
      console.log("Node started", nodeId, input, context);
      setThread(context as ThreadItem[]);
    },
    onNodeComplete(nodeId, output, context, durationMs) {
      console.log("Node onNodeComplete", nodeId, JSON.stringify(output), context, durationMs);
      setThread(output as ThreadItem[]);
    }
  }
  useEffect(() => {
    if (apiKey && apiKey.length > 0) {
      console.log("apikey setted", apiKey);
      const g = makeGraph(apiKey, observer);
      setGraph(g);
    }
  }, [apiKey]);
  return (
    <GraphContext.Provider value={{ graph, setGraph, thread }}>
      {children}
    </GraphContext.Provider>
  )
}

