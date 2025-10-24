"use client";

import { Button, Stack, Typography, CircularProgress, Box, Grid, } from "@mui/material";
import { useSession } from "next-auth/react";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useModal } from "@/hooks/useModal";
import Icon from "../UI/Icon";
import { useDiagramType } from "@/hooks/DiagramTypeContext";
import ModalImageUpload from "../Modals/ModalImageUpload";
import TemplateFilterPanel, { SortOption } from "./TemplateFilterPanel";
import TemplatesList from "./TemplatesList";
import ModalTemplateCreate from "../Modals/ModalTemplateCreate";
import ModalFormTemplateEdit from "../Modals/ModalTemplateEdit";
import ModalTemplateDelete from "../Modals/ModalTemplateDelete";
import { SuperDiagram } from "@/types/diagrams";

const Templates = () => {
  const { data: session } = useSession({ required: true });

  const { showModal } = useModal();
  const [diagrams, setDiagrams] = useState<
    (SuperDiagram & { isNew: boolean })[]
  >([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("updatedAt_desc");

  const { templateApi, imageUploadType } = useDiagramType();

  useEffect(() => {
    if (!session?.user.id) return;
    setLoading(true);
    axios
      .get(templateApi)
      .then((res) => {
        const templates = (res?.data || []).map((template: any) => ({
          ...template, isNew: template.isNew || false
        }));
        setDiagrams(templates);
      })
      .catch((err) => {
        console.error('Ошибка при загрузке:', err);
      })
      .finally(() => setLoading(false));
  }, [session?.user.id, templateApi]);

  const filteredAndSortedDiagrams = useMemo(() => {
    const [field, order] = sortOption.split("_") as ["title" | "createdAt" | "updatedAt", "asc" | "desc"];

    const filtered = diagrams.filter((diagram) => diagram?.title?.toLowerCase().includes(search?.toLowerCase()));

    const sorted = [...filtered].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;
      if (field === "createdAt" || field === "updatedAt") {
        aValue = new Date(a[field]).getTime();
        bValue = new Date(b[field]).getTime();
      } else {
        aValue = a[field] as string;
        bValue = b[field] as string;
      }
      if (aValue < bValue) return order === "asc" ? -1 : 1;
      if (aValue > bValue) return order === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [diagrams, search, sortOption]);

  const showModalCreate = () => {
    showModal({
      content: <ModalTemplateCreate api={templateApi} setTemplates={setDiagrams} />,
    });
  };
  const showModalEdit =
    (id: string | number, title: string, category: string) => () => {
      showModal({
        content: (<ModalFormTemplateEdit api={templateApi} id={id} title={title} category={category} setTemplates={setDiagrams} />),
      });
    };
  const showModalDelete =
    (id: string | number, title: string) => () => {
      showModal({
        content: (<ModalTemplateDelete api={templateApi} id={id as number} title={title} setTemplates={setDiagrams} />),
      });
    };
  const showModalImageUpload =
    (id: string | number) => () => {

      showModal({
        content: (
          <ModalImageUpload
            title='Загрузка изображения'
            currentImageUrl={null}
            uploadUrl='/api/upload/img'
            folder={`/image/${imageUploadType}`}
            maxSizeMb={5}
            onSuccess={async (imageUrl) => {
              const res = await axios.post('/api/imageUpdate', { id, type: imageUploadType, imageUrl });
              console.log(res);
              if (res?.data?.success && res?.data?.updated) {
                setDiagrams((diagrams) =>
                  diagrams.map((diagram) => diagram.id == id ? { ...diagram, ...res?.data?.updated } : diagram)
                );
              }
            }}
          />
        ),
      });
    };

  return (
    <Stack spacing={2} padding={1}>
      <Grid
        container
        width="100%"
        gap={2}
        direction={{ xs: "column", sm: "row" }}
      >
        <Grid size="grow">
          <TemplateFilterPanel
            search={search}
            onSearchChange={setSearch}
            sortOption={sortOption}
            onSortOptionChange={setSortOption}
          />
        </Grid>
        <Grid size="auto">
          <Button
            size="large"
            sx={{
              maxWidth: { xs: "100%", sm: "200px" },
              width: { xs: "100%", sm: "100%", md: "200px" },
            }}
            startIcon={<Icon icon="add" />}
            variant="contained"
            onClick={showModalCreate}
          ></Button>
        </Grid>
      </Grid>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexGrow={1}
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      ) : filteredAndSortedDiagrams.length > 0 ? (
        <TemplatesList
          diagrams={filteredAndSortedDiagrams}
          onEdit={showModalEdit}
          onDelete={showModalDelete}
          onUploadImage={showModalImageUpload}
        />
      ) : (
        <Typography variant="body2" color="text.secondary">
          Нет карт, соответствующих фильтру
        </Typography>
      )}
    </Stack>
  );
};

export default Templates;
