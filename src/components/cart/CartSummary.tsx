import { Divider, Stack, Typography } from "@mui/material";
import type { DiscountRule } from "@/domain/menu/pricing";
import { formatMoney } from "@/utils/format";

const RULE_LABEL: Record<DiscountRule, string> = {
  none: "No discount",
  combo_20: "Combo (Sandwich + Fries + Soft drink) (-20%)",
  sandwich_drink_15: "Sandwich + Soft drink (-15%)",
  sandwich_fries_10: "Sandwich + Fries (-10%)",
};

const ruleLabel = (rule: DiscountRule) => RULE_LABEL[rule] ?? "No discount";

export function CartSummary({
  subtotal,
  rule,
  discountAmount,
  total,
}: {
  subtotal: number;
  rule: DiscountRule;
  discountAmount: number;
  total: number;
}) {
  return (
    <>
      <Divider />
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between">
          <Typography color="text.secondary">Subtotal</Typography>
          <Typography fontWeight={700}>{formatMoney(subtotal)}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography color="text.secondary">{ruleLabel(rule)}</Typography>
          <Typography fontWeight={700}>
            -{formatMoney(discountAmount)}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography fontWeight={700}>Total</Typography>
          <Typography fontWeight={700}>{formatMoney(total)}</Typography>
        </Stack>
      </Stack>
    </>
  );
}
