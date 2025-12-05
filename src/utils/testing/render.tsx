import { render } from "@testing-library/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import { buildTheme } from "@/styles/theme";

export function renderWithProviders(ui: React.ReactElement) {
  const theme = buildTheme({ useDom: false });

  return render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {ui}
    </ThemeProvider>
  );
}
