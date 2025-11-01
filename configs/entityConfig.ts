// config/entityTemplates.ts
import { z } from 'zod';
import { ImageUploadType } from '@/constants/upload';
import { EntityTemplatesConfig } from '@/types/entityTemplates';

// Базовые схемы валидации
export const titleSchema = z.object({
  title: z.string().min(1, 'Введите название')
});

export const templateSchema = z.object({
  title: z.string().min(1, 'Введите название'),
  category: z.string().min(1, 'Введите категорию')
});

export const funnelSchema = z.object({
  title: z.string().min(1, 'Введите название'),
  description: z.string().optional()
});

export const kanbanSchema = z.object({
  title: z.string().min(1, 'Введите название'),
  description: z.string().optional()
});

// Конфигурация всех шаблонов
export const entityTemplates: EntityTemplatesConfig = {
  diagram: {
    name: 'Диаграмма',
    namePlural: 'Диаграммы',
    api: {
      list: (userId: string) => `/diagram/user/${userId}`,
      create: '/diagram',
      update: '/diagram',
      delete: '/diagram',
      imageUpload: '/imageUpdate'
    },
    view: {
      url: (id) => `/diagram/${id}`
    },
    features: {
      imageUpload: true,
      create: true,
      edit: true,
      delete: true,
      view: true
    },
    layout: 'grid',
    schema: titleSchema,
    defaultValues: { title: '' },
    additionalFields: ['formula'],
    imageUploadType: ImageUploadType.DIAGRAM,
    options: {
      sortDefault: 'updatedAt_desc',
      searchPlaceholder: 'Поиск по названию диаграмм'
    }
  },

  ontology: {
    name: 'Онтологии',
    namePlural: 'Онтологии',
    api: {
      list: (userId: string) => `/ontology/user/${userId}`,
      create: '/ontology',
      update: '/ontology',
      delete: '/ontology',
      imageUpload: '/imageUpdate'
    },
    view: {
      url: (id) => `/ontology/${id}`
    },
    features: {
      imageUpload: true,
      create: true,
      edit: true,
      delete: true,
      view: true
    },
    layout: 'grid',
    schema: titleSchema,
    defaultValues: { title: '' },
    additionalFields: ['formula'],
    imageUploadType: ImageUploadType.ONTOLOGY,
    options: {
      sortDefault: 'updatedAt_desc',
      searchPlaceholder: 'Поиск по названию онтологии'
    }
  },

  templateDiagram: {
    name: 'Шаблон диаграмм',
    namePlural: 'Шаблоны диаграмм',
    api: {
      list: '/template-diagram',
      create: '/template-diagram',
      update: '/template-diagram',
      delete: '/template-diagram',
      imageUpload: '/imageUpdate'
    },
    view: {
      url: (id) => `/admin/template-diagram/${id}`
    },
    features: {
      imageUpload: true,
      create: true,
      edit: true,
      delete: true,
      view: true
    },
    layout: 'grid',
    schema: templateSchema,
    defaultValues: { title: '', category: '' },
    additionalFields: ['category'],
    imageUploadType: ImageUploadType.TEMPLATE_DIAGRAM,
    options: {
      sortDefault: 'title_asc',
      searchPlaceholder: 'Поиск по названию шаблонов'
    }
  },
  templateOntology: {
    name: 'Шаблон онтологий',
    namePlural: 'Шаблоны онтологий',
    api: {
      list: '/template-ontology',
      create: '/template-ontology',
      update: '/template-ontology',
      delete: '/template-ontology',
      imageUpload: '/imageUpdate'
    },
    view: {
      url: (id) => `/admin/template-ontology/${id}`
    },
    features: {
      imageUpload: true,
      create: true,
      edit: true,
      delete: true,
      view: true
    },
    layout: 'grid',
    schema: templateSchema,
    defaultValues: { title: '', category: '' },
    additionalFields: ['category'],
    imageUploadType: ImageUploadType.TEMPLATE_ONTOLOGY,
    options: {
      sortDefault: 'title_asc',
      searchPlaceholder: 'Поиск по названию шаблонов'
    }
  },

  funnel: {
    name: 'Воронка',
    namePlural: 'Воронки',
    api: {
      list: (userId: string) => `/funnel/user/${userId}`,
      create: '/funnel',
      update: '/funnel',
      delete: '/funnel',
      imageUpload: '/imageUpdate'
    },
    view: {
      url: (id) => `/funnel/${id}`
    },
    features: {
      imageUpload: true, // Включена загрузка картинок
      create: true,
      edit: true,
      delete: true,
      view: true
    },
    layout: 'grid', // Изменено на grid для отображения картинок
    schema: funnelSchema,
    defaultValues: { title: '', description: '' },
    additionalFields: ['blocksCount', 'description'],
    imageUploadType: ImageUploadType.FUNNEL, // Добавлен тип для загрузки изображений
    transformData: (data: any[]) => {
      return data.map(funnel => ({
        ...funnel,
        blocksCount: funnel.blocks ? JSON.parse(funnel.blocks)?.length : 0
      }));
    },
    customData: {
      defaultBlocks: [
        { id: 'default-1', order: 1, title: 'Шаг 1', description: 'Описание', color: '#2196f3' },
        { id: 'default-2', order: 2, title: 'Шаг 2', description: 'Описание', color: '#4caf50' },
      ]
    },
    options: {
      sortDefault: 'createdAt_desc',
      searchPlaceholder: 'Поиск по названию воронок'
    }
  },

  kanban: {
    name: 'Канбан доска',
    namePlural: 'Канбан доски',
    api: {
      list: (userId: string) => `/kanban/user/${userId}`,
      create: '/kanban',
      update: '/kanban',
      delete: '/kanban',
      imageUpload: '/imageUpdate'
    },
    view: {
      url: (id) => `/kanban/${id}`
    },
    features: {
      imageUpload: true, // Включена загрузка картинок
      create: true,
      edit: true,
      delete: true,
      view: true
    },
    layout: 'grid', // Изменено на grid для отображения картинок
    schema: kanbanSchema,
    defaultValues: { title: '', description: '' },
    additionalFields: ['columnsCount', 'blocksCount', 'description'],
    imageUploadType: ImageUploadType.KANBAN, // Добавлен тип для загрузки изображений
    transformData: (data: any[]) => {
      return data.map(kanban => ({
        ...kanban,
        columns: kanban.columns ? JSON.parse(kanban.columns) : [],
        blocks: kanban.blocks ? JSON.parse(kanban.blocks) : [],
        style: kanban.style ? JSON.parse(kanban.style) : {},
        columnsCount: kanban.columns ? JSON.parse(kanban.columns)?.length : 0,
        blocksCount: kanban.blocks ? JSON.parse(kanban.blocks)?.length : 0
      }));
    },
    customData: {
      defaultColumns: [
        { id: 'todo', title: 'To Do', order: 1 },
        { id: 'in-progress', title: 'In Progress', order: 2 },
        { id: 'done', title: 'Done', order: 3 }
      ]
    },
    options: {
      sortDefault: 'updatedAt_desc',
      searchPlaceholder: 'Поиск по названию канбан досок'
    }
  }
};

// Хук для использования шаблонов
export const useEntityTemplate = (entityType: string, userId?: string) => {
  const template = entityTemplates[entityType];

  if (!template) {
    throw new Error(`Шаблон для типа "${entityType}" не найден`);
  }

  // Разрешаем URL API
  const resolvedApi = Object.fromEntries(
    Object.entries(template.api).map(([key, value]) => [
      key,
      typeof value === 'function' ? value(userId || '') : value
    ])
  );

  return {
    ...template,
    api: resolvedApi
  };
};