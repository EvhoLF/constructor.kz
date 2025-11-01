// components/Entity/EntityItemsList.tsx
"use client";
import { Grid, Typography, Divider, Stack } from "@mui/material";
import React, { Fragment } from "react";
import EntityItem from "./EntityItem";
import { BaseEntity } from "@/types/entity";
import { useEntityTemplate } from "@/configs/entityConfig";
// import { BaseEntity } from "@/types/entity";
// import { useEntityTemplate } from "@/config/entityTemplates";

interface EntityItemsListProps {
    entities: BaseEntity[];
    entityType: string;
    onEdit?: (entity: BaseEntity) => void;
    onDelete?: (id: string | number, title: string) => void;
    onUploadImage?: (id: string | number) => void;
}

const EntityItemsList = ({
    entities,
    entityType,
    onEdit,
    onDelete,
    onUploadImage,
}: EntityItemsListProps) => {
    const template = useEntityTemplate(entityType);

    const newEntities = entities.filter((d) => d.isNew);
    const oldEntities = entities.filter((d) => !d.isNew);
    

    if (template.layout === 'list') {
        return (
            <Stack gap={1}>
                {newEntities.length > 0 && (
                    <Fragment key="new-entities">
                        {newEntities.map((entity) => (
                            <EntityItem
                                key={entity.id}
                                entity={entity}
                                entityType={entityType}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onUploadImage={onUploadImage}
                            />
                        ))}
                        <Divider sx={{ my: 1 }}>Новые {template.namePlural.toLowerCase()}</Divider>
                    </Fragment>
                )}

                {oldEntities.map((entity) => (
                    <EntityItem
                        key={entity.id}
                        entity={entity}
                        entityType={entityType}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onUploadImage={onUploadImage}
                    />
                ))}
            </Stack>
        );
    }

    // Grid layout
    const renderBlock = (entity: BaseEntity) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, }} key={entity.id}>
            <EntityItem
                entity={entity}
                entityType={entityType}
                onEdit={onEdit}
                onDelete={onDelete}
                onUploadImage={onUploadImage}
            />
        </Grid>
    );

    return (
        <>
            {newEntities.length > 0 && (
                <Fragment key="new-entities">
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        Новые {template.namePlural.toLowerCase()}
                    </Typography>
                    <Grid container spacing={2}>
                        {newEntities.map(renderBlock)}
                    </Grid>
                    <Divider sx={{ my: 3 }} />
                </Fragment>
            )}
            <Grid container spacing={2}>
                {oldEntities.map(renderBlock)}
            </Grid>
        </>
    );
};

export default EntityItemsList;