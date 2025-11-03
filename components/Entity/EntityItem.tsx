"use client";

import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Chip,
  Paper,
} from "@mui/material";
import React, { useCallback } from "react";
import Icon from "../UI/Icon";
import { useEntityTemplate } from "@/configs/entityConfig";
import { BaseEntity } from "@/types/entity";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface EntityItemProps {
  entity: BaseEntity;
  entityType: string;
  onEdit?: (entity: BaseEntity) => void;
  onDelete?: (id: string | number, title: string) => void;
  onUploadImage?: (id: string | number) => void;
}

const EntityItem = ({
  entity,
  entityType,
  onEdit,
  onDelete,
  onUploadImage,
}: EntityItemProps) => {
  const { id, title, image, isNew } = entity;
  const template = useEntityTemplate(entityType);
  const router = useRouter();
  const viewUrl = template.view.url(id);

  /** Переход по клику */
  const handleCardClick = useCallback(() => {
    if (template.features.view) {
      router.push(viewUrl); // вместо window.open
    }
  }, [router, viewUrl, template.features.view]);

  const handleAction = useCallback(
    (e: React.MouseEvent, action: () => void) => {
      e.stopPropagation();
      action();
    },
    []
  );

  // GRID LAYOUT (например, для Diagrams, Templates)
  if (template.layout === "grid") {
    return (
      <Tooltip title={title ?? ""} arrow>
        <Card
          onClick={handleCardClick}
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 3,
            cursor: template.features.view ? "pointer" : "default",
            "&:hover .actions": { opacity: 1 },
            "&:hover .overlay": {
              opacity: template.features.view ? 1 : 0,
            },
          }}
        >
          {isNew && (
            <Chip
              sx={{ position: "absolute", m: 1, zIndex: 2 }}
              label="Новое"
              color="primary"
              size="small"
            />
          )}

          {image ? (
            <CardMedia
              component="img"
              height="180"
              image={image}
              alt={title}
              sx={{ objectFit: "cover" }}
              onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null; // предотвращаем бесконечный цикл
                target.src = "/images/no-image.jpg"; // путь к заглушке
              }}
            />
          ) : (
            <Box
              height={180}
              display="flex"
              alignItems="center"
              justifyContent="center"
              bgcolor="action.hover"
              color="text.secondary"
            >
              Нет изображения
            </Box>
          )}

          <Box
            className="overlay"
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.1))",
              opacity: 0,
              transition: "opacity 0.2s ease-in-out",
            }}
          />

          <CardContent
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              color: "white",
              zIndex: 2,
              p: ".4rem 1.5rem",
              background: "#00000070",
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{
                color: "white",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </Typography>
          </CardContent>

          <Stack
            className="actions"
            direction="row"
            spacing={1}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              opacity: 0,
              transition: "opacity 0.2s ease-in-out",
              zIndex: 3,
            }}
          >
            {template.features.view && (
              <Tooltip title={`Открыть ${template.name.toLowerCase()}`}>
                <IconButton
                  onClick={(e) =>
                    handleAction(e, () => router.push(viewUrl))
                  }
                  size="small"
                  sx={{ bgcolor: "rgba(0,0,0,0.4)", color: "#fff" }}
                >
                  <Icon icon="shareBox" />
                </IconButton>
              </Tooltip>
            )}

            {template.features.imageUpload && onUploadImage && (
              <Tooltip title="Загрузить изображение">
                <IconButton
                  onClick={(e) =>
                    handleAction(e, () => onUploadImage(id))
                  }
                  size="small"
                  sx={{ bgcolor: "rgba(0,0,0,0.4)", color: "#fff" }}
                >
                  <Icon icon="image" />
                </IconButton>
              </Tooltip>
            )}

            {template.features.edit && onEdit && (
              <Tooltip title={`Редактировать ${template.name.toLowerCase()}`}>
                <IconButton
                  onClick={(e) => handleAction(e, () => onEdit(entity))}
                  size="small"
                  sx={{ bgcolor: "rgba(0,0,0,0.4)", color: "#fff" }}
                >
                  <Icon icon="edit" />
                </IconButton>
              </Tooltip>
            )}

            {template.features.delete && onDelete && (
              <Tooltip title={`Удалить ${template.name.toLowerCase()}`}>
                <IconButton
                  onClick={(e) =>
                    handleAction(e, () => onDelete(id, title))
                  }
                  size="small"
                  sx={{
                    bgcolor: "rgba(0,0,0,0.4)",
                    color: "error.light",
                  }}
                >
                  <Icon icon="delete" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Card>
      </Tooltip>
    );
  }

  // LIST LAYOUT (Funnels, Kanbans)
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
        alignItems="center"
      >
        <Stack width="100%" direction="row" spacing={1} alignItems="center">
          <Typography
            variant="h6"
            noWrap
            textOverflow="ellipsis"
            overflow="hidden"
          >
            {template.features.view ? (
              <Link href={viewUrl} prefetch>
                {title}
              </Link>
            ) : (
              title
            )}
          </Typography>
          {isNew && (
            <Chip
              label="Новый"
              color="primary"
              size="small"
              sx={{ ml: 1 }}
            />
          )}
        </Stack>

        <Stack
          className="actions"
          gap={1}
          sx={{ opacity: 0, transition: "opacity 0.2s ease-in-out" }}
          direction="row"
        >
          {template.features.view && (
            <Tooltip title={`Открыть ${template.name.toLowerCase()}`}>
              <Link href={viewUrl} prefetch>
                <IconButton size="small">
                  <Icon icon="shareBox" />
                </IconButton>
              </Link>
            </Tooltip>
          )}

          {template.features.edit && onEdit && (
            <Tooltip title={`Редактировать ${template.name.toLowerCase()}`}>
              <IconButton onClick={() => onEdit(entity)} size="small">
                <Icon icon="edit" />
              </IconButton>
            </Tooltip>
          )}

          {template.features.delete && onDelete && (
            <Tooltip title={`Удалить ${template.name.toLowerCase()}`}>
              <IconButton
                onClick={() => onDelete(id, title)}
                size="small"
                color="error"
              >
                <Icon icon="delete" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default EntityItem;
