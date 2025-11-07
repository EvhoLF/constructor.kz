/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconName } from "@/Icons";
import NodePoint from "./NodePoint";
import { Node } from "@xyflow/react";
import { rootNodeID } from "@/utils/Formula/FormulaConfig";
import NodeFitText from "@/utils/Map/NodeFitText";
import { DiagramType } from "@/types/diagrams";

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
  colorTextPrimary?: null | string,
  colorTextSecondary?: null | string,
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

export const init_NodePoint_data = (fields?: Partial<NodePointData>, type?: DiagramType): NodePointData & { [key: string]: any } => ({
  label: 'С', icon: 'default',
  colorPrimary: '#ffffff',
  colorSecondary: type == 'ontology' ? '#c0c0c0' : '#222222',
  colorTextPrimary: '#222222',
  colorTextSecondary: '#ffffff',
  description: '',
  isRequired: true, isLabelVisible: true, isIconVisible: false, isBorderVisible: true, isAutoResize: true,
  ...fields
})

export const init_NodePoint = ({
  position = { x: 0, y: 0 },
  style = {},
  data = { label: "" },
  ...props
}: Partial<Node<NodePointData>> & { id: string }, type?: DiagramType): Node<NodePointData> => {
  const baseData = init_NodePoint_data(data, type);
  const autoWidth =
    baseData.isAutoResize && baseData.label
      ? NodeFitText({ text: baseData.label })
      : NODE_MIN_WIDTH;

  return {
    position,
    style: { width: autoWidth ?? NODE_MIN_WIDTH, height: NODE_MIN_HEIGHT, ...style },
    data: baseData,
    ...props,
    type: "point",
  };
};

export const init_root_NodePoint = ({ id = rootNodeID, label = 'Центральный узел', type }: {
  id?: string,
  label?: string,
  type?: DiagramType,
}) => {
  const id_value = id ?? rootNodeID;
  const label_value = label ?? rootNodeID;
  const type_value = type ?? 'diagram';
  return init_NodePoint({
    id: id_value,
    type: "point",
    width: NodeFitText({ text: label_value }) ?? NODE_MIN_WIDTH,
    position: { x: 0, y: 0 },
    data: {
      colorPrimary: '#ffffff',
      colorSecondary: type_value == 'ontology' ? '#c0c0c0' : '#222222',
      colorTextPrimary: '#222222',
      colorTextSecondary: '#ffffff',
      label: label_value,
      isRequired: true,
      isAutoResize: true,
    },
  });
}