'use client'
import React, { memo, useEffect, useRef } from 'react';
import Frame from '@/components/UI/Frame';
import InputText from '@/components/UI/InputText';
import InputColorText from '@/components/UI/InputColorText';
import { useReactFlow, useStore } from '@xyflow/react';
import { ButtonGroup, Grid, Stack, Switch, Typography, Box, IconButton } from '@mui/material';
import IconSwitch from '@/components/UI/IconSwitch';
import NodeFitText from '@/utils/Map/NodeFitText';
import { init_NodePoint_data } from '../Nodes';
import DropdownMenu from '@/components/UI/DropdownMenu';
import Icon from '@/components/UI/Icon';
import { DataIconsGrouped } from '@/Icons/IconsData';

const NodePanelPoint = ({ setFormulaError, id }) => {
  const { updateNodeData, updateNode, deleteElements } = useReactFlow();
  const labelRef = useRef(null)

  useEffect(() => {
    if (id && labelRef.current) labelRef.current.focus()
  }, [id])

  const storeData = useStore(e => {
    const res = e.nodes.find(n => n.id === id);
    if (!res) return null;
    return {
      data: res?.data || '',
      width: res?.width || res.measured?.width,
      height: res?.height || res.measured?.height
    };
  });
  if (!storeData) return null;

  const data = { ...init_NodePoint_data(), ...storeData.data };

  const updateData = (updateData) => updateNodeData(id, updateData);

  const FitText = (text) => {
    const res = NodeFitText({ text, icon: data.isIconVisible });
    updateNode(id, { width: res });
  };

  const handleLabelChange = (e) => {
    const value = e.target.value ?? '';
    if (data.isAutoResize) FitText(value);
    if (setFormulaError) setFormulaError(null);
    updateData({ label: value });
  };

  const handleAutoResize = (e) => {
    const value = e.target.checked ?? false;
    if (value) FitText(data.label);
    updateData({ isAutoResize: value });
  };

  const handleDelete = () => {
    deleteElements({ nodes: [{ id }] });
  };

  return (
    <Frame sx={{ padding: '1rem', maxWidth: '250px' }}>
      <Stack spacing={0.5}>
        <Stack direction='row' justifyContent='space-between' gap={1}>
          <Typography variant='h6'>Параметры</Typography>
          <IconButton onClick={handleDelete}><Icon icon='delete' /></IconButton>
        </Stack>

        <Stack spacing={2}>
          <Stack direction='row' gap={1}>
            <InputText inputRef={labelRef} label='Заголовок' value={data.label} size='small' placeholder='Label' onChange={handleLabelChange} />
            <IconSwitch brightnessOff={50} value={data.isLabelVisible} onClick={() => updateData({ isLabelVisible: !data.isLabelVisible })} />
          </Stack>
        </Stack>

        <Grid container spacing={1} pt={1.5}>
          <Grid size={6}>
            <InputColorText
              label='1й цвет'
              value={data.colorPrimary}
              pickColor={(e) => updateData({ colorPrimary: e })}
              setColor={(e) => updateData({ colorPrimary: e })}
            />
          </Grid>
          <Grid size={6}>
            <InputColorText
              label='2й цвет'
              value={data.colorSecondary}
              pickColor={(e) => updateData({ colorSecondary: e })}
              setColor={(e) => updateData({ colorSecondary: e })}
            />
          </Grid>
        </Grid>

        <Stack direction='row' alignItems="center" justifyContent='space-between' gap={1}>
          <Typography>Иконка </Typography>
          <ButtonGroup variant='outlined' sx={{ gap: 1 }}>
            <DropdownMenu
              columns={6}
              data={DataIconsGrouped}
              displayItem={(item) => (
                <Box display="flex" flexDirection="column" alignItems="center">
                  <IconButton onClick={() => updateData({ icon: item.id, isIconVisible: true, })} color='primary'>
                    <Icon icon={item.icon} />
                  </IconButton>
                  <Typography fontSize="0.75rem" width='100%' textOverflow='ellipsis' overflow='hidden' align="center">{item.label}</Typography>
                </Box>
              )}
            // onChange={(id) => updateData({ icon: id })}
            >
              <Icon icon={data.icon || "default"} />
            </DropdownMenu>

            <IconSwitch
              brightnessOff={75}
              value={data.isIconVisible}
              onClick={() => updateData({ icon: data.icon ?? 'default', isIconVisible: !data.isIconVisible })}
            />
          </ButtonGroup>
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
          <label htmlFor="required-switch" style={{ cursor: 'pointer' }}>
            <Typography sx={{ userSelect: 'none' }}>Инверсия</Typography>
          </label>
          <Switch id="required-switch" checked={data.isRequired} onChange={e => updateData({ isRequired: e.target.checked })} />
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
          <label htmlFor="borderVisible-switch" style={{ cursor: 'pointer' }}>
            <Typography sx={{ userSelect: 'none' }}>Обводка</Typography>
          </label>
          <Switch id='borderVisible-switch' checked={data.isBorderVisible} onChange={e => updateData({ isBorderVisible: e.target.checked })} />
        </Stack>

        <Grid container spacing={1} pt={1}>
          <Grid size={6}>
            <InputText
              label='Ширина'
              value={storeData.width || ''}
              onChange={(e) => updateNode(id, { width: parseInt(e.target.value) || 0 })}
              size='small'
              disabled={data.isAutoResize}
            />
          </Grid>
          <Grid size={6}>
            <InputText
              label='Высота'
              value={storeData.height || ''}
              onChange={(e) => updateNode(id, { height: parseInt(e.target.value) || 0 })}
              size='small'
              disabled={data.isAutoResize}
            />
          </Grid>
        </Grid>

        <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
          <label htmlFor="autoResize-switch" style={{ cursor: 'pointer' }}>
            <Typography sx={{ userSelect: 'none' }}>Автоширина</Typography>
          </label>
          <Switch id='autoResize-switch' checked={data.isAutoResize} onChange={handleAutoResize} />
        </Stack>

        <InputText label='Описание' rows={5} multiline value={data.description || ''} onChange={(e) => updateData({ description: e.target.value })} />
      </Stack>
    </Frame>
  );
};

export default memo(NodePanelPoint, (prev, next) => prev.id === next.id);
