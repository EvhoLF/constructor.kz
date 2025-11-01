// components/HeaderMenuSmall.tsx
"use client";

import { Box, Stack } from "@mui/material";
import { useSession } from "next-auth/react";
import LinkButtonIcon from "../UI/LinkButtonIcon";
import Line from "../UI/Line";
import ThemeToggleButton from "./ThemeToggleButton";
import { getMenuItems } from "@/constants/pages";
import { HeaderMenuItem } from "@/types/pages";

export default function HeaderMenuSmall() {
  const { data: session } = useSession();

  const isAdmin =
    session?.user?.role !== undefined &&
    (session?.user?.role as string) === "admin";

  const menuItems = getMenuItems(isAdmin);

  const renderMenuItems = (items: HeaderMenuItem[]) => {
    const renderedItems = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.isDivider) {
        renderedItems.push(
          <Line key={item.id} paddingY={1} />
        );
      } else {
        renderedItems.push(
          <LinkButtonIcon
            key={item.id}
            tooltip={item.label}
            placement="right"
            icon={item.icon}
            href={item.href}
          />
        );
      }
    }

    return renderedItems;
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {renderMenuItems(menuItems)}
      <Box mt='auto'>
        <ThemeToggleButton rounded />
      </Box>
    </Box>
  );
}