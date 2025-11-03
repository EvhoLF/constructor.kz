import React from 'react';
import InputText from '@/components/UI/InputText';
import Frame from '@/components/UI/Frame';
import { useReactFlow, useStore } from '@xyflow/react';
import { Stack, Switch, Typography } from '@mui/material';
import InputColorText from '@/components/UI/InputColorText';

const EdgePanelPoint = ({ id }) => {
  const { updateEdge } = useReactFlow();
  const storeData = useStore(state => {
    const res = state.edges.find(n => n.id == id);
    return res ? { style: res?.style ?? {}, isAlternative: res?.data?.isAlternative ?? false } : null
  });
  if (!storeData) return null;
  const { style, isAlternative } = storeData;

  const updateEdgeStyle = (newStyle) => {
    if (!storeData) return;
    updateEdge(id, { ...storeData, style: { ...style, ...newStyle, }, });
  };

  const handlerIsAlternative = (e) => {
    updateEdge(id, (edge) => ({
      ...edge,
      data: { ...edge.data, isAlternative: e.target.checked },
      style: { ...style, strokeDasharray: e.target.checked ? '10 10' : null, }
    }));
  }

  return (
    <Frame sx={{ padding: '.75rem', maxWidth: '250px' }}>
      <Stack spacing={1.5}>
        <Typography variant='h6'>Параметры</Typography>
        <InputText
          label='Толщина линии'
          value={style?.strokeWidth ?? 1}
          onChange={(e) => updateEdgeStyle({ strokeWidth: e.target.value })}
          size='small'
          placeholder='Толщина линии'
        />
        <InputColorText label='Цвет линии' value={style?.stroke ?? '#000000'} pickColor={(e) => updateEdgeStyle({ stroke: e })} setColor={(e) => updateEdgeStyle({ stroke: e })} />
        <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
          <Typography variant='body2'>Прерывистая линия</Typography>
          <Switch checked={isAlternative ?? false} onChange={handlerIsAlternative} />
        </Stack>
      </Stack>
    </Frame>
  );
};

export default EdgePanelPoint;
