import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import type { CartState } from "@/domain/menu/pricing";
import { formatMoney } from "@/utils/format";

function Slot({
  title,
  value,
  onRemove,
}: {
  title: string;
  value?: { name: string; price: number };
  onRemove?: () => void;
}) {
  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        <Typography fontWeight={700}>{title}</Typography>
        {value && onRemove ? (
          <Button size="small" variant="text" onClick={onRemove}>
            Remove
          </Button>
        ) : null}
      </Stack>
      <Typography color="text.secondary">
        {value ? `${value.name} (${formatMoney(value.price)})` : "-"}
      </Typography>
    </>
  );
}

export function CartSlots({
  cart,
  onRemoveSlot,
}: {
  cart: CartState;
  onRemoveSlot: (slot: keyof CartState) => void;
}) {
  return (
    <Box className="rounded-2xl border border-border bg-surface p-3">
      <Stack spacing={1.25}>
        <Slot
          title="Sandwich"
          value={cart.sandwich}
          onRemove={cart.sandwich ? () => onRemoveSlot("sandwich") : undefined}
        />

        <Divider />

        <Slot
          title="Fries"
          value={cart.fries}
          onRemove={cart.fries ? () => onRemoveSlot("fries") : undefined}
        />

        <Divider />

        <Slot
          title="Soft drink"
          value={cart.drink}
          onRemove={cart.drink ? () => onRemoveSlot("drink") : undefined}
        />
      </Stack>
    </Box>
  );
}
