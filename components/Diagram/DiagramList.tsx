"use client";
import { Grid, Typography, Divider } from "@mui/material";
import React, { Fragment } from "react";
import DiagramListItem from "./DiagramListItem";
import { SuperDiagram } from "@/types/diagrams";
type DiagramListProps = {
  diagrams: (SuperDiagram & { isNew: boolean })[];
  onEdit: (id: string | number, title: string) => () => void;
  onDelete: (id: string | number, title: string) => () => void;
  onUploadImage: (id: string | number) => () => void;
};

const DiagramList: React.FC<DiagramListProps> = ({
  diagrams,
  onEdit,
  onDelete,
  onUploadImage,
}) => {
  const newDiagrams = diagrams.filter((d) => d.isNew);
  const oldDiagrams = diagrams.filter((d) => !d.isNew);

  const renderBlock = (diagram: SuperDiagram & { isNew: boolean }) => (
    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }} key={diagram.id}>
      <DiagramListItem
        {...diagram}
        onEdit={onEdit}
        onDelete={onDelete}
        onUploadImage={onUploadImage}
      />
    </Grid>
  );

  return (
    <>
      {newDiagrams.length > 0 && (
        <Fragment key="new-maps">
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Новые карты
          </Typography>
          <Grid container spacing={2}>
            {newDiagrams.map(renderBlock)}
          </Grid>
          <Divider sx={{ my: 3 }} />
        </Fragment>
      )}
      <Grid container spacing={2}>
        {oldDiagrams.map(renderBlock)}
      </Grid>
    </>
  );
};

export default DiagramList;
