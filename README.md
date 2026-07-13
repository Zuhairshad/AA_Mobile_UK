# AA Mobile UK

A responsive mobile phone shop front end, styled after the "Curation" product-directory
layout (dark theme, hero + subscribe, category tabs, product grid) and populated with
mobile phone products.

Built with React, TypeScript, and Vite.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Structure

- `src/data/products.ts` — phone product catalogue (brand, category, price)
- `src/components/PhoneIllustration.tsx` — parametric SVG phone renders used as product images
- `src/components/` — Header (search + nav), Hero (subscribe form), CategoryTabs, ProductGrid/ProductCard, Footer
- Responsive breakpoints: 3-column grid on desktop, 2-column on tablet (≤1024px), 1-column on mobile (≤640px)
