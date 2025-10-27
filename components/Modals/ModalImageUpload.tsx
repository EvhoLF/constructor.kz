"use client";

import React, { useState, useRef } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import Image from "next/image";
import { enqueueSnackbar } from "notistack";
import { useModal } from "@/hooks/useModal";
import axios from "axios";
import { ImageUploadType } from "@/constants/upload";
import axiosClient from "@/libs/axiosClient";

interface ModalImageUploadProps {
  title?: string;
  oldImage?: string | null;
  uploadUrl: string;
  maxSizeMb?: number;
  minWidth?: number;
  minHeight?: number;
  onSuccess?: (newUrl: string) => void;
  onCancel?: () => void;
  folder?: string;
}

const ModalImageUpload: React.FC<ModalImageUploadProps> = ({
  title = "Загрузка изображения",
  oldImage = null,
  uploadUrl,
  maxSizeMb = 5,
  minWidth = 200,
  minHeight = 200,
  folder = '',
  onSuccess,
  onCancel,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { closeModal } = useModal();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    // Проверка размера
    const sizeMb = f.size / 1024 / 1024;
    if (sizeMb > maxSizeMb) {
      enqueueSnackbar(`Файл превышает ${maxSizeMb} МБ`, { variant: "warning" });
      return;
    }

    // Проверка формата
    if (!["image/png", "image/jpeg", "image/webp"].includes(f.type)) {
      enqueueSnackbar("Разрешены только PNG, JPG или WebP", { variant: "warning" });
      return;
    }

    // Проверка размеров
    const img = document.createElement("img");
    img.src = URL.createObjectURL(f);
    img.onload = () => {
      if (img.width < minWidth || img.height < minHeight) {
        enqueueSnackbar(
          `Минимальный размер ${minWidth}x${minHeight}px`,
          { variant: "warning" }
        );
        return;
      }
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    };
  };


  const handleUpload = async () => {
    if (!file) return enqueueSnackbar("Выберите файл", { variant: "warning" });

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    if (oldImage) formData.append("oldImage", oldImage);

    try {
      const res = await axiosClient.post(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      enqueueSnackbar("Изображение успешно загружено", { variant: "success" });
      if (onSuccess) onSuccess(res.data.url);
      closeModal();
    } catch (error: any) {
      console.error(error);
      enqueueSnackbar(error.response?.data?.error || error.message || "Ошибка при загрузке", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h6">{title}</Typography>
      <Stack spacing={2} mt={2} alignItems="center">
        {/* Предпросмотр */}
        <Box
          sx={{
            width: 300,
            height: 200,
            border: "3px dashed rgba(125,125,125,0.2)",
            borderColor: 'primary',
            borderRadius: 2,
            overflow: "hidden",
            position: "relative",
            cursor: "pointer",
            "&:hover": { opacity: 0.8 },
          }}
          onClick={() => inputRef.current?.click()}
        >
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              style={{ objectFit: "contain" }}
            />
          ) : oldImage ? (
            <Image
              src={oldImage}
              alt="Current"
              fill
              style={{ objectFit: "contain" }}
            />
          ) : (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ height: "100%", color: "text.secondary" }}
            >
              <Typography>Нажмите, чтобы выбрать файл</Typography>
            </Stack>
          )}
        </Box>

        <input
          type="file"
          ref={inputRef}
          accept="image/png,image/jpeg,image/webp"
          hidden
          onChange={handleFileSelect}
        />

        <Stack direction="row" spacing={2}>
          <Button onClick={() => { if (onCancel) { onCancel(); } closeModal(); }} disabled={loading} color="error">
            Отмена
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!file || loading}
          >
            {loading ? <CircularProgress size={24} /> : "Сохранить"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ModalImageUpload;
