export function lineTotal(price: string | number, quantity: number): number {
  return Math.round(Number(price) * quantity * 100) / 100;
}

export function cartTotal(items: { price: string | number; quantity: number }[]): number {
  return Math.round(items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0) * 100) / 100;
}

// Czech style: ASCII space thousands separator, no decimals (matches PHP number_format(x,0,',',' ')).
// Manual grouping (not toLocaleString — that emits a narrow no-break space and is locale-fragile).
export function formatCzk(value: string | number): string {
  const n = Math.round(Number(value));
  const grouped = Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${n < 0 ? "-" : ""}${grouped} Kč`;
}
