import { MainLayout } from "./components/layout/MainLayout/MainLayout"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Orders } from "./pages/orders/Orders"
import { Products } from "./pages/products/Products"
import { Customers } from "./pages/customers/Customers"
import Settings from "./pages/settings/settings"
import { Analytics } from "./pages/analytics/Analytics"
import { ThemeProvider } from "./context/ThemeContext"
import { AuthProvider } from "./context/AuthContext"
import { PrivateRoute } from "./components/common/PrivateRoutes/PrivateRoute"
import Login from "./pages/Login/Login"
import { Toaster } from "react-hot-toast"
import Overview from "./pages/overview/Overview"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <Toaster position="top-right" toastOptions={{ duration: 3000, style: { background: '#333', color: "#fff" } }} />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<PrivateRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Overview />} />
                  <Route path="/commandes" element={<Orders />} />
                  <Route path="/produits" element={<Products />} />
                  <Route path="/clients" element={<Customers />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/parametres" element={<Settings />} />
                </Route>
              </Route>
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>

  )
}

export default App
