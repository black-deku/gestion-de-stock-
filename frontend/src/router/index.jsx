import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';

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
    element: <Dashboard />,
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
