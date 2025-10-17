'use client'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import '@xyflow/react/dist/style.css';
import { addEdge, Background, Connection, Edge, EdgeChange, Node, NodeChange, OnSelectionChangeParams, Panel, ReactFlow, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react';
import { init_root_NodePoint, nodeTypes } from './Nodes';
import { edgeTypes } from './Edges';
import { useFlowDnD } from '@/hooks/useFlowDnD';
import { IconButton, Stack, Tooltip } from '@mui/material';
import { getLayout } from '@/utils/Map/getLayout';
import { defaultEdgeOptions } from './MapConfig';
import { rootNodeID } from '@/utils/Formula/FormulaConfig';
import PanelNodes from './PanelNodes/PanelNodes';
import { TakeImageMap, TakeImageMapDownload } from '@/utils/Map/ImageMap';
import createPDF from '@/utils/Map/createPDF';
import getNodeHierarchy from '@/utils/Map/getNodeHierarchy';
import { useAsync } from '@/hooks/useAsync';
import axios from 'axios';
import { compress, decompress } from '@/utils/compress';
import { enqueueSnackbar } from 'notistack';
import { Diagram } from '.prisma/client';
import Frame from '../UI/Frame';
import Icon from '../UI/Icon';
import HeaderButton from '../Header/HeaderButton';
import { useDiagramType } from '@/hooks/DiagramTypeContext';
import PanelMapElementManager from './PanelMapElementManager';
import { ThemeContext } from "@/hooks/ThemeRegistry";

const MapTemplatesDiagram = ({ id }: { id: string }) => {
  const { mode, toggleMode } = useContext(ThemeContext);
  const { templateApi } = useDiagramType();
  const { asyncFn } = useAsync();
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { onDragOver, onDrop } = useFlowDnD();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedElement, setSelectedElement] = useState<null | { id: any, type: 'node' | 'edge', data: Node | Edge }>(null);
  const onSelectionChange = useCallback(({ nodes, edges }: OnSelectionChangeParams<Node, Edge>) => {
    if (nodes && nodes.length === 1) setSelectedElement(nodes?.length ? { id: nodes[0].id, type: 'node', data: nodes[0] } : null);
    else if (edges && edges.length === 1) setSelectedElement(edges?.length ? { id: edges[0].id, type: 'edge', data: edges[0] } : null);
    else setSelectedElement(null);
  }, [setSelectedElement]);

  const setLayouted = (pre_nodes: Node[], pre_edges: Edge[]) => {
    const layouted = getLayout(pre_nodes, pre_edges);
    setNodes(layouted.nodes); setEdges(layouted.edges);
  }

  useEffect(() => {
    try {
      const fetch = async () => {
        const res = await asyncFn(() => axios.get(`${templateApi}${id}`))
        if (!res || !res?.data) return;
        const resData: Diagram = res.data;
        const resNodes = resData?.nodes ? decompress(resData?.nodes) : [];
        const resEdges = resData?.edges ? decompress(resData?.edges) : [];
        setNodes(resNodes); setEdges(resEdges);
      }
      fetch();
    }
    catch (err) {
      console.error(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOnConnect = (connection: Edge | Connection) => {
    if (connection.target === rootNodeID) return;
    if (connection.source === connection.target) return;
    if (edges.filter(e => e.target === connection.target).length > 0) return;
    setEdges((eds) => {
      const newEdges = addEdge({ ...connection, data: { isAlternative: false } }, eds);
      return newEdges
    });
  };

  const takeScreenshot = useCallback(async () => {
    await fitView();
    await new Promise((r) => setTimeout(r, 500));
    TakeImageMapDownload(nodes)
  }, [fitView, nodes]);

  const pdf = async () => {
    const nodesHierarchy = getNodeHierarchy(nodes, edges) as Node[];
    const descriptionLines = nodesHierarchy.map(node => `${node.data.label || ''}${node.data?.description ? ` – ${node.data?.description}` : ''}`) || [];
    await fitView();
    const imgSrc = await TakeImageMap(nodes);
    createPDF(imgSrc, descriptionLines);
  }

  const save = async () => {
    try {
      const strNodes = compress(nodes || []);
      const strEdges = compress(edges || []);
      const res = await asyncFn(() => axios.put(`${templateApi}${id}`, { nodes: strNodes, edges: strEdges }));
      if (res && res?.data) {
        enqueueSnackbar('Cхема обновлена успешно', { variant: 'success' });
      }
      else {
        console.error('Ошибка при обновлении схемы');
        enqueueSnackbar('Ошибка при обновлении схемы', { variant: 'error' });
      }
    }
    catch (err) {
      console.error('Ошибка при обновлении схемы:', err);
      enqueueSnackbar('Ошибка при обновлении схемы', { variant: 'error' });
    }
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        colorMode={mode ?? 'light'}
        nodes={nodes}
        edges={edges}
        defaultEdgeOptions={defaultEdgeOptions(mode)}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onSelectionChange={onSelectionChange}
        connectionLineStyle={useMemo(() => ({ stroke: mode == 'dark' ? '#eeeeee' : '#222222' }), [])}
        onConnect={handleOnConnect}
        proOptions={{ hideAttribution: true }}
        fitView
        minZoom={0.1}
        snapGrid={[10, 10]}
        snapToGrid={true}
        onlyRenderVisibleElements
      >
        <Background color="#222222" size={2} gap={40} />
        <Panel position='top-left'>
          <Stack gap={2}>
            <Stack direction='row' gap={2}>
              <HeaderButton />
              <Frame sx={{ padding: '5px' }}>
                <Stack direction='row' gap={1}>
                  <Tooltip title='Сохранить'>
                    <IconButton color='inherit' onClick={save}><Icon icon='save' /></IconButton>
                  </Tooltip>
                  <Tooltip title='Экспорт PDF'>
                    <IconButton color='inherit' onClick={pdf}><Icon icon='filePdf2' /></IconButton>
                  </Tooltip>
                  <Tooltip title='Снимок схемы'>
                    <IconButton color='inherit' onClick={takeScreenshot}><Icon icon='screenshot2' /></IconButton>
                  </Tooltip>
                </Stack>
              </Frame>
            </Stack>
            <Stack direction='row' gap={2}>
              <Frame sx={{ padding: '5px', width: 'fit-content' }}>
                <Stack direction='row'>
                  <Tooltip title='Выравнить узлы'>
                    <IconButton color='inherit' onClick={() => setLayouted(nodes, edges)}><Icon icon='layout_tree' /></IconButton>
                  </Tooltip>
                  <Tooltip title='Показать всю схему'>
                    <IconButton color='inherit' onClick={() => fitView()}><Icon icon='focus2' /></IconButton>
                  </Tooltip>
                </Stack>
              </Frame>
              <PanelNodes />
            </Stack>
          </Stack>
        </Panel>
        <Panel position="top-right" style={{ display: 'flex', flexDirection: 'column', gap: '10px', zIndex: '1000' }}>
          <PanelMapElementManager selectedElement={selectedElement} />
        </Panel>
      </ReactFlow>
    </div >
  )
}

export default MapTemplatesDiagram