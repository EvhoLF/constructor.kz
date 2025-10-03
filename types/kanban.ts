// types/kanban.ts
export interface IKanbanColumn {
  id: string;
  title: string;
  color: string;
  order: number;
  style: {
    filled: boolean;
    textAlign: 'left' | 'center' | 'right';
    showHeader: boolean;
  };
}

export interface IKanbanBlock {
  id: string;
  title: string;
  description: string;
  columnId: string;
  order: number;
}

export interface IKanbanFunnelStyle {
  colored: boolean;
  filled: boolean;
  textAlign: 'left' | 'center' | 'right';
  showNumbers: boolean;
  showDescriptions: boolean;
  columnWidth: number;
  blockHeight: number;
}

export interface IKanbanFunnel {
  id: number;
  title: string;
  columns: IKanbanColumn[];
  blocks: IKanbanBlock[];
  style: IKanbanFunnelStyle;
  userId: number;
  createdAt: string;
  updatedAt: string;
}