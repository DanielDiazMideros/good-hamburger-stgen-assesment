import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import type { MenuItem } from "@/domain/menu/types";
import { MenuItemCard } from "./MenuItemCard";

export function MenuGrid({
  loading,
  items,
  onAdd,
}: {
  loading: boolean;
  items: MenuItem[];
  onAdd: (item: MenuItem) => void;
}) {
  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Grid container spacing={2} sx={{ width: "100%" }}>
      {items.map((item) => (
        <Grid key={item.id} size={{ xs: 12, sm: 6 }}>
          <MenuItemCard item={item} onAdd={onAdd} />
        </Grid>
      ))}
    </Grid>
  );
}
