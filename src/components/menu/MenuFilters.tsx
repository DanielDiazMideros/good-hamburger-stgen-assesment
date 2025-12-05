import { ToggleButton, ToggleButtonGroup } from "@mui/material";

export type Filter = "all" | "sandwich" | "extra";

export function MenuFilters({
  value,
  onChange,
}: {
  value: Filter;
  onChange: (v: Filter) => void;
}) {
  return (
    <ToggleButtonGroup
      size="small"
      value={value}
      exclusive
      onChange={(_, v) => v && onChange(v)}
    >
      <ToggleButton value="all">All</ToggleButton>
      <ToggleButton value="sandwich">Sandwiches</ToggleButton>
      <ToggleButton value="extra">Extras</ToggleButton>
    </ToggleButtonGroup>
  );
}
