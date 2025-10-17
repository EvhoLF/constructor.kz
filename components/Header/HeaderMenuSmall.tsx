"use client";

import { Box, Stack } from "@mui/material";
import { useSession } from "next-auth/react";
import { HeaderMenu, HeaderMenuAdmin, HeaderMenuItem } from "@/constants/pages";
import LinkButtonIcon from "../UI/LinkButtonIcon";
import Line from "../UI/Line";
import ThemeToggleButton from "./ThemeToggleButton";

export default function HeaderMenuSmall() {
  const { data: session } = useSession();

  const isAdmin =
    session?.user?.role !== undefined &&
    (session?.user?.role as string) === "admin";
  const getItems = (items: HeaderMenuItem[]) =>
    items.map(({ id, label, ...props }) => (
      <LinkButtonIcon key={id} tooltip={label} placement="right" {...props} />
    ));

  return (
    <Box
      alignItems=""
      sx={{
        height: "100%",
        width: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        // padding: '5px',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {getItems(HeaderMenu)}
      {isAdmin && <Line paddingY={1} />}
      {isAdmin && getItems(HeaderMenuAdmin)}
      <Box mt='auto'>
        <ThemeToggleButton rounded />
      </Box>
    </Box>
    // </Frame>
  );
}
