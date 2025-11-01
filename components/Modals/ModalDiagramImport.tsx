'use client'
import { useModal } from "@/hooks/useModal";
import { DiagramType } from "@/types/diagrams";
import { Box, Button, TextField, Typography, Stack, Switch, Tooltip } from "@mui/material";
import { useState } from "react";
import Icon from "../UI/Icon";

export default function ModalDiagramImport({
  onSubmit,
  onCancel,
  type,
}: {
  type: DiagramType,
  onSubmit: (name: string, autoRename: boolean) => void;
  onCancel: () => void;
}) {
  const { closeModal } = useModal();
  const [name, setName] = useState("С1");
  const [auto, setAuto] = useState(false);


  const handleCancel = () => {
    onCancel();
    closeModal();
  }
  const handleSubmit = () => {
    onSubmit(name, auto);
    closeModal();
  }

  return (
    <Box p={2}>
      <Typography variant="h6">Добавить диаграмму</Typography>
      <Stack spacing={2} mt={2}>
        <TextField
          label="Имя главного узла"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {
          type == 'diagram' ? <></> :
            (
              <Stack direction='row' alignItems='center' gap={1}>
                <Tooltip sx={{ fontSize: '20px', color: 'GrayText' }} title={
                  <Box fontSize={16}>
                    Функция автоматически преобразует заголовки блоков в древовидный формат вида C1, C1.1, C1.1.1, где точка обозначает новый уровень вложенности, а нумерация блоков на одном уровне начинается с 1 и последовательно увеличивается (C1.1, C1.2, C1.3...).
                  </Box>
                }>
                  <Icon icon='information' />
                </Tooltip>
                <Stack direction='row' alignItems='center'>
                  <Typography>Авто-переименовывание</Typography>
                  <Switch title="Авто-переименовывание" checked={auto} onChange={(e) => setAuto(e.target.checked)} />
                </Stack>
              </Stack>
            )
        }
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={handleCancel}>
            Отмена
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!name}
          >
            Подтвердить
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
