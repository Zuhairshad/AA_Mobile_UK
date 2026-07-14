import { Outlet, useLocation } from "react-router-dom"
import Header from "./Header"
import FloatingActions from "./FloatingActions"

export default function Layout() {
  const location = useLocation()
  const isLanding = location.pathname === "/"

  return (
    <div className="page">
      <Header />
      <main>
        <Outlet />
      </main>
      {!isLanding && <FloatingActions />}
    </div>
  )
}
