import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../components/Layout';
import Products from '../pages/Products';
import Movements from '../pages/Movements';
import Documents from '../pages/Documents';

/**
 * Application router configuration.
 *
 * Routes will be expanded as we add modules:
 * - /login        → Authentication
 * - /             → Dashboard (protected)
 * - /products     → Products CRUD
 * - /movements    → Stock movements
 * - /documents    → PDF management
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: '/', element: <Dashboard /> },
          { path: '/products', element: <Products /> },
          { path: '/movements', element: <Movements /> },
          { path: '/documents', element: <Documents /> },
        ]
      }
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
