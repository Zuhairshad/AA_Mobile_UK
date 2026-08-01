import { BrowserRouter, Route, Routes } from "react-router-dom"
import { CartProvider } from "./lib/cart"
import { ToastProvider } from "./lib/toast"
import Layout from "./components/layout/Layout"
import About from "./pages/About"
import Brand from "./pages/Brand"
import Cart from "./pages/Cart"
import Category from "./pages/Category"
import Device from "./pages/Device"
import Devices from "./pages/Devices"
import Guide from "./pages/Guide"
import Guides from "./pages/Guides"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import Product from "./pages/Product"
import Repairs from "./pages/Repairs"
import Search from "./pages/Search"
import Sell from "./pages/Sell"
import ServiceDetail from "./pages/ServiceDetail"
import Sitemap from "./pages/Sitemap"

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />

            <Route path="product/:id" element={<Product />} />
            <Route path="search" element={<Search />} />
            <Route path="cart" element={<Cart />} />

            <Route path="devices" element={<Devices />} />
            <Route path="device/:slug" element={<Device />} />
            <Route path="brand/:slug" element={<Brand />} />

            <Route path="repairs" element={<Repairs />} />
            <Route path="repairs/:service" element={<ServiceDetail />} />

            <Route path="guides" element={<Guides />} />
            <Route path="guide/:slug" element={<Guide />} />

            <Route path="sell" element={<Sell />} />
            <Route path="about" element={<About />} />
            <Route path="sitemap" element={<Sitemap />} />

            {/* One listing component serves all four shop branches and their
                subcategories. Static routes above out-rank these, and an
                unrecognised slug renders the 404 from inside Category. */}
            <Route path=":category" element={<Category />} />
            <Route path=":category/:subcategory" element={<Category />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
