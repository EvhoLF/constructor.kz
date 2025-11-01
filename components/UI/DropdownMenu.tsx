// components/UI/DropdownMenu.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  IconButton,
  Menu,
  TextField,
  Collapse,
  Typography,
  Button,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import Icon from "./Icon";
import { IconName } from "@/Icons";

export interface DropdownItem {
  id: string;
  label: string;
  icon?: IconName;
  group?: string;
  type?: string;
  props?: any;
  [key: string]: any;
}

interface DropdownMenuProps {
  isInputText?: boolean;
  onChange?: (id: string) => void;
  children?: React.ReactNode;
  columns?: number | string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  data?: DropdownItem[];
  displayItem?: (item: DropdownItem) => React.ReactNode;
  hasMore?: boolean;
  loading?: boolean;
  onLoadMore?: () => void;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  emptyState?: React.ReactNode;
  sx?: any;
  hideNonMatchingItems?: boolean;
}

export default function DropdownMenu({
  onChange,
  data = [],
  displayItem,
  children,
  columns = 3,
  header,
  footer,
  hasMore = false,
  loading = false,
  onLoadMore,
  onScroll,
  emptyState,
  hideNonMatchingItems = false,
  sx = {},
}: DropdownMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
    setSearchQuery("");
  };

  const handleClose = () => {
    setMenuOpen(false);
    setAnchorEl(null);
    setSearchQuery("");
  };

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  // Фильтрация: скрываем категории, которые не подходят под поиск
  const filteredGroupedItems = React.useMemo(() => {
    if (!searchQuery.trim()) {
      // Без поиска - показываем все данные
      return data.reduce<Record<string, DropdownItem[]>>((groups, item) => {
        const group = item.group || "Прочее";
        if (!groups[group]) groups[group] = [];
        groups[group].push(item);
        return groups;
      }, {});
    }

    const searchLower = searchQuery.toLowerCase();

    if (hideNonMatchingItems) {
      // 👇 Вариант: скрываем только несоответствующие элементы, но оставляем группы
      return data.reduce<Record<string, DropdownItem[]>>((groups, item) => {
        const group = item.group || "Прочее";
        const matches =
          (item.label?.toLowerCase().includes(searchLower)) ||
          (group.toLowerCase().includes(searchLower));
        if (matches) {
          if (!groups[group]) groups[group] = [];
          groups[group].push(item);
        }
        return groups;
      }, {});
    } else {
      // 👇 Текущее поведение: показываем только категории, совпадающие с поиском
      const relevantGroups = new Set(
        data
          .filter(item =>
            (item.group || "Прочее").toLowerCase().includes(searchLower)
          )
          .map(item => item.group || "Прочее")
      );

      return data.reduce<Record<string, DropdownItem[]>>((groups, item) => {
        const group = item.group || "Прочее";
        if (relevantGroups.has(group)) {
          if (!groups[group]) groups[group] = [];
          groups[group].push(item);
        }
        return groups;
      }, {});
    }
  }, [data, searchQuery, hideNonMatchingItems]);

  // Автоматически открываем группы при поиске
  useEffect(() => {
    const groups = Object.keys(filteredGroupedItems);
    const expandedState: Record<string, boolean> = {};

    groups.forEach(group => {
      // При поиске открываем все группы, без поиска - закрываем
      expandedState[group] = !!searchQuery;
    });

    setExpandedGroups(expandedState);
  }, [searchQuery, filteredGroupedItems]);

  const handleInternalScroll = (e: React.UIEvent<HTMLDivElement>) => {
    onScroll?.(e);

    // Auto load more when near bottom
    const target = e.currentTarget;
    if (hasMore && !loading &&
      target.scrollTop + target.clientHeight >= target.scrollHeight - 100) {
      onLoadMore?.();
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const GridItem = (item: DropdownItem) => {
    const Default = (
      <Box
        key={item.id}
        onClick={() => {
          onChange?.(item.id);
          handleClose();
        }}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0.5,
          cursor: "pointer",
          borderRadius: 1,
          p: 0.5,
          "&:hover": {
            backgroundColor: "action.hover",
            transform: "scale(1.02)",
            transition: "all 0.2s ease"
          },
        }}
      >
        <Icon icon={item.icon || "default"} />
        <Typography
          fontSize="0.75rem"
          align="center"
          noWrap
          sx={{ width: "100%" }}
        >
          {item.label}
        </Typography>
      </Box>
    );
    return displayItem ? displayItem(item) || Default : Default;
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        color="inherit"
        sx={{
          background: menuOpen ? '#77777720' : "",
        }}
      >
        {children}
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 600,
            overflow: "hidden",
            '& .MuiMenu-paper': {
              overflow: 'hidden'
            },
            ...sx
          }
        }}
        MenuListProps={{
          sx: { p: 0 }
        }}
      >
        {/* Header */}
        {header && (
          <Box sx={{ p: 1, pb: 0, borderBottom: 1, borderColor: 'divider' }}>
            {header}
          </Box>
        )}

        {/* Search Field */}
        <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
          <TextField
            size="small"
            placeholder="Поиск по категории..."
            value={searchQuery}
            onChange={handleSearchChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <Icon icon="search" fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              ),
              endAdornment: searchQuery && (
                <IconButton
                  size="small"
                  onClick={clearSearch}
                  edge="end"
                >
                  <Icon icon="close" fontSize="small" />
                </IconButton>
              ),
            }}
          />
          {searchQuery && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              Показываются категории, содержащие: "{searchQuery}"
            </Typography>
          )}
        </Box>

        {/* Content */}
        <Box
          ref={scrollContainerRef}
          onScroll={handleInternalScroll}
          sx={{
            maxHeight: 400,
            minHeight: 200,
            overflowY: "auto",
            overflowX: "hidden"
          }}
        >
          {Object.keys(filteredGroupedItems).length === 0 ? (
            emptyState || (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Icon icon='inboxUnarchive' sx={{ fontSize: 48, color: 'text.secondary', mb: 1, opacity: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  {searchQuery ? `Категории, содержащие "${searchQuery}", не найдены` : 'Нет доступных элементов'}
                </Typography>
                {searchQuery && (
                  <Button
                    size="small"
                    onClick={clearSearch}
                    sx={{ mt: 1 }}
                  >
                    Очистить поиск
                  </Button>
                )}
              </Box>
            )
          ) : (
            <Box>
              {Object.entries(filteredGroupedItems).map(([group, items]) => {
                const isOpen = expandedGroups[group] ?? false;

                return (
                  <Box key={group} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Button
                      color="inherit"
                      fullWidth
                      variant="text"
                      onClick={() => toggleGroup(group)}
                      sx={{
                        justifyContent: "space-between",
                        px: 2,
                        py: 1.5,
                        fontWeight: "medium",
                        fontSize: '0.875rem',
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        }
                      }}
                    >
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flex: 1,
                        minWidth: 0
                      }}>
                        <Typography
                          variant="subtitle2"
                          noWrap
                          sx={{
                            textAlign: "left",
                            flex: 1
                          }}
                        >
                          {group}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            ml: 1,
                            color: 'text.secondary',
                            flexShrink: 0
                          }}
                        >
                          ({items.length})
                        </Typography>
                      </Box>
                      <Icon
                        icon={isOpen ? "arrowUpS" : "arrowDownS"}
                        fontSize="small"
                        sx={{ ml: 1 }}
                      />
                    </Button>

                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: `repeat(${columns}, minmax(80px, 1fr))`,
                          gap: 1,
                          p: 1,
                          backgroundColor: 'background.default'
                        }}
                      >
                        {items.map((item) => GridItem(item))}
                      </Box>
                    </Collapse>
                  </Box>
                );
              })}

              {/* Loading indicator for infinite scroll */}
              {loading && (
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  p: 2,
                  borderTop: 1,
                  borderColor: 'divider'
                }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    Загрузка...
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* Footer */}
        {footer && (
          <Box sx={{
            borderTop: 1,
            borderColor: 'divider',
            backgroundColor: 'background.default'
          }}>
            {footer}
          </Box>
        )}
      </Menu >
    </>
  );
}