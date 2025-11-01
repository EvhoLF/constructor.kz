// libs/api-utils.ts
import { SortOption, parseSortOption, isValidSortOption, getPrismaOrderBy } from './sort-utils';

export interface PaginationParams {
  page: number;
  limit: number | undefined;
  skip: number | undefined;
  take: number | undefined;
  search: string;
  sortOption: SortOption;
}

export const buildPaginationParams = (searchParams: URLSearchParams): PaginationParams => {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? Math.max(0, parseInt(limitParam, 10)) : undefined;
  const search = searchParams.get('search')?.trim() || '';
  const sortParam = searchParams.get('sort');

  // Валидация и установка сортировки по умолчанию
  const sortOption: SortOption = isValidSortOption(sortParam || '')
    ? (sortParam as SortOption)
    : 'updatedAt_desc';

  return {
    page,
    limit: limit && limit > 0 ? limit : undefined,
    skip: limit && limit > 0 ? (page - 1) * limit : undefined,
    take: limit && limit > 0 ? limit : undefined,
    search,
    sortOption
  };
};

export const buildSearchCondition = (search: string, searchField: string = 'title') => {
  if (!search || search.trim() === '') {
    return {};
  }

  return {
    [searchField]: {
      contains: search
      // mode: 'insensitive' не поддерживается для @db.Text в MySQL
    }
  };
};

export interface ApiResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    hasMore: boolean;
    sort: string;
  };
}

export const createApiResponse = <T>(
  data: T[],
  totalCount: number,
  page: number,
  limit: number | undefined,
  sortOption: SortOption
): ApiResponse<T> => {
  const actualLimit = limit || totalCount;

  return {
    data,
    pagination: {
      page,
      limit: actualLimit,
      totalCount,
      hasMore: limit ? (page * limit) < totalCount : false,
      sort: sortOption
    }
  };
};