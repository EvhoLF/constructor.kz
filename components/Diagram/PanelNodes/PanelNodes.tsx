// components/Diagram/PanelNodes/PanelNodes.tsx
'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  TextField,
  InputAdornment,
  Alert,
} from '@mui/material';
import { Edge, useReactFlow } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';

import DnD from '@/components/DnD/DnD';
import Frame from '@/components/UI/Frame';
import DropdownMenu, { DropdownItem } from '@/components/UI/DropdownMenu';
import Icon from '@/components/UI/Icon';
import IconNodes from './IconNodes';

import { init_NodePoint, NodePoint } from '../Nodes';
import { useAsync } from '@/hooks/useAsync';
import { decompress } from '@/utils/compress';
import { findRootNode } from '@/utils/Map/tree-helpers';
import { SuperTemplate } from '@/types/diagrams';
import { useDiagramType } from '@/hooks/DiagramTypeContext';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import axiosClient from '@/libs/axiosClient';

const PAGE_LIMIT = 20;

interface ApiResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    hasMore: boolean;
  };
}

const onDecompress = (data: string | null | undefined) =>
  data ? decompress(data) : [];

const PanelNodes = ({ diagramId }: { diagramId: string | number }) => {
  const { templateApi, userApi, type } = useDiagramType();
  const { userId } = useCurrentUser();

  const [activeTab, setActiveTab] = useState<'template' | 'user'>('template');
  const [nodeTemplates, setNodeTemplates] = useState<DropdownItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>(null);

  const { asyncFn } = useAsync();
  const { addNodes, screenToFlowPosition } = useReactFlow();

  // Функция создания шаблона узла
  const createNodeTemplate = useCallback((
    id: string,
    label: string,
    group: string,
    type: string,
    data: any,
    props: any = {}
  ): DropdownItem => ({
    id,
    label,
    group,
    type,
    props: { props, type, data },
  }), []);

  // Добавление нового узла
  const addNewNode = useCallback(() => {
    const newNode = init_NodePoint({
      id: uuidv4(),
      position: screenToFlowPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      }),
      data: { label: 'Узел' },
    }, type);

    addNodes(newNode);
  }, [addNodes, screenToFlowPosition]);

  // Загрузка данных
  const fetchData = useCallback(async (reset = false) => {
    if (loading) return;

    setLoading(true);
    setError(null);
    if (reset) setInitialLoading(true);

    try {
      const currentPage = reset ? 1 : page;
      const apiUrl =
        activeTab === 'template'
          ? `${templateApi}?page=${currentPage}&limit=${PAGE_LIMIT}&search=${search}`
          : `${userApi}${userApi.endsWith('/') ? '' : '/'}${userId}?excludeId=${diagramId}&page=${currentPage}&limit=${PAGE_LIMIT}&search=${search}`;

      const res = await asyncFn(() => axiosClient.get(apiUrl));

      if (!res?.data) {
        setHasMore(false);
        return;
      }

      const response: ApiResponse<SuperTemplate> = res.data;
      const templates = response.data;
      const result: DropdownItem[] = [];

      // Обработка шаблонов
      templates.forEach((template) => {
        const decompressNodes: NodePoint[] = onDecompress(template.nodes);
        const decompressEdges: Edge[] = onDecompress(template.edges);

        if (!decompressNodes.length) return;

        const rootNode = findRootNode(decompressNodes, decompressEdges);

        // Добавляем схему
        if (rootNode) {
          const scheme = createNodeTemplate(
            `scheme-${template.id}-${rootNode.id}`,
            'Диаграмма',
            template.title,
            'ADD_SCHEME',
            {
              nodes: decompressNodes,
              edges: decompressEdges,
              title: template.title,
              templateId: template.id
            }
          );
          result.push(scheme);
        }

        // Добавляем отдельные узлы
        decompressNodes.forEach((node) => {
          if (node.id !== rootNode?.id) {
            const nodeTemplate = createNodeTemplate(
              `node-${template.id}-${node.id}`,
              node.data.label || 'Узел',
              template.title,
              'ADD_NODE',
              node.data,
              {
                width: node?.measured?.width,
                height: node?.measured?.height,
                templateId: template.id
              }
            );
            result.push(nodeTemplate);
          }
        });
      });

      setNodeTemplates(prev => reset ? result : [...prev, ...result]);
      setHasMore(response.pagination.hasMore);

      if (reset) {
        setPage(1);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      setError('Ошибка при загрузке данных');
      setHasMore(false);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [activeTab, search, page, loading, templateApi, userApi, userId, diagramId, asyncFn, createNodeTemplate]);

  // Обработчик поиска с debounce
  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setSearch(value);
    }, 300);
  }, []);

  // Обработчик скролла для бесконечной загрузки
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollThreshold = 100;

    if (
      target.scrollTop + target.clientHeight >= target.scrollHeight - scrollThreshold &&
      hasMore &&
      !loading
    ) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, loading]);

  // Обработчик переключения вкладок
  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: 'template' | 'user') => {
    setActiveTab(newValue);
    setNodeTemplates([]);
    setSearchInput('');
    setSearch('');
  }, []);

  // Эффекты для загрузки данных
  useEffect(() => {
    fetchData(true);
  }, [activeTab, search]);

  useEffect(() => {
    if (page > 1) {
      fetchData();
    }
  }, [page]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Рендер элемента списка
  const displayItem = useCallback((item: DropdownItem) => {
    if (item.type === 'ADD_NODE') {
      const itemLabel = item.label || `Узел ${item.id}`;
      const nodeData = { ...item.props.data, label: itemLabel };

      return (
        <DnD key={item.id} props={item.props}>
          <Box
            sx={{
              cursor: 'grab',
              p: 1,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'action.hover',
                transform: 'translateY(-2px)',
                boxShadow: 1
              },
              '&:active': {
                cursor: 'grabbing',
                backgroundColor: 'action.selected'
              },
            }}
          >
            <Tooltip title={itemLabel} placement="top">
              <Stack gap={1} alignItems="center">
                <IconNodes {...nodeData} sx={{ width: 60, height: 40 }} />
                <Typography
                  variant="caption"
                  textAlign="center"
                  noWrap
                  sx={{
                    maxWidth: 80,
                    fontWeight: 'medium'
                  }}
                >
                  {itemLabel}
                </Typography>
              </Stack>
            </Tooltip>
          </Box>
        </DnD>
      );
    }

    if (item.type === 'ADD_SCHEME') {
      const itemLabel = item.props.data?.title || 'Диаграмма';

      return (
        <DnD key={item.id} props={item.props}>
          <Box
            sx={{
              cursor: 'grab',
              p: 1,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'primary.light',
              backgroundColor: 'primary.lightest',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'action.hover',
                transform: 'translateY(-2px)',
                boxShadow: 1
              },
              '&:active': {
                cursor: 'grabbing',
                backgroundColor: 'action.selected',
                color: 'action.contrastText'
              },
            }}
          >
            <Tooltip title={`Диаграмма`} placement="top">
              <Stack gap={1} alignItems="center">
                <IconNodes
                  label=''
                  isIconVisible
                  icon="layout_tree"
                  sx={{
                    width: 60,
                    height: 40,
                    color: 'inherit',
                    '& .MuiSvgIcon-root': {
                      fontSize: 24
                    }
                  }}
                />
                <Typography
                  variant="caption"
                  textAlign="center"
                  noWrap
                  sx={{
                    maxWidth: 80,
                    fontWeight: 'bold',
                    color: 'inherit'
                  }}
                >
                  Диаграмма
                </Typography>
              </Stack>
            </Tooltip>
          </Box>
        </DnD>
      );
    }

    return null;
  }, []);

  // Кастомный хедер для DropdownMenu с поиском
  const dropdownHeader = (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label="switch api tabs"
        variant="fullWidth"
        sx={{ mb: 0 }}
      >
        <Tab value="template" label="Шаблоны" />
        <Tab value="user" label="Мои диаграммы" />
      </Tabs>

      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
    </Box>
  );

  const dropdownFooter = (
    <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        {loading ? (
          <Box display="flex" alignItems="center" gap={1}>
            <CircularProgress size={16} />
            <Typography variant="caption">Загрузка...</Typography>
          </Box>
        ) : (
          <Typography variant="caption" color="text.secondary">
            {nodeTemplates.length} элементов
          </Typography>
        )}

        <Button
          size="small"
          onClick={() => fetchData(true)}
          disabled={loading}
          startIcon={<Icon icon="refresh" />}
        >
          Обновить
        </Button>
      </Stack>
    </Box>
  );

  // Empty state
  const renderEmptyState = () => (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Icon icon='inboxArchive' sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
      <Typography variant="body2" color="text.secondary">
        {search ? 'Ничего не найдено' : 'Нет доступных элементов'}
      </Typography>
      {search && (
        <Button
          size="small"
          onClick={() => handleSearchChange('')}
          sx={{ mt: 1 }}
        >
          Очистить поиск
        </Button>
      )}
    </Box>
  );

  return (
    <Frame sx={{ width: 'fit-content', p: 1, maxWidth: 400 }}>
      <Stack direction="column" spacing={1}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Tooltip title="Добавить из шаблона или существующей диаграммы">
            <DropdownMenu
              data={nodeTemplates}
              displayItem={displayItem}
              hasMore={hasMore}
              loading={loading}
              onLoadMore={() => setPage(prev => prev + 1)}
              onScroll={handleScroll}
              header={dropdownHeader}
              footer={dropdownFooter}
              columns={3}
              emptyState={renderEmptyState()}
              sx={{
                maxHeight: 500,
                minWidth: 350,
              }}
            >
              <Icon icon='layout_tree' />
            </DropdownMenu>
          </Tooltip>

          <Tooltip title="Создать новый узел">
            <DnD props={{
              type: 'ADD_NODE',
              data: {
                label: 'Узел',
                type: 'default'
              }
            }}>
              <IconButton
                color="inherit"
                onClick={addNewNode}
              >
                <Icon icon="add" />
              </IconButton>
            </DnD>
          </Tooltip>
        </Stack>
      </Stack>
    </Frame>
  );
};

export default PanelNodes;