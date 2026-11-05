
import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { seedData, getCurrentUser, logout } from "./script.js";
import { Navbar, Footer, RequireAuth } from "./components.jsx";
import {
  Home, Tournaments, TournamentDetails, Leaderboard, Login, Signup,
  UserDashboard, MyRegistrations, MyTeam, Profile,
  AdminDashboard, ManageTournaments, ManageUsers,
  ManageRegistrations, ManageMatches, ManageResults,
} from "./pages.jsx";

export default function App() {
  const [user, setUser] = useState(() => {
    seedData();
    return getCurrentUser();
  });

  const { pathname } = useLocation();

  // Scroll to top whenever the route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  // Protect pages according to user role
  const guard = (role, page) => (
    <RequireAuth user={user} role={role}>
      {page}
    </RequireAuth>
  );

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />

      <main>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/tournaments/:id" element={<TournamentDetails user={user} />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/signup" element={<Signup onLogin={setUser} />} />

          {/* User pages */}
          <Route path="/dashboard" element={guard("user", <UserDashboard user={user} />)} />
          <Route path="/registrations" element={guard("user", <MyRegistrations user={user} />)} />
          <Route path="/team" element={guard("user", <MyTeam user={user} />)} />
          <Route path="/profile" element={guard("user", <Profile user={user} onUpdate={setUser} />)} />

          {/* Admin pages */}
          <Route path="/admin" element={guard("admin", <AdminDashboard />)} />
          <Route path="/admin/tournaments" element={guard("admin", <ManageTournaments />)} />
          <Route path="/admin/users" element={guard("admin", <ManageUsers />)} />
          <Route path="/admin/registrations" element={guard("admin", <ManageRegistrations />)} />
          <Route path="/admin/matches" element={guard("admin", <ManageMatches />)} />
          <Route path="/admin/results" element={guard("admin", <ManageResults />)} />

          {/* Unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}
