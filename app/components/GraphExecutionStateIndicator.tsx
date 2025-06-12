
import React from "react";
import {
  Group,
  Circle,
  Path,
  Rect,
  Line,
  Skia,
} from "@shopify/react-native-skia";
import { ExecutionState } from "app/services/agent/GraphContext";


interface Props {
  state?: ExecutionState;
  radius?: number;
  x: number;
  y: number;
}

const stateStyles: Record<
  Exclude<ExecutionState, undefined>,
  { color: string; icon: "play" | "pause" | "check" | "cross" | "none" }
> = {
  idle: { color: "#9E9E9E", icon: "none" },
  running: { color: "#4CAF50", icon: "play" },
  wait: { color: "#FFC107", icon: "pause" },
  error: { color: "#F44336", icon: "cross" },
  complete: { color: "#2196F3", icon: "check" },
};

const fallbackStyle = { color: "#BDBDBD", icon: "none" };

export const ExecutionStatusIndicator = ({
  state,
  radius = 30,
  x,
  y,
}: Props) => {
  const { color, icon } = state ? stateStyles[state] ?? fallbackStyle : fallbackStyle;

  const iconSize = radius * 0.8;
  const barWidth = iconSize * 0.25;
  const barHeight = iconSize;

  return (
    <Group transform={[{ translateX: x }, { translateY: y }]}>
      <Circle r={radius} color={color} />

      {icon === "play" && (
        <Path
          path={Skia.Path.MakeFromSVGString(
            `M ${-iconSize / 2} ${-iconSize / 2} L ${iconSize / 2} 0 L ${-iconSize / 2
            } ${iconSize / 2} Z`
          )!}
          color="white"
        />
      )}

      {icon === "pause" && (
        <>
          <Rect
            x={-barWidth - barWidth / 2}
            y={-barHeight / 2}
            width={barWidth}
            height={barHeight}
            color="white"
          />
          <Rect
            x={barWidth / 2}
            y={-barHeight / 2}
            width={barWidth}
            height={barHeight}
            color="white"
          />
        </>
      )}

      {icon === "check" && (
        <Path
          path={Skia.Path.MakeFromSVGString(
            `M ${-radius * 0.5} 0 L ${-radius * 0.15} ${radius * 0.3} L ${radius * 0.5
            } ${-radius * 0.4}`
          )!}
          color="white"
          strokeWidth={radius * 0.15}
          style="stroke"
        />
      )}

      {icon === "cross" && (
        <>
          <Line
            p1={{ x: -iconSize / 2, y: -iconSize / 2 }}
            p2={{ x: iconSize / 2, y: iconSize / 2 }}
            color="white"
            strokeWidth={radius * 0.15}
          />
          <Line
            p1={{ x: -iconSize / 2, y: iconSize / 2 }}
            p2={{ x: iconSize / 2, y: -iconSize / 2 }}
            color="white"
            strokeWidth={radius * 0.15}
          />
        </>
      )}
    </Group>
  );
};
