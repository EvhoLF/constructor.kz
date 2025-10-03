import { Divider, Stack } from '@mui/material';
import React, { Fragment } from 'react';
import DiagramListItem from './DiagramListItem';
import { DiagramType, SuperDiagram } from '@/global';

type DiagramListProps = {
  diagrams: (SuperDiagram & { isNew: boolean })[];
  onEdit: (id: string | number, title: string) => () => void;
  onDelete: (id: string | number, title: string) => () => void;
};

const DiagramList: React.FC<DiagramListProps> = ({ diagrams, onEdit = () => () => { }, onDelete = () => () => { } }) => {
  const newDiagrams = diagrams.filter(diagram => diagram.isNew);
  const oldDiagrams = diagrams.filter(diagram => !diagram.isNew);

  const GetList = (diagram: SuperDiagram & { isNew: boolean }) => {
    const { id, title, isNew } = diagram;
    if ('formula' in diagram) return { id, title, formula: diagram.formula, isNew, onEdit, onDelete }
    else return { id, title, onEdit, onDelete, isNew }
  }

  return (
    <Stack gap={1}>
      {newDiagrams.length > 0 && (
        <Fragment key="new-maps">
          {newDiagrams.map(diagram => (
            <DiagramListItem key={diagram.id} {...GetList(diagram)} />
          ))}
          <Divider sx={{ my: 1 }}>Новые карты</Divider>
        </Fragment>
      )}

      {oldDiagrams.map(diagram => (
        <DiagramListItem key={diagram.id} {...GetList(diagram)} />
      ))}
    </Stack>
  )
}

export default DiagramList;
