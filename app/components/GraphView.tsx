import React, { useMemo } from 'react';
import dagre from '@dagrejs/dagre';
import { tw } from "../theme/tailwind";
import { Canvas, Circle, Group, Line, Paragraph, Skia, SkParagraph, Text, vec } from "@shopify/react-native-skia";
import { Graph } from 'app/services/agent/fmg/types';
import { useWindowDimensions } from 'react-native';
import { ExecutionState } from 'app/services/agent/GraphContext';
import { ExecutionStatusIndicator } from './GraphExecutionStateIndicator';


interface GraphViewProps {
  graph?: Graph | null;
  activeNode?: string | null;
  state?: ExecutionState;
}

export const GraphView: React.FC<GraphViewProps> = ({ graph, activeNode, state }) => {
  const dem = useWindowDimensions()
  const graphView = useMemo(() => {
    let g = new dagre.graphlib.Graph();
    g.setGraph({});

    // Default to assigning a new object as a label for each new edge.
    g.setDefaultEdgeLabel(function () { return {}; });
    if (graph) {
      for (const [nid, n] of Object.entries(graph.nodes)) {
        const t = Skia.ParagraphBuilder.Make()
          .addText(n.id || "").build()
        t.layout(dem.width / 3)
        g.setNode(nid, { label: n.id, width: Math.round(t.getLongestLine()), height: Math.round(t.getHeight()), skp: t });

      }
      for (const e of graph.edges) {
        if (typeof e.to === 'function') {
          for (const h of e.hint || [])
            g.setEdge(e.from, h, { label: 'Conditional' });
        } else {
          g.setEdge(e.from, e.to, { label: 'Direct' });
        }
      }
    }
    try {
      dagre.layout(g, { width: Math.round(dem.width), height: Math.round(dem.height) });
    } catch (e) {
      console.error("Error in dagre layout", e);
    }
    return g
  }, [graph, dem])
  return (
    <>
      <Canvas style={{ flex: 1 }}>
        <ExecutionStatusIndicator x={300} y={100} state={state}></ExecutionStatusIndicator>
      </Canvas>
      <Canvas style={{ flex: 1 }}>
        <Group blendMode="multiply">
          {graphView.nodes().map(nodeId => {
            const n = graphView.node(nodeId)
            const outs = graphView.outEdges(nodeId);
            return (
              <Group key={nodeId}>
                <Circle color={activeNode === nodeId ? "red" : "blue"} cx={n.x} cy={n.y} r={Math.round(Math.max(n.width, n.height) / 3)} />
                <Paragraph paragraph={n.skp} x={n.x} y={n.y} width={300} />
                {outs && outs.map(e => {
                  const en = graphView.node(e.w);
                  return <Line
                    p1={vec(n.x, n.y)}
                    p2={vec(en.x, en.y)}
                    // color="lightblue"
                    style="stroke"
                    strokeWidth={4}
                  />
                })
                }
              </Group>
            )
          })}
        </Group>
      </Canvas>
    </>
  );
}
