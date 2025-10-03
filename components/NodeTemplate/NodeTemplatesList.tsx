import { Divider, Stack } from '@mui/material';
import React from 'react';
import NodeTemplateItem from './NodeTemplateItem';
import { SuperTemplate } from '@/global';

type NodeTemplatesListProps = {
  nodeTemplates: (SuperTemplate & { isNew: boolean })[];
  onEdit: (tpl: SuperTemplate) => void;
  onDelete: (tpl: SuperTemplate) => void;
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
