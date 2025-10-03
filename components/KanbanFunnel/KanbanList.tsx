import { Divider, Stack } from '@mui/material';
import React, { Fragment } from 'react';
import KanbanListItem from './KanbanListItem';
import { IKanbanFunnel } from '@/types/kanban';

type KanbanListProps = {
  kanbans: (IKanbanFunnel & { isNew: boolean })[];
  onEdit: (id: string | number, title: string) => () => void;
  onDelete: (id: string | number, title: string) => () => void;
};

const KanbanList: React.FC<KanbanListProps> = ({ 
  kanbans, 
  onEdit = () => () => { }, 
  onDelete = () => () => { } 
}) => {
  const newKanbans = kanbans.filter(kanban => kanban.isNew);
  const oldKanbans = kanbans.filter(kanban => !kanban.isNew);

  const GetList = (kanban: IKanbanFunnel & { isNew: boolean }) => {
    const { id, title, columns, blocks, isNew } = kanban;
    
    // Убираем JSON.parse, так как данные уже объекты
    const columnsCount = Array.isArray(columns) ? columns.length : 0;
    const blocksCount = Array.isArray(blocks) ? blocks.length : 0;
    
    return { 
      id, 
      title, 
      columnsCount, 
      blocksCount, 
      isNew, 
      onEdit, 
      onDelete 
    };
  };

  return (
    <Stack gap={1}>
      {newKanbans.length > 0 && (
        <Fragment key="new-kanbans">
          {newKanbans.map(kanban => (
            <KanbanListItem key={kanban.id} {...GetList(kanban)} />
          ))}
          <Divider sx={{ my: 1 }}>Новые канбан воронки</Divider>
        </Fragment>
      )}

      {oldKanbans.map(kanban => (
        <KanbanListItem key={kanban.id} {...GetList(kanban)} />
      ))}
    </Stack>
  );
};

export default KanbanList;