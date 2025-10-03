'use client'
import DnD from '@/components/DnD/DnD';
import Frame from '@/components/UI/Frame';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import IconNodes from './IconNodes';
import { init_NodePoint, NodePoint } from '../Nodes';
import { useAsync } from '@/hooks/useAsync';
import axios from 'axios';
import { decompress } from '@/utils/compress';
import DropdownMenu, { DropdownItem } from '@/components/UI/DropdownMenu';
import { Edge, useReactFlow } from '@xyflow/react';
import { rootNodeID } from '@/utils/Formula/FormulaConfig';
import Icon from '@/components/UI/Icon';
import { v4 as uuidv4 } from 'uuid';
import { SuperTemplate } from '@/global';
import { useDiagramType } from '@/hooks/DiagramTypeContext';

// type dataType = { id: string, label: string, props: { [key: string]: any, data: NodePointData } }[]

// const data: dataType = [
//   { id: 'default_required', label: 'Обязательный узел', props: { type: 'ADD_NODE', data: { isRequired: true } } },
//   { id: 'default_no_required', label: 'Не обязательный узел', props: { type: 'ADD_NODE', data: { isRequired: false } } },
// ]

const onDecompress = (data: string | null | undefined) => data ? decompress(data) : []

const PanelNodes = () => {
  const { templateApi } = useDiagramType();
  const [nodeTemplates, setNodeTemplates] = useState<DropdownItem[]>([]);
  const { asyncFn } = useAsync();

  const { addNodes, screenToFlowPosition } = useReactFlow();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createNodeTemplate = (id: string, label: string, group: string, type: string, data: any, props: any = {}) => ({
    id, label, group, type, props: { props, type, data }
  });

  const addNewNode = () => {
    addNodes({ ...init_NodePoint({ id: uuidv4(), position: screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 }), data: { label: 'zxc' } }), id: uuidv4() })
  }

  useEffect(() => {
    try {
      const fetch = async () => {
        const res = await asyncFn(() => axios.get(templateApi))
        if (!res || !res.data) return;
        const resData: SuperTemplate[] = res.data;
        const result: DropdownItem[] = [];
        resData.forEach(e => {
          const decompressNodes: NodePoint[] = onDecompress(e.nodes);
          const decompressEdges: Edge[] = onDecompress(e.edges);
          decompressNodes.forEach(node => {
            if (node.id == rootNodeID) {
              const aaa = createNodeTemplate(node.id, `Схема`, e.title, 'ADD_SCHEME', { nodes: decompressNodes, edges: decompressEdges });
              result.push(aaa);
            }
            else {
              const aaa = createNodeTemplate(node.id, node.data.label, e.title, 'ADD_NODE', node.data, { width: node?.measured?.width });
              result.push(aaa);
            }
          })
        });
        setNodeTemplates(result);
      }
      fetch();
    }
    catch (err) {
      console.error(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const displayItem = (item: DropdownItem) => {
    if (item.type == 'ADD_NODE') {
      const itemLabel = item.label ?? `Узел ${item.id}`
      const nodeData = { ...item.props.data, label: 'C' }
      return (
        <DnD key={item.id} props={item.props}>
          <Tooltip title={itemLabel}>
            <Stack gap={.5}>
              <IconNodes {...nodeData} sx={{ width: '50px', height: '30px' }} />
              <Typography width='100%' overflow='hidden' sx={{ textOverflow: 'ellipsis' }} textAlign='center' fontSize='.75rem' textOverflow='' noWrap>{itemLabel}</Typography>
            </Stack>
          </Tooltip>
        </DnD >
      )
    };
    if (item.type == 'ADD_SCHEME') {
      const itemLabel = item.label ?? `Cхема`
      const nodeData: { isIconVisible: true, label: string } = { isIconVisible: true, label: '' }
      return (
        <DnD key={item.id} props={item.props}>
          <Box>
            <Tooltip title={itemLabel}>
              <Stack gap={.5}>
                <IconNodes {...nodeData} sx={{ width: '50px', height: '30px' }} />
                <Typography textAlign='center' fontSize='.75rem' overflow='hidden' textOverflow='' noWrap>{itemLabel}</Typography>
              </Stack>
            </Tooltip>
          </Box>
        </DnD >
      )
    };

    return null;
  }

  return (
    <Frame sx={{ width: 'fit-content', padding: '5px' }}>
      <Stack direction='row'>
        <Tooltip title='Создать из шаблона'>
          <DropdownMenu data={nodeTemplates} displayItem={displayItem} onChange={() => { }}>
            <Icon icon='function' />
          </DropdownMenu>
        </Tooltip>
        <DnD props={{ type: "ADD_NODE", data: { label: 'Узел' } }}>
          <Tooltip title='Создать узел'>
            <IconButton color='inherit' onClick={addNewNode}><Icon icon='add' /></IconButton>
          </Tooltip>
        </DnD >
      </Stack>
      {/* <Stack spacing={1}>
        {
          data.map(el => (
            <DnD key={el.id} props={el.props}>
              <Stack direction='row'>
                <IconNodes {...el.props.data} sx={{ width: '60px', height: '30px' }} />
                <Button sx={{ minWidth: 0, }} color='primary'>
                  <Typography>{el.label ?? `Узел ${el.id}`}</Typography>
                </Button>
              </Stack>
            </DnD>
          ))
        }
      </Stack> */}
    </Frame >
  )
}

export default PanelNodes