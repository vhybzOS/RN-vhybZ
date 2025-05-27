import React, { useMemo } from 'react';
import dagre from '@dagrejs/dagre';
import { tw } from "../theme/tailwind";
import { Canvas, Circle, Group, Line, Paragraph, Skia, SkParagraph, Text, vec } from "@shopify/react-native-skia";
import { Graph } from 'app/services/agent/fmg/types';
import { useWindowDimensions } from 'react-native';


interface GraphViewProps {
  graph: Graph;
}

export const GraphView: React.FC<GraphViewProps> = ({ graph }) => {
  const dem = useWindowDimensions()
  const graphView = useMemo(() => {
    let g = new dagre.graphlib.Graph();
    g.setGraph({});

    // Default to assigning a new object as a label for each new edge.
    g.setDefaultEdgeLabel(function () { return {}; });
    for (const [nid, n] of Object.entries(graph.nodes)) {
      const t = Skia.ParagraphBuilder.Make()
        .addText(n.id || "").build()
      t.layout(dem.width / 3)
      g.setNode(nid, { label: n.id, width: Math.round(t.getLongestLine()), height: Math.round(t.getHeight()), skp: t });
      g.setNode(nid + "2", { label: n.id + "2", width: Math.round(t.getLongestLine()), height: Math.round(t.getHeight()), skp: t });
      g.setEdge(nid, nid + "2");

    }
    for (const e of graph.edges) {
      if (typeof e.to === 'string') {
        g.setEdge(e.from, e.to, { label: e.condition ? 'Conditional' : 'Direct' });
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
    <Canvas style={{ width: dem.width, height: dem.height }}>

      <Group blendMode="multiply">
        {graphView.nodes().map(nodeId => {
          const n = graphView.node(nodeId)
          const outs = graphView.outEdges(nodeId);
          return (
            <Group key={nodeId}>
              <Circle cx={n.x + Math.max(n.width, n.height)} cy={n.y + Math.max(n.width, n.height)} r={Math.round(Math.max(n.width, n.height))} />
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
  );
}
