// libs/sort-utils.ts
import { Prisma } from '@prisma/client';

// Типы для сортировки
export type SortField = 'title' | 'createdAt' | 'updatedAt' | 'id';
export type SortOrder = 'asc' | 'desc';
export type SortOption = `${SortField}_${SortOrder}`;

// Интерфейс для конфигурации сортировки
export interface SortConfig {
  field: SortField;
  order: SortOrder;
  prismaOrderBy: any;
}

// Доступные варианты сортировки для разных сущностей
export const SORT_OPTIONS = {
  // Основные сортировки для всех сущностей
  COMMON: [
    { value: 'title_asc', label: 'По названию (А-Я)', field: 'title', order: 'asc' },
    { value: 'title_desc', label: 'По названию (Я-А)', field: 'title', order: 'desc' },
    { value: 'createdAt_desc', label: 'Сначала новые', field: 'createdAt', order: 'desc' },
    { value: 'createdAt_asc', label: 'Сначала старые', field: 'createdAt', order: 'asc' },
    { value: 'updatedAt_desc', label: 'Недавно обновлённые', field: 'updatedAt', order: 'desc' },
    { value: 'updatedAt_asc', label: 'Давно обновлённые', field: 'updatedAt', order: 'asc' },
  ],
  
  // Дополнительные сортировки если нужны
  WITH_ID: [
    { value: 'id_desc', label: 'По ID (новые сначала)', field: 'id', order: 'desc' },
    { value: 'id_asc', label: 'По ID (старые сначала)', field: 'id', order: 'asc' },
  ]
} as const;

// Функция для преобразования строки сортировки в Prisma orderBy
export function parseSortOption(sortOption: SortOption): SortConfig {
  const [field, order] = sortOption.split('_') as [SortField, SortOrder];
  
  let prismaOrderBy: any;
  
  switch (field) {
    case 'title':
      prismaOrderBy = { title: order };
      break;
    case 'createdAt':
      prismaOrderBy = { createdAt: order };
      break;
    case 'updatedAt':
      prismaOrderBy = { updatedAt: order };
      break;
    case 'id':
      prismaOrderBy = { id: order };
      break;
    default:
      prismaOrderBy = { id: 'desc' };
  }
  
  return {
    field,
    order,
    prismaOrderBy
  };
}

// Функция для получения orderBy для Prisma
export function getPrismaOrderBy(sortOption: SortOption | string) {
  return parseSortOption(sortOption as SortOption).prismaOrderBy;
}

// Валидация sort параметра
export function isValidSortOption(option: string): option is SortOption {
  const validOptions = [
    'title_asc', 'title_desc',
    'createdAt_asc', 'createdAt_desc', 
    'updatedAt_asc', 'updatedAt_desc',
    'id_asc', 'id_desc'
  ];
  return validOptions.includes(option);
}