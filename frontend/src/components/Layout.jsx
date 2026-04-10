import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Layout.css';

function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Stock App</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/">Dashboard</Link>
          <Link to="/products">Products</Link>
          <Link to="/movements">Movements</Link>
        </nav>
        <div className="sidebar-footer">
          <p>{user?.name}</p>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
