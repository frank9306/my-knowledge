export function allocateDiscount(lines, discountCents) {
  const subtotals = lines.map((line) => line.priceCents * line.quantity);
  const orderSubtotal = subtotals.reduce((sum, value) => sum + value, 0);

  return subtotals.map((subtotal) =>
    Math.floor((discountCents * subtotal) / orderSubtotal),
  );
}
