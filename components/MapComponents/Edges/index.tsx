/* eslint-disable @typescript-eslint/no-explicit-any */
import { BezierEdge, Edge, SimpleBezierEdge, SmoothStepEdge, StepEdge, StraightEdge } from "@xyflow/react";
import EdgeBezier from "./EdgeBezier";

export const edgeTypes = {
  bezier: EdgeBezier,
  bezierEdge: BezierEdge,
  simpleBezierEdge: SimpleBezierEdge,
  smoothStepEdge: SmoothStepEdge,
  stepEdge: StepEdge,
  straightEdge: StraightEdge,
};

export type TableEdge = {
  id: string,
  source: string,
  target: string,
  style: Record<string, any>,
  data: Record<string, any>,
}

export const init_edge_style = (style = {}) => ({
  stroke: '#222222', strokeWidth: 2, ...style
});

export const init_edge_data = (data = {}) => ({
  isAlternative: false, ...data
});

export const init_Edge = (input: Partial<Edge> = {}): Edge => {
  const { style = {}, data = {}, ...rest } = input;

  return {
    style: init_edge_style(style),
    data: init_edge_data(data),
    ...rest,
  } as Edge;
};