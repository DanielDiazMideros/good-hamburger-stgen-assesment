"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";

import type { MenuItem } from "@/domain/menu/types";
import type { SubmittedOrder } from "@/domain/order/types";
import type { CartState } from "@/domain/menu/pricing";
import { calcSummary } from "@/domain/menu/pricing";
import { fetchMenu } from "@/services/menu/menu.service";

import { MenuGrid, MenuFilters, type Filter } from "@/components/menu/";
import { CartSlots, CartSummary, CustomerForm } from "@/components/cart/";
import { OrdersList } from "@/components/orders/";
import { useSessionState } from "@/utils/useSessionState";

const STORAGE = {
  cart: "gh_cart",
  orders: "gh_orders",
} as const;

const SLOT_LIMIT_ERROR: Record<keyof CartState, string> = {
  sandwich: "You can only add 1 sandwich per order.",
  fries: "You can only add 1 serving of fries per order.",
  drink: "You can only add 1 soft drink per order.",
};

function slotForItem(item: MenuItem): keyof CartState {
  if (item.category === "sandwich") return "sandwich";
  if (item.id === "fries") return "fries";
  return "drink";
}

export default function App() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [customerName, setCustomerName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [cart, setCart, clearCart] = useSessionState<CartState>(
    STORAGE.cart,
    {}
  );
  const [orders, setOrders, clearOrders] = useSessionState<SubmittedOrder[]>(
    STORAGE.orders,
    []
  );

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const data = await fetchMenu();
        setMenu(data);
      } catch {
        if (!controller.signal.aborted) setError("Couldn't load the menu.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const summary = useMemo(() => calcSummary(cart), [cart]);

  const filteredMenu = useMemo(() => {
    const filters: Record<Filter, (i: MenuItem) => boolean> = {
      all: () => true,
      sandwich: (i) => i.category === "sandwich",
      extra: (i) => i.category === "extra",
    };

    return menu.filter(filters[filter]);
  }, [menu, filter]);

  const addToCart = (item: MenuItem) => {
    setError(null);
    const slot = slotForItem(item);

    const current = cart[slot];
    if (current?.id === item.id) {
      setError(`You can't add "${item.name}" twice. Only 1 is allowed.`);
      return;
    }

    if (cart[slot]) {
      setError(SLOT_LIMIT_ERROR[slot]);
      return;
    }

    setCart((prev) => ({ ...prev, [slot]: item }));
  };

  const removeFromCart = (slot: keyof CartState) => {
    setError(null);
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[slot];
      return copy;
    });
  };

  const submitOrder = () => {
    setError(null);

    const name = customerName.trim();
    if (!name)
      return setError("Customer name is required to submit the order.");
    if (summary.items.length === 0)
      return setError("Add at least 1 item to the cart before submitting.");

    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now());

    const newOrder: SubmittedOrder = {
      id,
      customerName: name,
      createdAt: new Date().toISOString(),
      cart: { ...cart },
      subtotal: summary.subtotal,
      discountRule: summary.rule,
      discountAmount: summary.discountAmount,
      total: summary.total,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart({});
    clearCart();
    setCustomerName("");
  };

  const clearAll = () => {
    clearCart();
    clearOrders();
    setCart({});
    setOrders([]);
    setCustomerName("");
    setError(null);
  };

  return (
    <Container sx={{ py: 5 }}>
      <Stack spacing={3}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
        >
          <Typography variant="h4" sx={{ typography: { xs: "h5", md: "h4" } }}>
            🍔 Good Hamburger 🍔
          </Typography>
          <Stack spacing={1}>
            <Chip
              label={loading ? "Loading..." : "Menu ready"}
              color={loading ? "default" : "success"}
            />
            <Tooltip title="Remove all data from cart and orders" arrow>
              <IconButton color="error" onClick={clearAll}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}

        <Grid container spacing={2} alignItems="stretch">
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex" }}>
            <Card
              data-testid="menu-card"
              sx={{ width: "100%", height: "100%" }}
            >
              <CardContent sx={{ height: "100%" }}>
                <Stack spacing={2} sx={{ height: "100%" }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    gap={2}
                  >
                    <Typography variant="h6">Menu</Typography>
                    <MenuFilters value={filter} onChange={setFilter} />
                  </Stack>

                  <Divider />

                  <MenuGrid
                    loading={loading}
                    items={filteredMenu}
                    onAdd={addToCart}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex" }}>
            <Card
              data-testid="cart-card"
              sx={{ width: "100%", height: "100%" }}
            >
              <CardContent sx={{ height: "100%" }}>
                <Stack spacing={2} sx={{ height: "100%" }}>
                  <Typography variant="h6">Cart</Typography>

                  <CartSlots cart={cart} onRemoveSlot={removeFromCart} />

                  <CustomerForm
                    value={customerName}
                    onChange={setCustomerName}
                  />

                  <CartSummary
                    subtotal={summary.subtotal}
                    rule={summary.rule}
                    discountAmount={summary.discountAmount}
                    total={summary.total}
                  />

                  <Button onClick={submitOrder} disabled={loading}>
                    Submit order
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <OrdersList orders={orders} />
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}
