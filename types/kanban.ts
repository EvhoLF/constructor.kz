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

export interface IKanbanStyle {
  colored: boolean;
  filled: boolean;
  textAlign: 'left' | 'center' | 'right';
  showNumbers: boolean;
  showDescriptions: boolean;
  columnWidth: number;
  blockHeight: number;
}

export interface IKanban {
  id: number;
  title: string;
  columns: IKanbanColumn[];
  blocks: IKanbanBlock[];
  style: IKanbanStyle;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface KanbanCard {
  id: string;
  title: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
  color: string;
}