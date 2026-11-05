
import { useState } from "react";
import { Link, NavLink, Navigate } from "react-router-dom";
import {
  Menu, X, Trophy, Calendar, Users, LogOut,
  Gamepad2
} from "lucide-react";
import { formatDate } from "./script.js";

// Tournament artwork
const gameImages = {
  "Valorant": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900",
  "BGMI": "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=900",
  "Counter-Strike 2": "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=900",
  "Call of Duty": "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=900",
  "Fortnite": "https://images.unsplash.com/photo-1542751371-6533f1a7c8e5?w=900"
};

export function Navbar({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const dashboardLink = user?.role === "admin" ? "/admin" : "/dashboard";

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo" onClick={close}>
          <Trophy size={22} /> ARENA
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>

        <nav className={`nav-links ${open ? "open" : ""}`} onClick={close}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/tournaments">Tournaments</NavLink>
          <NavLink to="/leaderboard">Leaderboard</NavLink>

          {user ? (
            <>
              <NavLink to={dashboardLink}>Dashboard</NavLink>
              <button className="btn btn-ghost btn-sm" onClick={onLogout}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <div className="logo"><Trophy size={20} /> ARENA</div>
          <p className="muted small">COMPETE. CONQUER. REPEAT.</p>
        </div>

        <nav className="footer-links">
          <Link to="/tournaments">Tournaments</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/login">Login</Link>
        </nav>
      </div>

      <p className="container footer-note muted small">
        © 2026 ARENA. A college demo project: data is stored in your browser only.
      </p>
    </footer>
  );
}

export function RequireAuth({ user, role, children }) {
  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== role) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin" : "/dashboard"}
        replace
      />
    );
  }

  return children;
}

// Tournament card with game artwork
export function TournamentCard({ t }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link to={`/tournaments/${t.id}`} className="card tournament-card">
      <div className="card-banner" data-game={t.game}>
        {!imageError && (
          <img
            src={gameImages[t.game]}
            alt={`${t.game} tournament artwork`}
            className="tournament-image"
            onError={() => setImageError(true)}
          />
        )}

        <div className="banner-overlay" />

        <Gamepad2 className="banner-icon" size={30} />

        <span className={`badge badge-${t.status.toLowerCase()}`}>
          {t.status}
        </span>

        <span className="banner-game">{t.game}</span>
      </div>

      <div className="card-body">
        <h3>{t.name}</h3>

        <div className="card-meta">
          <span>
            <Calendar size={14} />
            {formatDate(t.date)}
          </span>

          <span>
            <Users size={14} />
            {t.joined}/{t.slots} teams
          </span>
        </div>

        <div className="card-footer">
          <div>
            <span className="muted small">Prize Pool</span>
            <strong className="prize">{t.prize}</strong>
          </div>

          <span className="btn btn-primary btn-sm">View</span>
        </div>
      </div>
    </Link>
  );
}

export function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="card stat-card">
      <div className="stat-icon">
        <Icon size={22} />
      </div>

      <div>
        <p className="muted small">{label}</p>
        <strong className="stat-value">{value}</strong>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="page-header container">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>

      {children}
    </div>
  );
}
