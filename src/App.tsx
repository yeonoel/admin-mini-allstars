import { MainLayout } from "./components/layout/MainLayout/MainLayout"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Orders } from "./pages/orders/Orders"
import { ThemeProvider } from "./context/ThemeContext"
import { AuthProvider } from "./context/AuthContext"
import { PrivateRoute } from "./components/common/PrivateRoutes/PrivateRoute"
import Login from "./pages/Login/Login"
import { Toaster } from "sonner"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Overview from "./pages/overview/Overview"
import Products from "./pages/products/Products"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import RootRedirect from "./components/layout/RootRedirection/RootRedirect"

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
                <Route path="/dashboard/:slugStore" element={<MainLayout />}>
                  <Route index element={<Overview />} />
                  <Route path="overview" element={<Overview />} />
                  <Route path="commandes" element={<Orders />} />
                  <Route path="produits" element={<Products />} />
                </Route>
              </Route>
              <Route path="/" element={<RootRedirect />} />
              <Route path="*" element={<RootRedirect />} />
            </Routes>
          </AuthProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </BrowserRouter>
    </QueryClientProvider>

  )
}

export default App
