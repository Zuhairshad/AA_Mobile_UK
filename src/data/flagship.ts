import { products } from "./products"

export const flagship = products.find((p) => p.id === "iphone-15-pro-max")!

export const flagshipColors = [
  { name: "Black Titanium", hex: "#39393b" },
  { name: "White Titanium", hex: "#e5e3da" },
  { name: "Blue Titanium", hex: "#3f4a5c" },
  { name: "Natural Titanium", hex: "#8d8776" },
]

export const flagshipSpecs = [
  { feature: "Display", spec: "6.7\" Super Retina, 120Hz adaptive refresh" },
  { feature: "Chip", spec: "3nm, 6-core CPU, 5-core GPU" },
  { feature: "Camera system", spec: "48MP main + 12MP ultra-wide + 12MP telephoto" },
  { feature: "Battery life", spec: "Up to 29 hours video playback" },
  { feature: "Charging", spec: "USB-C, MagSafe & Qi2 wireless" },
  { feature: "Connectivity", spec: "5G, Wi-Fi 6E, Bluetooth 5.3" },
  { feature: "Storage", spec: "256GB, 512GB, 1TB" },
  { feature: "Weight", spec: "221g" },
]

export const testimonials = [
  { quote: "Traded in my old phone and had the new one the next day.", name: "Priya S.", handle: "@priyaupgrades" },
  { quote: "Best price I found anywhere in the UK, no contract nonsense.", name: "Tom H.", handle: "@tom_h" },
  { quote: "The trade-in quote matched exactly what I got paid.", name: "Aisha K.", handle: "@aishak" },
  { quote: "Support actually picked up the phone. Wild.", name: "Daniel R.", handle: "@danr" },
  { quote: "Refurbished phone looked brand new out of the box.", name: "Megan L.", handle: "@meganl" },
  { quote: "Free next-day delivery actually arrived next day.", name: "Chris B.", handle: "@chrisb" },
]

export const faqs = [
  {
    q: "How fast is delivery?",
    a: "Free next-day delivery on every in-stock phone when you order before 8pm.",
  },
  {
    q: "Can I trade in my old phone?",
    a: "Yes — get an instant estimate on the Sell page and we'll deduct it from your order total.",
  },
  {
    q: "Are refurbished phones covered by warranty?",
    a: "Every refurbished phone passes a 40-point check and ships with a 12-month warranty.",
  },
  {
    q: "What if the price drops after I order?",
    a: "We'll automatically refund the difference if the price drops within 30 days of your order.",
  },
  {
    q: "Do you offer payment plans?",
    a: "Yes, 0% finance is available at checkout on phones over £200.",
  },
  {
    q: "What's your return policy?",
    a: "14 days, no questions asked, as long as the phone is in its original condition.",
  },
]
