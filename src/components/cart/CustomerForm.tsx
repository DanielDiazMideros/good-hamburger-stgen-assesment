import { TextField } from "@mui/material";

export function CustomerForm({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <TextField
      label="Customer name"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
