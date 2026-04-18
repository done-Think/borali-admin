import { createTheme } from "@mui/material/styles";

// BorAli Design System — brand palette
const green = {
    50: "#E8FBF7",
    100: "#E8FBF7",
    200: "#BDF1E9",
    300: "#8DE8D2",
    400: "#5DDEBC",
    500: "#2DD4A0",
    600: "#1DAF82",
    700: "#107A5C",
};

const blue = {
    100: "#E5F4FF",
    200: "#99D7FF",
    300: "#66C0FF",
    400: "#33A8FF",
    500: "#0090FF",
    600: "#0072CC",
    700: "#005299",
};

const neutral = {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#374151",
    700: "#1F2937",
    800: "#111827",
    900: "#0A0E1A",
};

const semantic = {
    success: "#22C55E",
    successLight: "#DCFCE7",
    warning: "#F59E0B",
    warningLight: "#FEF3C7",
    error: "#EF4444",
    errorLight: "#FEE2E2",
    info: "#3B82F6",
    infoLight: "#DBEAFE",
};

const theme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: "2.5rem",   // 40px
            fontWeight: 700,
            lineHeight: 1.21,
        },
        h2: {
            fontSize: "2rem",     // 32px
            fontWeight: 700,
            lineHeight: 1.21,
        },
        h3: {
            fontSize: "1.5rem",   // 24px
            fontWeight: 600,
            lineHeight: 1.21,
        },
        h4: {
            fontSize: "1.25rem",  // 20px
            fontWeight: 600,
            lineHeight: 1.21,
        },
        body1: {
            fontSize: "0.875rem", // 14px
            fontWeight: 400,
        },
        body2: {
            fontSize: "0.875rem",
            fontWeight: 400,
        },
        caption: {
            fontSize: "0.6875rem", // 11px
            fontWeight: 500,
        },
        button: {
            textTransform: "none",
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    "&.Mui-selected": {
                        backgroundColor: green[500],

                        "& .MuiListItemText-root .MuiTypography-root": {
                            color: neutral[900] + " !important",
                        },

                        "& .MuiListItemIcon-root": {
                            color: neutral[900],

                            "& svg": {
                                color: neutral[900],
                                fill: neutral[900],
                            },
                        },
                    },

                    "&.Mui-selected:hover": {
                        backgroundColor: green[600],
                    },

                    "&.Mui-selected .MuiTypography-root": {
                        color: neutral[900] + " !important",
                    },
                },
            },
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    color: semantic.error,
                },
            },
        },
    },
    colorSchemes: {
        light: {
            palette: {
                primary: {
                    light: green[400],
                    main: green[500],
                    dark: green[600],
                    contrastText: neutral[900],
                },
                secondary: {
                    light: blue[400],
                    main: blue[500],
                    dark: blue[600],
                    contrastText: "#FFFFFF",
                },
                background: {
                    default: neutral[100],
                    paper: "#FFFFFF",
                },
                text: {
                    primary: neutral[900],
                    secondary: neutral[500],
                    secondaryChannel: "rgba(0, 0, 0, 0.23)",
                },
                success: {
                    main: semantic.success,
                    light: semantic.successLight,
                },
                warning: {
                    main: semantic.warning,
                    light: semantic.warningLight,
                },
                error: {
                    main: semantic.error,
                    light: semantic.errorLight,
                },
                info: {
                    main: semantic.info,
                    light: semantic.infoLight,
                },
            },
        },
        dark: {
            palette: {
                primary: {
                    light: green[400],
                    main: green[500],
                    dark: green[600],
                    contrastText: neutral[900],
                },
                secondary: {
                    light: blue[400],
                    main: blue[500],
                    dark: blue[600],
                    contrastText: "#FFFFFF",
                },
                background: {
                    default: neutral[900],
                    paper: neutral[800],
                },
                text: {
                    primary: "#FFFFFF",
                    secondary: neutral[400],
                    secondaryChannel: "rgba(255, 255, 255, 0.23)",
                },
                success: {
                    main: semantic.success,
                    light: semantic.successLight,
                },
                warning: {
                    main: semantic.warning,
                    light: semantic.warningLight,
                },
                error: {
                    main: semantic.error,
                    light: semantic.errorLight,
                },
                info: {
                    main: semantic.info,
                    light: semantic.infoLight,
                },
            },
        },
    },
    defaultColorScheme: "light",
});

export default theme;
