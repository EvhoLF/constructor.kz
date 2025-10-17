"use client";
import { Box, Tooltip, Typography } from "@mui/material";
import Icon from "../UI/Icon";
import { ThemeContext } from "@/hooks/ThemeRegistry";
import { useContext } from "react";

export default function ThemeToggleButton({
  isLabel = false,
  rounded = false,
}: {
  isLabel?: boolean;
  rounded?: boolean;
}) {
  const { mode, toggleMode } = useContext(ThemeContext);

  return (
    <Tooltip title="Тема интерфейса" placement="right">
      <Box
        onClick={toggleMode}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          padding: "8px 12px",
          borderRadius: rounded ? 9999 : 1,
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
      >
        <Icon icon={mode === "light" ? "sun" : "moon"} />
        {isLabel && (
          <Typography
            // fontFamily="Unbounded"
            // variant="h6"
            textTransform="uppercase"
          // fontWeight="700"
          >
            {mode === "light" ? "Светлая тема" : "Темная тема"}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
}
