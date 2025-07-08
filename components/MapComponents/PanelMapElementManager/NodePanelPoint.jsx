'use client'
import React, { memo } from 'react';
import InputText from '@/components/UI/InputText';
import Frame from '@/components/UI/Frame';
import { useReactFlow, useStore } from '@xyflow/react';
import { ButtonGroup, Grid, Stack, Switch, Typography } from '@mui/material';
import DropdownSearchMenu from '@/components/UI/DropdownSearchMenu';
import { IconsNames } from '@/Icons';
import IconSwitch from '@/components/UI/IconSwitch';
import NodeFitText from '@/utils/Map/NodeFitText';
import { init_NodePoint_data } from '../Nodes';
import InputColorText from '@/components/UI/InputColorText';

const data_icons = IconsNames.slice(0, 10).map(e => ({ id: e, name: e, icon: e }));

const NodePanelPoint = ({ setFormulaError, id }) => {
  const { updateNodeData, updateNode } = useReactFlow();
  const storeData = useStore(e => {
    const res = e.nodes.find(n => n.id == id);
    if (!res) return null;
    return res.data
  });
  if (!storeData) return null;
  const data = { ...init_NodePoint_data(), ...storeData }

  const updateData = (updateData) => updateNodeData(id, updateData);

  const FitText = (text) => {
    const res = NodeFitText({ text, icon: data.isIconVisible });
    updateNode(id, { width: res })
  }

  const handleLabelChange = (e) => {
    const value = e.target.value.toUpperCase() ?? '';
    if (data.isAutoResize) FitText(value);
    if (setFormulaError) setFormulaError(null);
    updateData({ label: value });
  }

  const handleAutoResize = (e) => {
    const value = e.target.checked ?? false;
    if (value) FitText(data.label);
    updateData({ isAutoResize: value });
  }

  return (
    <Frame sx={{ padding: '1rem', maxWidth: '250px' }}>
      <Stack spacing={1.5}>
        <Typography variant='h6'>Параметры</Typography>
        <Stack direction='row' gap={1}>
          <InputText label='Заголовок' value={data.label} size='small' placeholder='Label' onChange={handleLabelChange} />
          <IconSwitch brightnessOff={50} value={data.isLabelVisible} onClick={() => updateData({ isLabelVisible: !data.isLabelVisible })} />
        </Stack>
        <Grid container spacing={1}>
          <Grid size={6}>
            <InputColorText label='1й цвет' value={data.colorPrimary} pickColor={(e) => updateData({ colorPrimary: e })} setColor={(e) => updateData({ colorPrimary: e.target.value })} />
          </Grid>
          <Grid size={6}>
            <InputColorText label='2й цвет' value={data.colorSecondary} pickColor={(e) => updateData({ colorSecondary: e })} setColor={(e) => updateData({ colorSecondary: e.target.value })} />
          </Grid>
        </Grid>
        <Stack direction='row' alignItems="center" justifyContent='space-between' gap={1}>
          <Typography>Иконка </Typography>
          <ButtonGroup variant='outlined' sx={{ gap: 1 }} aria-label="Basic button group">
            <DropdownSearchMenu value={data.icon} onChange={(e) => updateData({ icon: e })} data={data_icons} getLabel={(item) => item.name} getIcon={(item) => item.icon} />
            <IconSwitch brightnessOff={75} value={data.isIconVisible} onClick={() => { updateData({ icon: data.icon ?? 'default', isIconVisible: !data.isIconVisible }); }} />
          </ButtonGroup>

        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
          <Typography>Обязательный</Typography>
          <Switch checked={data.isRequired} onChange={e => updateData({ isRequired: e.target.checked })} />
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
          <Typography>Обводка</Typography>
          <Switch checked={data.isBorderVisible} onChange={e => updateData({ isBorderVisible: e.target.checked })} />
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
          <Typography>Автоширина</Typography>
          <Switch checked={data.isAutoResize} onChange={handleAutoResize} />
        </Stack>
        <InputText label='Описание' rows={5} multiline value={data.description || ''} onChange={(e) => updateData({ description: e.target.value })} />
      </Stack>
    </Frame>
  );
};

export default memo(NodePanelPoint, (prev, next) => {
  return prev.id == next.id
});

// export default memo(NodePanelPoint)