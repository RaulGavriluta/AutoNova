import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import Home from '../features/catalog/pages/CatalogPage';
import Login from '../features/auth/pages/LoginPage';
import Register from '../features/auth/pages/RegisterPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />, 
    children: [
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
    ],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}