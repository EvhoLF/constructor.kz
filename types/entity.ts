// types/entity.ts
export interface BaseEntity {
  id: string | number;
  title: string;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
  isNew?: boolean;
}

// Специфичные типы для разных сущностей
export interface DiagramEntity extends BaseEntity {
  formula?: string;
}

export interface TemplateEntity extends BaseEntity {
  category?: string;
}

export interface FunnelEntity extends BaseEntity {
  blocks?: string;
  blocksCount?: number;
  description?: string;
}

export interface KanbanEntity extends BaseEntity {
  columns?: any[];
  blocks?: any[];
  style?: any;
  columnsCount?: number;
  blocksCount?: number;
  description?: string;
}

export type AnyEntity = DiagramEntity | TemplateEntity | FunnelEntity | KanbanEntity;

// Типы для конфигурации
export interface EntityApiConfig {
  list: string;
  create?: string;
  update?: string;
  delete?: string;
  imageUpload?: string;
}

export interface EntityViewConfig {
  url: (id: string | number) => string;
}

export interface EntityFeatures {
  imageUpload: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  view: boolean;
  customLayout?: boolean;
}

export type EntityLayout = 'grid' | 'list';
export type SortOption = 
  | 'title_asc' | 'title_desc' 
  | 'createdAt_asc' | 'createdAt_desc' 
  | 'updatedAt_asc' | 'updatedAt_desc';