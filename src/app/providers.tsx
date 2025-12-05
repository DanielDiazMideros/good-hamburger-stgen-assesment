"use client";

import * as React from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { buildTheme } from "@/styles/theme";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState(() => buildTheme({ useDom: false }));
  React.useEffect(() => {
    setTheme(buildTheme({ useDom: true }));
  }, []);

  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
