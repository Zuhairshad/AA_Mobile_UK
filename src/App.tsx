import { BrowserRouter, Route, Routes } from "react-router-dom"
import { CartProvider } from "./lib/cart"
import Layout from "./components/layout/Layout"
import About from "./pages/About"
import Cart from "./pages/Cart"
import Category from "./pages/Category"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import Product from "./pages/Product"
import Repairs from "./pages/Repairs"
import Search from "./pages/Search"
import Sell from "./pages/Sell"

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="product/:id" element={<Product />} />
            <Route path="search" element={<Search />} />
            <Route path="cart" element={<Cart />} />
            <Route path="repairs" element={<Repairs />} />
            <Route path="sell" element={<Sell />} />
            <Route path="about" element={<About />} />
            {/* One listing component serves all four shop branches. Static
                routes above out-rank this, and an unrecognised slug renders the
                404 from inside Category. */}
            <Route path=":category" element={<Category />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}
