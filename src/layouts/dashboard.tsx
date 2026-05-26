import { Box } from "@mui/material";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <DashboardLayout
      sidebarExpandedWidth={160}
      sx={{
        "& .MuiDrawer-paper": {
          borderRight: "1px solid",
          borderColor: "divider",
          backgroundImage: "none",
        },
        "& .MuiDrawer-paper nav": {
          pt: 1,
        },
        '& .MuiAppBar-root .MuiIconButton-root[aria-label*="navigation menu"]':
          {
            position: "relative",
            zIndex: 2,
          },
        "& .MuiList-root": {
          mb: "0 !important",
        },
        "& .MuiListItem-root": {
          px: 1,
          overflow: "visible",
        },
        "& .MuiListItemButton-root": {
          minHeight: "35px !important",
          height: "35px !important",
          borderRadius: "8px !important",
          px: "10px !important",
          overflow: "visible !important",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        "& .MuiListItemButton-root > .MuiBox-root": {
          overflow: "visible",
        },
        "& .MuiListItemButton-root:not(:has(.MuiListItemText-root))": {
          minHeight: "60px !important",
          height: "60px !important",
          px: "8px !important",
          overflow: "visible !important",
          justifyContent: "center",
          alignItems: "center",
        },
        "& .MuiListItemButton-root:not(:has(.MuiListItemText-root)) > .MuiBox-root":
          {
            overflow: "visible",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            left: "0 !important",
            top: "0 !important",
          },
        "& .MuiListItemButton-root:not(:has(.MuiListItemText-root)) .MuiListItemIcon-root":
          {
            minWidth: "0 !important",
            width: 28,
            justifyContent: "center",
          },
        "& .MuiListItemButton-root:not(:has(.MuiListItemText-root)) .MuiTypography-caption":
          {
            display: "block",
            position: "static",
            transform: "none",
            width: "100%",
            fontSize: 10,
            fontWeight: 700,
            lineHeight: 1.1,
            textAlign: "center",
            mt: 0.25,
          },
        "& .MuiListItemButton-root *": {
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        "& .MuiListItemIcon-root": {
          minWidth: "28px !important",
          overflow: "visible",
          "& svg": {
            fontSize: 20,
          },
        },
        "& .MuiBadge-root": {
          overflow: "visible",
          "& .MuiBadge-badge": {
            zIndex: 1,
          },
        },
        "& .MuiListItemText-root": {
          ml: "6px !important",
          overflow: "hidden",
        },
        "& .MuiListItemText-primary": {
          fontSize: 12,
          fontWeight: 700,
        },
        "& .MuiListItemButton-root > .MuiSvgIcon-root:last-child": {
          display: "none",
        },
        "& .MuiListItem-root > .MuiCollapse-root": {
          display: "none",
        },
        "& .MuiDrawer-paper ::-webkit-scrollbar-button": {
          display: "none",
          width: 0,
          height: 0,
        },
        "& .Mui-selected": {
          bgcolor: "secondary.main !important",
          color: "primary.contrastText !important",
          boxShadow: "inset 3px 0 0 var(--mui-palette-primary-main)",
          "& .MuiListItemIcon-root, & .MuiListItemText-primary, & svg": {
            color: "primary.contrastText !important",
          },
        },
      }}
    >
      <Box sx={{ p: { xs: 2, md: 3 }, minHeight: "100%" }}>
        <Outlet />
      </Box>
    </DashboardLayout>
  );
}
