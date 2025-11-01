// types/entityTemplates.ts
import { z } from 'zod';
import { ImageUploadType } from '@/constants/upload';
import {
    EntityApiConfig,
    EntityViewConfig,
    EntityFeatures,
    EntityLayout,
    BaseEntity,
    SortOption
} from './entity';

export interface EntityTemplate {
    // Основная информация
    name: string;
    namePlural: string;

    // API конфигурация
    api: {
        list: string | ((userId: string) => string);
        create?: string;
        update?: string;
        delete?: string;
        imageUpload?: string;
    };

    // Настройки отображения
    view: EntityViewConfig;

    // Функциональность
    features: EntityFeatures;

    // Внешний вид
    layout: EntityLayout;

    // Валидация и формы
    schema: z.ZodTypeAny;
    defaultValues: Record<string, any>;

    // Дополнительные поля
    additionalFields?: string[];
    imageUploadType?: ImageUploadType;

    // Трансформация данных
    transformData?: (data: any[]) => any[];

    // Кастомные данные для создания
    customData?: Record<string, any>;

    // Дополнительные настройки
    options?: {
        sortDefault?: string;
        searchPlaceholder?: string;
        enableBatchActions?: boolean;
        enableExport?: boolean;
    };
}

// Тип для конфигурации всех шаблонов
export type EntityTemplatesConfig = Record<string, EntityTemplate>;

// Тип для пропсов компонентов
export interface EntityListProps {
    entityType: string;
    customFilter?: React.ReactNode;
    onEntityClick?: (entity: BaseEntity) => void;
    batchActions?: React.ReactNode;
}

export interface EntityItemProps {
    entity: BaseEntity;
    entityType: string;
    onEdit?: (entity: BaseEntity) => void;
    onDelete?: (id: string | number, title: string) => void;
    onUploadImage?: (id: string | number) => void;
    onClick?: (entity: BaseEntity) => void;
}

export interface EntityFilterPanelProps {
    search: string;
    onSearchChange: (value: string) => void;
    sortOption: SortOption;
    onSortOptionChange: (option: SortOption) => void;
    entityType: string;
    customFilter?: React.ReactNode;
}