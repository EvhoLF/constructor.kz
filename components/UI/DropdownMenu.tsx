import React, { useState } from "react";
import {
  Box,
  IconButton,
  Menu,
  TextField,
  Collapse,
  Typography,
} from "@mui/material";
import Icon from "./Icon";
import { IconName } from "@/Icons";

export interface DropdownItem {
  id: string;
  label: string;
  icon?: IconName;
  group?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface DropdownMenuProps {
  isInputText?: boolean;
  onChange: (id: string) => void;
  data?: DropdownItem[];
  children?: React.ReactNode;
  displayItem?: (item: DropdownItem) => React.ReactNode | undefined | null;
}

export default function DropdownMenu({
  // onChange,
  data = [],
  displayItem,
  children,
}: DropdownMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };
  const handleClose = () => {
    setMenuOpen(false);
    setAnchorEl(null);
  };
  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const filteredItems = data.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedItems = filteredItems.reduce<Record<string, DropdownItem[]>>(
    (groups, item) => {
      const group = item.group || "Прочее";
      if (!groups[group]) groups[group] = [];
      groups[group].push(item);
      return groups;
    },
    {}
  );


  const GridItem = (item: DropdownItem) => {
    const Default = (
      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
        <Icon icon={item?.icon || "default"} />
        <Typography fontSize="0.75rem" align="center">{item.label}</Typography>
      </Box>
    )
    return displayItem ? displayItem(item) || Default : Default
  };

  return (
    <>
      <IconButton onClick={handleOpen} color="primary" sx={{ background: menuOpen ? "#de216320" : "" }}>
        {children}
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{ sx: { width: 360, maxHeight: 500, overflow: "visible", p: 1 } }}
      >
        <Box sx={{ p: 1 }}>
          <TextField
            label="Поиск"
            variant="outlined"
            size="small"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>

        {filteredItems.length === 0 ? (
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Ничего не найдено
            </Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
            {Object.entries(groupedItems).map(([group, items]) => {
              const isOpen = expandedGroups[group] ?? false;

              return (
                <Box key={group}>
                  <Box
                    onClick={() => toggleGroup(group)}
                    sx={{
                      px: 2,
                      py: 1,
                      cursor: "pointer",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {group}
                    <Icon icon={isOpen ? "arrowUpS" : "arrowDownS"} />
                  </Box>

                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(50px, 1fr))",
                        gap: .5,
                        p: 1,
                      }}
                    >
                      {items.map((item) => <GridItem key={item.id} {...item} />)}
                    </Box>
                  </Collapse>
                </Box>
              );
            })}
          </Box>
        )}
      </Menu>
    </>
  );
}
