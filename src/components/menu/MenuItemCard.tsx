import {
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import type { MenuItem } from "@/domain/menu/types";

export function MenuItemCard({
  item,
  onAdd,
}: {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}) {
  return (
    <Card className="shadow-e1">
      <CardContent>
        <Stack spacing={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontWeight={800}>{item.name}</Typography>
            <Chip size="small" label={item.category} />
          </Stack>

          <Typography color="text.secondary">
            {`$ ${item.price.toFixed(2).replace(".", ",")}`}
          </Typography>

          <Button data-testid={`add-${item.id}`} onClick={() => onAdd(item)}>Add to cart</Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
