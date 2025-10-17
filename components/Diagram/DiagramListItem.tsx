"use client";
import {
  Box,
  Chip,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import Icon from "../UI/Icon";
import Link from "next/link";
import { DiagramFormula } from ".prisma/client";
import { useDiagramType } from "@/hooks/DiagramTypeContext";

interface DiagramListItem extends Pick<DiagramFormula, "id" | "title"> {
  onEdit: (id: string | number, title: string) => () => void;
  onDelete: (id: string | number, title: string) => () => void;
  formula?: string;
  isNew?: boolean;
}

const DiagramListItem = ({
  id,
  title,
  formula = "",
  onEdit = () => () => {},
  onDelete = () => () => {},
  isNew = false,
}: DiagramListItem) => {
  const { type, url } = useDiagramType(id);

  const text = isNew ? "zxc" : "123";

  return (
    <Paper
      variant="outlined"
      elevation={3}
      sx={{
        backgroundColor: "uiPanel.main",
        padding: ".25rem 1rem",
        borderRadius: "2rem",
        transition: "all 0.2s ease-in-out",
        "&:hover .actions": { opacity: 1 },
        "&:hover": {
          backgroundColor: "uiPanel.hoverMain",
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{
          height: "fit-content",
        }}
      >
        {type == "formula" ? (
          <Grid width="100%" container>
            <Grid size={6}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography
                  variant="h6"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  <Link href={url} passHref>
                    {title}
                  </Link>
                </Typography>
                {isNew && (
                  <div style={{ pointerEvents: "none" }}>
                    <Chip label="Новый" color="primary" size="small" />
                  </div>
                )}
              </Stack>
            </Grid>
            <Grid size={6} alignContent="center">
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  noWrap
                  textOverflow="ellipsis"
                  overflow="hidden"
                >
                  {formula ? formula : '(Нет формулы)'}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        ) : (
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h6" overflow="hidden" textOverflow="ellipsis">
              <Link href={url} passHref>
                {title}
              </Link>
            </Typography>
            {isNew && (
              <div style={{ pointerEvents: "none" }}>
                <Chip label="Новый" color="primary" size="small" />
              </div>
            )}
          </Stack>
        )}
        <Stack
          className="actions"
          gap={1}
          sx={{ opacity: 0, transition: "opacity 0.2s ease-in-out" }}
          direction="row"
        >
          <Tooltip title="Открыть схему">
            <Link href={url} passHref>
              <IconButton size="small">
                <Icon icon="shareBox" />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="Редактировать схему">
            <IconButton onClick={onEdit(id, title)} size="small">
              <Icon icon="edit" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Удалить схему">
            <IconButton
              onClick={onDelete(id, title)}
              size="small"
              color="error"
            >
              <Icon icon="delete" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default DiagramListItem;
