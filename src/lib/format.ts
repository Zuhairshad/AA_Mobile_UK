const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
})

/** £1,199.00 — always two decimals, matching how UK retail prices are shown. */
export function formatPrice(pence: number): string {
  return gbp.format(pence)
}

const compact = new Intl.NumberFormat("en-GB")

export function formatCount(n: number): string {
  return compact.format(n)
}
