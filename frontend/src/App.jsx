import { RouterProvider } from 'react-router-dom';
import router from './router';

/**
 * Root application component.
 * Provides the router to the entire app.
 */
function App() {
  return <RouterProvider router={router} />;
}

export default App;
