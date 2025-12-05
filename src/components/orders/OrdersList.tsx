import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import type { SubmittedOrder } from "@/domain/order/types";
import { formatMoney } from "@/utils/format";

export function OrdersList({ orders }: { orders: SubmittedOrder[] }) {
  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">Submitted orders</Typography>

          {orders.length === 0 ? (
            <Typography color="text.secondary">No orders yet.</Typography>
          ) : (
            <Stack spacing={1.5}>
              {orders.map((o) => (
                <Box
                  key={o.id}
                  data-testid={`order-${o.id}`}
                  className="rounded-2xl border border-border bg-surface p-3"
                >
                  <Stack spacing={0.75}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography fontWeight={900}>{o.customerName}</Typography>
                      <Chip
                        size="small"
                        label={formatMoney(o.total)}
                        color="primary"
                      />
                    </Stack>

                    <Typography color="text.secondary" fontSize={13}>
                      {new Date(o.createdAt).toLocaleString()}
                    </Typography>

                    <Typography color="text.secondary" fontSize={13}>
                      {o.cart.sandwich?.name ?? "—"} /{" "}
                      {o.cart.fries?.name ?? "—"} / {o.cart.drink?.name ?? "—"}
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
