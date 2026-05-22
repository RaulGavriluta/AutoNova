import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import Home from '../features/catalog/pages/CatalogPage';
import Login from '../features/auth/pages/LoginPage';
import Register from '../features/auth/pages/RegisterPage';
import ProtectedRoute from './ProtectedRoute'; 

function OrdersPlaceholder() {
  return <div className="p-8 text-center text-xl font-bold font-custom text-text-base">Your Orders History (Protected)</div>;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />, 
    children: [

      /* --- PUBLIC ROUTES --- */
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },

      /* --- PROTECTED ROUTES --- */
      {
        element: <ProtectedRoute />, 
        children: [
          {
            path: '/orders',
            element: <OrdersPlaceholder />,
          },
        ],
      },
    ],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}