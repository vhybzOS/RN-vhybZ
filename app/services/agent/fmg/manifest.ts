import AsyncStorage from "@react-native-async-storage/async-storage";
import { GemeniAgentBuilder, GraphBuilder } from "./builder";
import { GeminiFocusFunctionProvider } from "./memory";
import { GeminiToolProvider } from "./tools";
import { FocusFunctionProvider, ToolProvider, NodeManifest, GraphManifest, Graph, Observer } from "./types";
import { HtmlGeneratorManifest } from "./default-manifest";
import { makeInputNode } from "./input";

export class Manifest {
  private apiKey: string | undefined;
  private memoryProvider: FocusFunctionProvider = new GeminiFocusFunctionProvider();
  private toolProvider: ToolProvider = new GeminiToolProvider();
  private graph: Graph | undefined;
  private manifest: GraphManifest | undefined;

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  agentFromManifest(manifest: NodeManifest) {
    if (this.apiKey === undefined) {
      throw new Error("API key is not set. Please set the API key before creating an agent.");
    }
    const agentBuilder = new GemeniAgentBuilder(this.memoryProvider, this.toolProvider);
    agentBuilder.setAPIKey(this.apiKey);
    agentBuilder.setId(manifest.id);
    if (manifest.memory) {
      console.log("Setting memory for agent:", manifest.memory);
      agentBuilder.setMemory(manifest.memory);
    }
    if (manifest.tools) {
      agentBuilder.setTools(...manifest.tools);
    }
    if (manifest.prompt) {
      agentBuilder.setPrompt(manifest.prompt);
    }
    return agentBuilder.build();
  }

  graphFromManifest(manifest: GraphManifest, observer?: Observer): Graph {
    const graphBuilder = new GraphBuilder();
    graphBuilder.setId(manifest.id);
    manifest.nodes.forEach(node => {
      if (node.type === "agent") {
        graphBuilder.addNode(node.id, this.agentFromManifest(node));
      }
      if (node.type === "input") {
        graphBuilder.addNode(node.id, makeInputNode(node.id, node.prompt));
      }
    })
    graphBuilder.setEntry(manifest.entryNode);
    if (observer) {
      graphBuilder.setObserver(observer);
    }
    manifest.edges.forEach(edge => {
      graphBuilder.addEdge(edge[0], edge[1]);
    })
    return graphBuilder.build();
  }

  async readGraphManifestFromStorage(key: string): Promise<GraphManifest | null> {
    try {
      const json = await AsyncStorage.getItem(key);
      if (!json) return null;
      return JSON.parse(json) as GraphManifest;
    } catch (e) {
      console.error('Failed to read graph manifest:', e);
      return null;
    }
  }

  async writeGraphManifestToStorage(key: string, manifest: GraphManifest): Promise<void> {
    try {
      const json = JSON.stringify(manifest);
      await AsyncStorage.setItem(key, json);
    } catch (e) {
      console.error('Failed to write graph manifest:', e);
    }
  }

  async load(observer?: Observer, key: string = "defaultManifest"): Promise<Graph> {
    // let manifest = await this.readGraphManifestFromStorage(key);
    // if (!manifest) {
    //   await this.writeGraphManifestToStorage(key, HtmlGeneratorManifest)
    let manifest = HtmlGeneratorManifest;
    // }
    this.manifest = manifest;
    this.graph = this.graphFromManifest(manifest, observer);
    return this.graph;
  }

  async update(manifest: GraphManifest, key: string = "defaultManifest", observer?: Observer): Promise<Graph> {
    this.writeGraphManifestToStorage(key, manifest);
    this.manifest = manifest;
    this.graph = this.graphFromManifest(manifest, observer);
    return this.graph
  }

  getNodeManifest(id: string): NodeManifest | undefined {
    return this.manifest?.nodes.find(node => node.id === id);
  }
}

