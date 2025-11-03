// components/Entity/EntityList.tsx
"use client";

import {
  Button,
  Stack,
  Typography,
  CircularProgress,
  Box,
  Grid,
  Alert,
} from "@mui/material";
import { useSession } from "next-auth/react";
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useModal } from "@/hooks/useModal";
import Icon from "../UI/Icon";
import { BaseEntity } from 'types/entity'
import { useEntityTemplate } from 'configs/entityConfig';
import axiosClient from "@/libs/axiosClient";
import ModalFormImageUpload from "../Modals/ModalImageUpload";
import BaseModalForm from "../Modals/BaseModalForm";
import BaseModalConfirm from "../Modals/BaseModalConfirm";
import InputText from "../UI/InputText";
import { useAutoFocus } from "@/hooks/useAutoFocus";
import EntityFilterPanel from "./EntityFilterPanel";
import EntityItemsList from "./EntityItemsList";
import { SortOption } from '@/libs/sort-utils';

interface EntityListProps {
  entityType: string;
}

const PAGE_LIMIT = 20;

const EntityList = ({ entityType }: EntityListProps) => {
  const { data: session } = useSession({ required: true });

  console.log('Render EntityList', session?.user?.id);
  console.log(session);

  console.log(entityType);

  const { showModal } = useModal();

  const [entities, setEntities] = useState<BaseEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("updatedAt_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const template = useEntityTemplate(entityType, `${session?.user.id}`);
  const autoFocusRef = useAutoFocus();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Refs для предотвращения повторных запросов
  const searchTimeoutRef = useRef<NodeJS.Timeout>(null);
  const isLoadingRef = useRef(false);
  const loadedPagesRef = useRef(new Set<number>());
  const abortControllerRef = useRef<AbortController | null>(null);
  const isInitialLoadRef = useRef(true);

  const [initialLoading, setInitialLoading] = useState(true);


  // Единая функция загрузки данных
  const fetchData = useCallback(async (page: number, reset: boolean = false) => {
    console.log('fetchData X1');
    if (!session?.user.id || isLoadingRef.current) {
      console.log('fetchData X1 IF-1');
      return;
    }

    // Отменяем предыдущий запрос
    if (abortControllerRef.current) {
      console.log('fetchData X1 IF-2');
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    // Проверяем, не загружали ли мы уже эту страницу
    if (!reset && loadedPagesRef.current.has(page)) {
      console.log('fetchData X1 IF-3');
      return;
    }

    isLoadingRef.current = true;

    if (reset) {
      console.log('fetchData X1 IF-4');
      setLoading(true);
      setError(null);
      loadedPagesRef.current.clear();
    } else {
      console.log('fetchData X1 IF-4 ELSE');
      setLoadingMore(true);
    }

    try {
      console.log('fetchData X1 TRY');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: PAGE_LIMIT.toString(),
        ...(search && { search }),
        sort: sortOption
      });

      const url = `${template.api.list}?${params}`;

      const res = await axiosClient.get(url, {
        signal: abortControllerRef.current.signal
      });

      let responseData: BaseEntity[] = [];
      let responseTotalCount = 0;
      let responseHasMore = false;

      if (res?.data?.data && Array.isArray(res.data.data)) {
        responseData = res.data.data;
        responseTotalCount = res.data.pagination?.totalCount || 0;
        responseHasMore = res.data.pagination?.hasMore || false;
      } else if (Array.isArray(res?.data)) {
        responseData = res.data;
        responseHasMore = res.data.length === PAGE_LIMIT;
        responseTotalCount = responseHasMore ? page * PAGE_LIMIT + 1 : page * PAGE_LIMIT;
      } else {
        console.warn('⚠️ Неизвестный формат ответа API:', res?.data);
        responseData = [];
      }

      const transform = template.transformData || ((data) => data);
      const items = transform(responseData || []);

      if (reset) {
        console.log('fetchData X1 TRY IF RESET');
        // Полная замена данных при сбросе
        setEntities(items);
        setTotalCount(responseTotalCount);
        setCurrentPage(page);
        loadedPagesRef.current.add(page);
      } else {
        console.log('fetchData X1 TRY IF-ELSE RESET');
        // Добавление данных для пагинации
        setEntities(prev => {
          const existingIds = new Set(prev.map(entity => entity.id));
          const newItems = items.filter(item => !existingIds.has(item.id));
          return [...prev, ...newItems];
        });
        loadedPagesRef.current.add(page);
        setCurrentPage(page);
      }

      setHasMore(responseHasMore);

    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Запрос отменен');
        return;
      }

      console.error('Ошибка загрузки:', err);
      setError('Не удалось загрузить данные');

      if (reset) {
        console.log('fetchData X1 CATCH IF RESET');
        setEntities([]);
        setCurrentPage(1);
      }
    } finally {
      console.log('fetchData X1 FINALY');
      setLoading(false);
      setLoadingMore(false);
      isLoadingRef.current = false;
      abortControllerRef.current = null;
    }
  }, [session?.user.id, template.api.list, template.transformData, search, sortOption]);

  // Первоначальная загрузка - только один раз
  useEffect(() => {
    console.log('useEffect X2');

    if (!session?.user?.id) return;
    if (!isInitialLoadRef.current) return;

    isInitialLoadRef.current = false;
    setInitialLoading(true);

    const timeout = setTimeout(async () => {
      await fetchData(1, true);
      setInitialLoading(false);
    }, 0);

    return () => clearTimeout(timeout);
  }, [session?.user?.id, fetchData]);

  // Эффект для поиска и сортировки - с дебаунсом
  useEffect(() => {
    console.log('useEffect X3');
    if (!session?.user?.id) return;
    if (isInitialLoadRef.current || initialLoading) return; // 👈 добавлено

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      console.log('useEffect X3 setTimeout');
      fetchData(1, true);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search, sortOption, session?.user?.id, fetchData, initialLoading]);


  // Cleanup при размонтировании
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        console.log('useEffect X4 RETURN IF - clearTimeout');
        clearTimeout(searchTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        console.log('useEffect X4 - abortControllerRef');
        abortControllerRef.current.abort();
      }
    };
  }, []);


  // Обновление данных вручную
  const handleRefresh = useCallback(() => {
    fetchData(1, true);
  }, [fetchData]);

  // Обработчик скролла для бесконечной загрузки
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollThreshold = 100;

    const isAtBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - scrollThreshold;

    if (isAtBottom && hasMore && !loadingMore && !loading && !isLoadingRef.current) {
      const nextPage = currentPage + 1;
      fetchData(nextPage, false);
    }
  }, [hasMore, loadingMore, loading, currentPage, fetchData]);

  // Обработчик изменения поиска
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, []);

  // Обработчик изменения сортировки
  const handleSortChange = useCallback((option: SortOption) => {
    setSortOption(option);
  }, []);

  // Остальные обработчики (create, edit, delete, imageUpload) остаются без изменений
  const handleCreate = useCallback(() => {
    if (!template.features.create || !template.api.create) return;

    showModal({
      content: (
        <BaseModalForm
          title='Создание'
          schema={template.schema}
          defaultValues={template.defaultValues}
          submitText="Создать"
          onSubmit={async (data) => {
            if (!session?.user.id) throw new Error('Нет ID пользователя');

            const requestData = { ...data, userId: session.user.id };
            if (template.customData) {
              Object.assign(requestData, template.customData);
            }

            const res = await axiosClient.post(template.api.create!, requestData);
            return Array.isArray(res?.data) ? res.data[0] : res?.data;
          }}
          onSuccess={(created) => {
            setEntities(prev => {
              const existingIds = new Set(prev.map(entity => entity.id));
              if (!existingIds.has(created.id)) {
                return [{ ...created, isNew: true }, ...prev];
              }
              return prev;
            });
            setTotalCount(prev => prev + 1);
          }}
          renderForm={(formField, disabled) => (
            <>
              <InputText
                inputRef={autoFocusRef}
                label={`Название ${template.name.toLowerCase()}`}
                placeholder="Название"
                disabled={disabled}
                {...formField('title')}
              />
              {'category' in template.defaultValues && (
                <InputText
                  label="Категория"
                  disabled={disabled}
                  {...formField('category')}
                />
              )}
              {'description' in template.defaultValues && (
                <InputText
                  label="Описание"
                  disabled={disabled}
                  multiline
                  rows={3}
                  {...formField('description')}
                />
              )}
            </>
          )}
        />
      ),
    });
  }, [session?.user.id, template, showModal, autoFocusRef]);

  const handleEdit = useCallback((entity: BaseEntity) => {
    if (!template.features.edit || !template.api.update) return;

    showModal({
      content: (
        <BaseModalForm
          title='Редактирование'
          schema={template.schema}
          defaultValues={entity}
          submitText="Обновить"
          onSubmit={async (data) => {
            if (!session?.user.id) throw new Error('Нет ID пользователя');
            const res = await axiosClient.put(`${template.api.update!}/${entity.id}`, data);
            return Array.isArray(res?.data) ? res.data[0] : res?.data;
          }}
          onSuccess={(updated) => {
            setEntities(prev =>
              prev.map(item => item.id === entity.id ? { ...item, ...updated } : item)
            );
          }}
          renderForm={(formField, disabled) => (
            <>
              <InputText
                inputRef={autoFocusRef}
                label={`Название ${template.name.toLowerCase()}`}
                placeholder="Название"
                disabled={disabled}
                {...formField('title')}
              />
              {'category' in template.defaultValues && (
                <InputText
                  label="Категория"
                  disabled={disabled}
                  {...formField('category')}
                />
              )}
              {'description' in template.defaultValues && (
                <InputText
                  label="Описание"
                  disabled={disabled}
                  multiline
                  rows={3}
                  {...formField('description')}
                />
              )}
            </>
          )}
        />
      ),
    });
  }, [session?.user.id, template, showModal, autoFocusRef]);

  const handleDelete = useCallback((id: string | number, title: string) => {
    if (!template.features.delete || !template.api.delete) return;

    showModal({
      content: (
        <BaseModalConfirm
          title='Удаление'
          message={<span>Вы точно хотите удалить: <strong>{title}</strong> ?</span>}
          confirmText="Удалить"
          onConfirm={async () => {
            if (!session?.user.id) throw new Error('Нет ID пользователя');
            const res = await axiosClient.delete(`${template.api.delete!}${id}`);
            if (!res?.data?.success) throw new Error('Удаление не удалось');
            return res?.data;
          }}
          onSuccess={() => {
            setEntities(prev => prev.filter(item => item.id !== id));
            setTotalCount(prev => prev - 1);
          }}
        />
      ),
    });
  }, [session?.user.id, template, showModal]);

  const handleImageUpload = useCallback((id: string | number) => {
    if (!template.features.imageUpload) return;

    showModal({
      content: (
        <ModalFormImageUpload
          title={`Загрузка изображения`}
          oldImage={entities.find(el => el.id == id)?.image}
          uploadUrl="/upload/img"
          folder={template.imageUploadType!}
          maxSizeMb={5}
          onSuccess={async (imageUrl: string) => {
            if (template.api.imageUpload) {
              const res = await axiosClient.post(template.api.imageUpload, {
                id,
                type: template.imageUploadType,
                imageUrl
              });
              if (res?.data?.success && res?.data?.updated) {
                setEntities(prev =>
                  prev.map(item => item.id == id ? { ...item, ...res?.data?.updated } : item)
                );
              }
            }
          }}
        />
      ),
    });
  }, [template, showModal, entities]);

  return (
    <Stack spacing={2} padding={1} sx={{ height: '100%' }}>
      <Grid
        container
        width="100%"
        gap={2}
        direction={{ xs: "column", sm: "row" }}
      >
        <Grid size="grow">
          <EntityFilterPanel
            search={search}
            onSearchChange={handleSearchChange}
            sortOption={sortOption}
            onSortOptionChange={handleSortChange}
            entityType={entityType}
          />
        </Grid>

        <Grid size="auto">
          <Stack direction="row" spacing={1}>
            <Button
              size="large"
              startIcon={<Icon icon="refresh" />}
              variant="outlined"
              onClick={handleRefresh}
              disabled={loading}
            >
              Обновить
            </Button>

            {template.features.create && (
              <Button
                size="large"
                sx={{
                  maxWidth: { xs: "100%", sm: "200px" },
                  width: { xs: "100%", sm: "100%", md: "200px" },
                }}
                startIcon={<Icon icon="add" />}
                variant="contained"
                onClick={handleCreate}
              >
                Создать
              </Button>
            )}
          </Stack>
        </Grid>
      </Grid>

      {/* Отображение ошибок */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Информация о количестве */}
      {!loading && !error && (
        <Typography variant="body2" color="text.secondary">
          Показано: {entities.length}
          {totalCount > 0 && ` из ${totalCount}`}
          {hasMore && ' (есть еще...)'}
        </Typography>
      )}

      {/* Контейнер с скроллом */}
      <Box
        ref={scrollContainerRef}
        onScroll={handleScroll}
        sx={{
          flex: 1,
          overflow: 'auto',
          minHeight: '400px',
          maxHeight: 'calc(100vh - 200px)',
        }}
      >
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexGrow={1}
            minHeight="200px"
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexGrow={1}
            minHeight="200px"
          >
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          </Box>
        ) : entities.length > 0 ? (
          <>
            <EntityItemsList
              entities={entities}
              entityType={entityType}
              onEdit={template.features.edit ? handleEdit : undefined}
              onDelete={template.features.delete ? handleDelete : undefined}
              onUploadImage={template.features.imageUpload ? handleImageUpload : undefined}
            />

            {/* Индикатор загрузки дополнительных данных */}
            {loadingMore && (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress size={24} />
                <Typography variant="body2" sx={{ ml: 2 }}>
                  Загрузка...
                </Typography>
              </Box>
            )}

            {/* Сообщение о конце списка */}
            {!hasMore && entities.length > 0 && (
              <Box display="flex" justifyContent="center" p={2}>
                <Typography variant="body2" color="text.secondary">
                  Все элементы загружены
                </Typography>
              </Box>
            )}
          </>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexGrow={1}
            minHeight="200px"
          >
            <Typography variant="body2" color="text.secondary">
              {search ? 'Нет элементов соответствующих фильтру' : `Нет ${template.namePlural.toLowerCase()}`}
            </Typography>
          </Box>
        )}
      </Box>
    </Stack>
  );
};

export default EntityList;