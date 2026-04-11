import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Layout.css';

function Layout() {
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>StockPro</h2>
          <div className="brand-sub">Gestion de Stock</div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end>
            <span className="nav-icon">📊</span>
            Tableau de bord
          </NavLink>
          <NavLink to="/products">
            <span className="nav-icon">📦</span>
            Produits
          </NavLink>
          <NavLink to="/movements">
            <span className="nav-icon">🔄</span>
            Mouvements
          </NavLink>
          <NavLink to="/documents">
            <span className="nav-icon">📄</span>
            Documents
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{initials}</div>
            <div>
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.role || 'Utilisateur'}</div>
            </div>
          </div>
          <button onClick={logout} className="logout-btn">
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
