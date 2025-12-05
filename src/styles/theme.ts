import { createTheme, responsiveFontSizes } from "@mui/material/styles";

type ThemeOptions = { useDom?: boolean };

function readCssRgbVar(
  name: string,
  fallback: string,
  useDom: boolean
): string {
  if (!useDom) return fallback;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v || fallback;
}

function readCssVar(name: string, fallback: string, useDom: boolean): string {
  if (!useDom) return fallback;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v || fallback;
}

function rgb(v: string) {
  return `rgb(${v})`;
}
function rgba(v: string, a: number) {
  return `rgb(${v} / ${a})`;
}

export function buildTheme(options: ThemeOptions = {}) {
  const useDom = options.useDom ?? false;

  const BG = readCssRgbVar("--bg", "248 250 252", useDom);
  const SURFACE = readCssRgbVar("--surface", "255 255 255", useDom);
  const SURFACE2 = readCssRgbVar("--surface-2", "241 245 249", useDom);
  const TEXT = readCssRgbVar("--text", "15 23 42", useDom);
  const MUTED = readCssRgbVar("--muted", "71 85 105", useDom);
  const BORDER = readCssRgbVar("--border", "226 232 240", useDom);

  const BRAND = readCssRgbVar("--brand", "245 158 11", useDom);
  const BRAND600 = readCssRgbVar("--brand-600", "217 119 6", useDom);
  const ACCENT = readCssRgbVar("--accent", "239 68 68", useDom);

  const SUCCESS = readCssRgbVar("--success", "22 163 74", useDom);
  const WARNING = readCssRgbVar("--warning", "234 179 8", useDom);
  const ERROR = readCssRgbVar("--error", "220 38 38", useDom);
  const INFO = readCssRgbVar("--info", "37 99 235", useDom);

  const RADIUS_MD = readCssVar("--radius-md", "16px", useDom);
  const FONT_SANS = readCssVar(
    "--font-sans",
    "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
    useDom
  );

  const isDark = useDom && document.documentElement.classList.contains("dark");

  let theme = createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
      background: { default: rgb(BG), paper: rgb(SURFACE) },
      text: { primary: rgb(TEXT), secondary: rgb(MUTED) },
      divider: rgba(BORDER, isDark ? 0.5 : 1),

      primary: {
        main: rgb(BRAND),
        dark: rgb(BRAND600),
        contrastText: "#0b0f19",
      },
      secondary: { main: rgb(ACCENT), contrastText: "#fff" },

      success: { main: rgb(SUCCESS) },
      warning: { main: rgb(WARNING) },
      error: { main: rgb(ERROR) },
      info: { main: rgb(INFO) },

      action: {
        hover: rgba(SURFACE2, isDark ? 0.18 : 1),
        selected: rgba(BRAND, 0.12),
        focus: rgba(BRAND, 0.18),
      },
    },

    shape: {
      borderRadius: parseInt(RADIUS_MD, 10) || 16,
    },

    typography: {
      fontFamily: FONT_SANS,
      h4: { fontWeight: 800, letterSpacing: -0.3 },
      h5: { fontWeight: 800, letterSpacing: -0.2 },
      h6: { fontWeight: 750 },
      button: { textTransform: "none", fontWeight: 700 },
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: rgb(BG),
            color: rgb(TEXT),
          },
          "::selection": {
            background: rgba(BRAND, 0.25),
          },
        },
      },

      MuiContainer: { defaultProps: { maxWidth: "md" } },

      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: `1px solid ${rgba(BORDER, isDark ? 0.55 : 1)}`,
          },
        },
      },

      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            borderRadius: 20,
            border: `1px solid ${rgba(BORDER, isDark ? 0.55 : 1)}`,
            boxShadow: isDark
              ? "0 14px 40px rgb(2 6 23 / 0.55)"
              : "0 6px 20px rgb(2 6 23 / 0.10), 0 2px 6px rgb(2 6 23 / 0.06)",
          },
        },
      },

      MuiButton: {
        defaultProps: { disableElevation: true, variant: "contained" },
        styleOverrides: {
          root: { borderRadius: 14, paddingInline: 14, paddingBlock: 10 },
          containedPrimary: {
            background: rgb(BRAND),
            color: "#0b0f19",
            "&:hover": { background: rgb(BRAND600) },
          },
          outlined: {
            borderColor: rgba(BORDER, isDark ? 0.55 : 1),
            "&:hover": {
              borderColor: rgba(BRAND, 0.65),
              background: rgba(BRAND, 0.08),
            },
          },
          text: { "&:hover": { background: rgba(BRAND, 0.1) } },
        },
      },

      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            "&:hover": { background: rgba(BRAND, 0.1) },
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 999, fontWeight: 700 },
          filled: { background: rgba(BRAND, 0.16) },
        },
      },

      MuiTextField: { defaultProps: { size: "small", fullWidth: true } },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            background: rgba(SURFACE2, isDark ? 0.18 : 1),
            "& fieldset": { borderColor: rgba(BORDER, isDark ? 0.55 : 1) },
            "&:hover fieldset": { borderColor: rgba(BRAND, 0.55) },
            "&.Mui-focused fieldset": {
              borderColor: rgb(BRAND),
              borderWidth: 2,
            },
          },
        },
      },

      MuiInputLabel: {
        styleOverrides: {
          root: { color: rgb(MUTED), "&.Mui-focused": { color: rgb(BRAND) } },
        },
      },

      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: `1px solid ${rgba(BORDER, isDark ? 0.55 : 1)}`,
          },
          standardError: { backgroundColor: rgba(ERROR, 0.1) },
          standardWarning: { backgroundColor: rgba(WARNING, 0.12) },
          standardInfo: { backgroundColor: rgba(INFO, 0.1) },
          standardSuccess: { backgroundColor: rgba(SUCCESS, 0.1) },
        },
      },

      MuiTabs: {
        styleOverrides: {
          root: { minHeight: 44 },
          indicator: { height: 3, borderRadius: 999, background: rgb(BRAND) },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: { minHeight: 44, fontWeight: 800, textTransform: "none" },
        },
      },

      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            "&.Mui-selected": { backgroundColor: rgba(BRAND, 0.14) },
            "&.Mui-selected:hover": { backgroundColor: rgba(BRAND, 0.18) },
          },
        },
      },

      MuiTooltip: {
        defaultProps: { arrow: true },
        styleOverrides: {
          tooltip: {
            borderRadius: 12,
            backgroundColor: "rgb(15 23 42)",
            fontWeight: 600,
          },
        },
      },
    },
  });

  theme = responsiveFontSizes(theme);
  return theme;
}
