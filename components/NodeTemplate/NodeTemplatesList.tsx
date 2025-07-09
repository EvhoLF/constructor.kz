import { Divider, Stack } from '@mui/material';
import React from 'react';
import { NodeTemplate } from '.prisma/client';
import NodeTemplateItem from './NodeTemplateItem';

type NodeTemplatesListProps = {
  nodeTemplates: (NodeTemplate & { isNew: boolean })[];
  onEdit: (tpl: NodeTemplate) => void;
  onDelete: (tpl: NodeTemplate) => void;
};

const NodeTemplatesList: React.FC<NodeTemplatesListProps> = ({ nodeTemplates, onEdit = () => () => { }, onDelete = () => () => { } }) => {
  const newNT = nodeTemplates.filter(nt => nt.isNew);
  const oldNT = nodeTemplates.filter(nt => !nt.isNew);
  return (
    <Stack gap={1}>
      {newNT.length > 0 && (
        <>
          {newNT.map(nt => (
            <NodeTemplateItem
              key={nt.id}
              id={nt.id}
              title={nt.title}
              category={nt.category}
              onEdit={() => onEdit(nt)}
              onDelete={() => onDelete(nt)}
            />
          ))}
          <Divider sx={{ my: 1 }}>Новые карты</Divider>
        </>
      )}

      {oldNT.map(nt => (
        <NodeTemplateItem
          key={nt.id}
          id={nt.id}
          title={nt.title}
          category={nt.category}
          onEdit={() => onEdit(nt)}
          onDelete={() => onDelete(nt)}
        />
      ))}
    </Stack>
  )
}

export default NodeTemplatesList;
