'use client'
import React, { memo } from 'react';
import NodePanelPoint from './NodePanelPoint';
import EdgePanelPoint from './EdgePanelPoint';
import { Edge, Node } from '@xyflow/react';

type SelectedElement = null | { type: 'node' | 'edge'; data: Node | Edge };

type Props = {
  selectedElement?: SelectedElement;
  setFormulaError?: React.Dispatch<React.SetStateAction<null>>;
};

const PanelMapElementManager = ({ setFormulaError, selectedElement }: Props) => {

  if (!selectedElement) return null;

  if (selectedElement.type === 'node') {
    const nodeType = (selectedElement.data as Node).type || 'point';
    const NodePanels: Record<string, React.FC<{ setFormulaError: React.Dispatch<React.SetStateAction<null>> | undefined, id: string }>> = {
      point: NodePanelPoint,
    };
    const Panel = NodePanels[nodeType] || NodePanelPoint;
    return <Panel setFormulaError={setFormulaError} id={selectedElement.data.id} />;
  }

  if (selectedElement.type === 'edge') {
    return <EdgePanelPoint id={selectedElement.data.id as string} />;
  }

  return null;
};

export default memo(PanelMapElementManager);
