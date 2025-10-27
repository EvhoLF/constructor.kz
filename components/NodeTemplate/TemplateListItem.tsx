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
} from "@mui/material";
import Link from "next/link";
import React from "react";
import Icon from "../UI/Icon";
import { useDiagramType } from "@/hooks/DiagramTypeContext";

interface TemplateListItemProps {
  id: string | number;
  title: string;
  image?: string | null;
  category?: string;
  isNew?: boolean;
  onEdit: (id: string | number, title: string, category: string) => () => void;
  onDelete: (id: string | number, title: string) => () => void;
  onUploadImage: (id: string | number) => () => void;
}

const TemplateListItem: React.FC<TemplateListItemProps> = ({
  id,
  title,
  image,
  isNew = false,
  category,
  onEdit,
  onDelete,
  onUploadImage,
}) => {
  const { templateUrl: url } = useDiagramType(id);

  return (
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 3,
        cursor: "pointer",
        "&:hover .actions": { opacity: 1 },
        "&:hover .overlay": { opacity: 1 },
      }}
    >
      {image ? (
        <CardMedia
          component="img"
          height="180"
          image={image}
          alt={title}
          sx={{ objectFit: "cover" }}
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
          Загрузите изображение
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
          p: '.4rem 1.5rem',
          background: '#00000070'
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Link href={url} passHref>
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
          </Link>
          {isNew && <Chip label="Новый" color="primary" size="small" />}
        </Stack>
        <Typography
          variant="body2"
          sx={{
            color: "white",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {category || 'Нет категории'}
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
        <Tooltip title="Открыть">
          <Link href={url} passHref>
            <IconButton size="small" sx={{ bgcolor: "rgba(0,0,0,0.4)", color: "#fff" }}>
              <Icon icon="shareBox" />
            </IconButton>
          </Link>
        </Tooltip>

        <Tooltip title="Загрузить изображение">
          <IconButton
            onClick={onUploadImage(id)}
            size="small"
            sx={{ bgcolor: "rgba(0,0,0,0.4)", color: "#fff" }}
          >
            <Icon icon='image' />
          </IconButton>
        </Tooltip>

        <Tooltip title="Редактировать">
          <IconButton
            onClick={onEdit(id, title, category || '')}
            size="small"
            sx={{ bgcolor: "rgba(0,0,0,0.4)", color: "#fff" }}
          >
            <Icon icon="edit" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Удалить">
          <IconButton
            onClick={onDelete(id, title)}
            size="small"
            sx={{ bgcolor: "rgba(0,0,0,0.4)", color: "error.light" }}
          >
            <Icon icon="delete" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Card >
  );
};

export default TemplateListItem;
