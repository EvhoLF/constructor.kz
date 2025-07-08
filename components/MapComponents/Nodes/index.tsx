/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconName } from "@/Icons";
import NodePoint from "./NodePoint";
import { Node } from "@xyflow/react";
import { rootNodeID } from "@/utils/Formula/FormulaConfig";
import NodeFitText from "@/utils/Map/NodeFitText";

export const nodeTypes = {
  point: NodePoint,
};

export const GetNodeColor = (node: any) => node.data.color ?? '#eef';
export const GetNodeColorBG = (node: any) => node.data.colorBG ?? '#2a2b2f';


export const NODE_MIN_WIDTH = 90;
export const NODE_MIN_HEIGHT = 40;

export type NodePoint = Node & { data: NodePointData }

export type NodePointData = {
  label: string,
  description?: null | string,
  colorPrimary?: null | string,
  colorSecondary?: null | string,
  icon?: null | IconName,
  isRequired?: boolean,
  isLabelVisible?: boolean,
  isIconVisible?: boolean,
  isBorderVisible?: boolean,
  isAutoResize?: boolean,
}

export type TableNode = {
  id: string;
  type?: string,
  data: Record<string, any>;
};

export const init_NodePoint_data = (fields?: NodePointData): NodePointData & { [key: string]: any } => ({
  label: 'С', icon: 'default', colorPrimary: '#ffffff', colorSecondary: '#222222', description: '',
  isRequired: true, isLabelVisible: true, isIconVisible: false, isBorderVisible: true, isAutoResize: false,
  ...fields
})

export const init_NodePoint = ({ position = { x: 0, y: 0 }, style = {}, data = { label: '' }, ...props }: NodePoint & { width?: number }) => ({
  position: { x: position.x || 0, y: position.y || 0, },
  style: { width: NODE_MIN_WIDTH, height: NODE_MIN_HEIGHT, ...style },
  data: init_NodePoint_data(data),
  ...props,
  type: 'point',
})

export const init_root_NodePoint = (id: string = rootNodeID, label = 'Центральный узел') => init_NodePoint({
  id,
  type: "point",
  width: NodeFitText({ text: label }) ?? NODE_MIN_WIDTH,
  position: { x: 0, y: 0 },
  data: { label, required: true, isAutoResize: true, },
});