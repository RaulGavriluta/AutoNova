import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from 'react-hot-toast'; // <--- Importul era deja pus corect
import MainLayout from "../components/MainLayout";
import Home from "../features/catalog/pages/CatalogPage";
import Login from "../features/auth/pages/LoginPage";
import Register from "../features/auth/pages/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import ProductsPage from "../features/catalog/pages/ProductsPage";
import CartPage from "../features/cart/pages/CartPage";

function OrdersPlaceholder() {
  return (
    <div className="p-8 text-center text-xl font-bold font-custom text-text-base">
      Your Orders History (Protected)
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      /* --- PUBLIC ROUTES --- */
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/products",
        element: <ProductsPage />,
      },
      /* --- PROTECTED ROUTES --- */
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/orders",
            element: <OrdersPlaceholder />,
          },
          {
            path: "/cart",
            element: <CartPage />,
          },
        ],
      },
    ],
  },
]);

export default function AppRoutes() {
  return (
    <>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--color-bg-surface, #ffffff)', 
            color: 'var(--color-text-base, #2c2520)',       
            fontFamily: 'var(--font-body, "Poppins", sans-serif)', 
            borderRadius: '12px',
            border: '1px solid var(--color-brand-border, #e5d4bc)', 
          },
          success: {
            iconTheme: {
              primary: 'var(--color-primary, #8A5F41)', 
              secondary: 'var(--color-bg-surface, #ffffff)',
            },
          },
        }}
      />
      
      {/* RENDERUL RUTELOR */}
      <RouterProvider router={router} />
    </>
  );
}