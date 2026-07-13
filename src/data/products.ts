export type Category =
  | "Apple"
  | "Samsung"
  | "Google"
  | "Other Android"
  | "Accessories"

export type Product = {
  id: string
  name: string
  brand: string
  category: Category
  price: number
  staffPick?: boolean
}

export const categories: Category[] = [
  "Apple",
  "Samsung",
  "Google",
  "Other Android",
  "Accessories",
]

export const products: Product[] = [
  {
    id: "iphone-15-pro-max",
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    category: "Apple",
    price: 1199,
    staffPick: true,
  },
  {
    id: "iphone-15",
    name: "iPhone 15",
    brand: "Apple",
    category: "Apple",
    price: 799,
  },
  {
    id: "iphone-se",
    name: "iPhone SE (3rd gen)",
    brand: "Apple",
    category: "Apple",
    price: 429,
  },
  {
    id: "ipad-mini",
    name: "iPad Mini",
    brand: "Apple",
    category: "Apple",
    price: 499,
  },
  {
    id: "galaxy-s24-ultra",
    name: "Galaxy S24 Ultra",
    brand: "Samsung",
    category: "Samsung",
    price: 1249,
    staffPick: true,
  },
  {
    id: "galaxy-s24",
    name: "Galaxy S24",
    brand: "Samsung",
    category: "Samsung",
    price: 799,
  },
  {
    id: "galaxy-z-flip-5",
    name: "Galaxy Z Flip 5",
    brand: "Samsung",
    category: "Samsung",
    price: 999,
    staffPick: true,
  },
  {
    id: "galaxy-a55",
    name: "Galaxy A55",
    brand: "Samsung",
    category: "Samsung",
    price: 439,
  },
  {
    id: "galaxy-tab-s9",
    name: "Galaxy Tab S9",
    brand: "Samsung",
    category: "Samsung",
    price: 699,
  },
  {
    id: "pixel-8-pro",
    name: "Pixel 8 Pro",
    brand: "Google",
    category: "Google",
    price: 999,
    staffPick: true,
  },
  {
    id: "pixel-8",
    name: "Pixel 8",
    brand: "Google",
    category: "Google",
    price: 699,
  },
  {
    id: "pixel-8a",
    name: "Pixel 8a",
    brand: "Google",
    category: "Google",
    price: 499,
  },
  {
    id: "oneplus-12",
    name: "OnePlus 12",
    brand: "OnePlus",
    category: "Other Android",
    price: 849,
    staffPick: true,
  },
  {
    id: "xiaomi-14",
    name: "Xiaomi 14",
    brand: "Xiaomi",
    category: "Other Android",
    price: 799,
  },
  {
    id: "nothing-phone-2",
    name: "Nothing Phone (2)",
    brand: "Nothing",
    category: "Other Android",
    price: 579,
  },
  {
    id: "motorola-edge-50",
    name: "Motorola Edge 50",
    brand: "Motorola",
    category: "Other Android",
    price: 449,
  },
  {
    id: "magsafe-charger",
    name: "MagSafe Charger",
    brand: "Apple",
    category: "Accessories",
    price: 39,
  },
  {
    id: "25w-fast-charger",
    name: "25W USB-C Fast Charger",
    brand: "Samsung",
    category: "Accessories",
    price: 25,
  },
  {
    id: "clear-case-15",
    name: "Clear Case for iPhone 15",
    brand: "AA Mobile",
    category: "Accessories",
    price: 19,
  },
  {
    id: "screen-protector",
    name: "Tempered Glass Screen Protector",
    brand: "AA Mobile",
    category: "Accessories",
    price: 12,
    staffPick: true,
  },
  {
    id: "wireless-earbuds-pro",
    name: "Wireless Earbuds Pro",
    brand: "AA Mobile",
    category: "Accessories",
    price: 89,
  },
  {
    id: "power-bank-20000",
    name: "20,000mAh Power Bank",
    brand: "Anker",
    category: "Accessories",
    price: 45,
  },
]
