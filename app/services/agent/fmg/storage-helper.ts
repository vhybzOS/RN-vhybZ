import AsyncStorage from "@react-native-async-storage/async-storage";
import { GraphExecutionState } from "./types";
const GRAPH_STORAGE_KEY = (graphId: string) => `graph_exec_state_${graphId}`;

export async function saveGraphState(graphId: string, state: GraphExecutionState) {
  await AsyncStorage.setItem(GRAPH_STORAGE_KEY(graphId), JSON.stringify(state));
}

export async function loadGraphState(graphId: string): Promise<GraphExecutionState | null> {
  const raw = await AsyncStorage.getItem(GRAPH_STORAGE_KEY(graphId));
  return raw ? JSON.parse(raw) : null;
}

export async function clearGraphState(graphId: string) {
  await AsyncStorage.removeItem(GRAPH_STORAGE_KEY(graphId));
}
