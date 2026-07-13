import { BrowserRouter, Routes, Route } from "react-router-dom"
import { SearchProvider } from "./lib/SearchContext"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import About from "./pages/About"
import SignUp from "./pages/SignUp"
import Sell from "./pages/Sell"
import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <SearchProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="sell" element={<Sell />} />
          </Route>
        </Routes>
      </SearchProvider>
    </BrowserRouter>
  )
}

export default App
