import { useModal } from "@/hooks/useModal";
import { Box, Button, TextField, Typography, Stack, Switch } from "@mui/material";
import { useState } from "react";

export default function ModalDiagramImport({
  onSubmit,
  onCancel,
}: {
  onSubmit: (name: string, autoRename: boolean) => void;
  onCancel: () => void;
}) {
  const { closeModal } = useModal();
  const [name, setName] = useState("С1");
  const [auto, setAuto] = useState(true);


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
      <Typography variant="h6">Добавить схему</Typography>
      <Stack spacing={2} mt={2}>
        <TextField
          label="Имя главного узла"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Stack direction='row' alignItems='center'>
          <Typography>Авто-переименовывание</Typography>
          <Switch title="Авто-переименовывание" checked={auto} onChange={(e) => setAuto(e.target.checked)} />
        </Stack>
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
