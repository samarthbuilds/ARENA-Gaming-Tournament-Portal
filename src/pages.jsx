
import { useState } from "react";
import {
  Link, useParams, useSearchParams, useNavigate
} from "react-router-dom";
import {
  Gamepad2, Calendar, Users, Trophy, ArrowRight,
  Eye, EyeOff, ShieldCheck, Lock, Mail, User,
  ClipboardList, UserRound, Swords
} from "lucide-react";

import {
  GAMES, DEMO_ADMIN, formatDate, getTournaments,
  getMatches, getLeaderboard, getRegistrations,
  getUsers, registerForTournament, login, signup
} from "./script.js";

import { TournamentCard, PageHeader } from "./components.jsx";

/* ---------- Game artwork ---------- */

const gameImages = {
  "Valorant": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=700",
  "BGMI": "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=700",
  "Counter-Strike 2": "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=700",
  "Call of Duty": "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=700",
  "Fortnite": "https://images.unsplash.com/photo-1542751371-6533f1a7c8e5?w=700"
};

/* ---------- Reusable components ---------- */

function SectionHead({ title, link, linkText }) {
  return (
    <div className="section-head">
      <h2>{title}</h2>
      {link && (
        <Link to={link} className="link">
          {linkText} <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}

function MatchRow({ m }) {
  const done = m.status === "Completed";

  return (
    <div className="card match-row">
      <span className="muted small">
        {m.game} · {formatDate(m.date)} · {m.time}
      </span>
      <div className="match-teams">
        <strong>{m.teamA}</strong>
        <span className="match-score">
          {done ? `${m.scoreA} - ${m.scoreB}` : "VS"}
        </span>
        <strong>{m.teamB}</strong>
      </div>
    </div>
  );
}

function LeaderboardTable({ rows }) {
  return (
    <div className="card table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Team</th>
            <th>Game</th>
            <th>Wins</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id}>
              <td className={i < 3 ? "rank top" : "rank"}>{i + 1}</td>
              <td><strong>{r.team}</strong></td>
              <td className="muted">{r.game}</td>
              <td>{r.wins}</td>
              <td className="prize">{r.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GameCard({ game, count }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      to={`/tournaments?game=${encodeURIComponent(game)}`}
      className="card game-card"
      data-game={game}
    >
      {!imageError && (
        <img
          src={gameImages[game]}
          alt={`${game} artwork`}
          className="game-image"
          onError={() => setImageError(true)}
        />
      )}
      <div className="game-overlay" />
      <Gamepad2 size={28} className="game-icon" />
      <div className="game-info">
        <strong>{game}</strong>
        <span>{count} tournaments</span>
      </div>
    </Link>
  );
}

/* ---------- Authentication input ---------- */

function AuthInput({
  label, type = "text", value, onChange,
  placeholder, icon: Icon
}) {
  const [visible, setVisible] = useState(false);
  const password = type === "password";

  return (
    <div className="form-group">
      <label>{label}</label>
      <div style={{ position: "relative" }}>
        {Icon && (
          <Icon
            size={18}
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#999"
            }}
          />
        )}

        <input
          className="input"
          type={password ? (visible ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          style={{
            paddingLeft: Icon ? 42 : 14,
            paddingRight: password ? 44 : 14,
            width: "100%",
            boxSizing: "border-box"
          }}
        />

        {password && (
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            aria-label="Toggle password visibility"
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "#999"
            }}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------- Home ---------- */

export function Home() {
  const tournaments = getTournaments();

  const featured = tournaments
    .filter(t => t.status !== "Completed")
    .slice(0, 3);

  const upcoming = getMatches()
    .filter(m => m.status === "Upcoming")
    .slice(0, 4);

  return (
    <>
      <section className="hero">
        <div className="container hero-content">
          <span className="badge badge-live">Season 2026 is live</span>
          <h1>
            COMPETE. CONQUER. <span className="accent">REPEAT.</span>
          </h1>
          <p className="muted">
            Register your team, play in organised tournaments
            and climb the leaderboard.
          </p>
          <div className="hero-actions">
            <Link to="/tournaments" className="btn btn-primary">
              Browse Tournaments
            </Link>
            <Link to="/signup" className="btn btn-ghost">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      <section className="section container">
        <SectionHead
          title="Featured Tournaments"
          link="/tournaments"
          linkText="View all"
        />
        <div className="grid grid-3">
          {featured.map(t => (
            <TournamentCard key={t.id} t={t} />
          ))}
        </div>
      </section>

      <section className="section container">
        <SectionHead title="Popular Games" />
        <div className="grid grid-5">
          {GAMES.map(game => (
            <GameCard
              key={game}
              game={game}
              count={tournaments.filter(t => t.game === game).length}
            />
          ))}
        </div>
      </section>

      <section className="section container">
        <SectionHead title="Upcoming Matches" />
        <div className="grid grid-2">
          {upcoming.map(m => (
            <MatchRow key={m.id} m={m} />
          ))}
        </div>
      </section>

      <section className="section container">
        <SectionHead
          title="Top Teams"
          link="/leaderboard"
          linkText="Full leaderboard"
        />
        <LeaderboardTable rows={getLeaderboard().slice(0, 5)} />
      </section>
    </>
  );
}

/* ---------- Tournaments ---------- */

export function Tournaments() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const game = params.get("game") || "All";

  const list = getTournaments().filter(
    t =>
      (game === "All" || t.game === game) &&
      t.name.toLowerCase().includes(search.toLowerCase())
  );

  const pickGame = g =>
    g === "All" ? setParams({}) : setParams({ game: g });

  return (
    <>
      <PageHeader
        title="Tournaments"
        subtitle="Find a tournament and register your team."
      />

      <div className="container">
        <div className="toolbar">
          <div className="chips">
            {["All", ...GAMES].map(g => (
              <button
                key={g}
                className={`chip ${game === g ? "active" : ""}`}
                onClick={() => pickGame(g)}
              >
                {g}
              </button>
            ))}
          </div>

          <input
            className="input"
            placeholder="Search tournaments..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {list.length ? (
          <div className="grid grid-3">
            {list.map(t => (
              <TournamentCard key={t.id} t={t} />
            ))}
          </div>
        ) : (
          <p className="empty">No tournaments found.</p>
        )}
      </div>
    </>
  );
}

/* ---------- Tournament Details ---------- */

export function TournamentDetails({ user }) {
  const { id } = useParams();

  const [t, setT] = useState(
    () => getTournaments().find(x => x.id === id)
  );

  const [registrations, setRegistrations] = useState(getRegistrations);
  const [teamName, setTeamName] = useState("");
  const [message, setMessage] = useState("");

  if (!t) {
    return (
      <p className="empty container">
        Tournament not found.{" "}
        <Link to="/tournaments" className="link">
          Back to tournaments
        </Link>
      </p>
    );
  }

  const mine = user && registrations.find(
    r => r.tournamentId === id && r.userId === user.id
  );

  const matches = getMatches().filter(m => m.tournamentId === id);

  const info = [
    [Trophy, "Prize Pool", t.prize],
    [Calendar, "Date", formatDate(t.date)],
    [Users, "Teams", `${t.joined}/${t.slots}`],
    [Gamepad2, "Game", t.game]
  ];

  const handleRegister = e => {
    e.preventDefault();

    const error = registerForTournament(t, user, teamName);

    if (error) {
      setMessage(error);
      return;
    }

    setRegistrations(getRegistrations());
    setT(getTournaments().find(x => x.id === id));
    setMessage("");
  };

  const registerBox = () => {
    if (mine) {
      return (
        <p>
          Your registration:{" "}
          <span className={`badge badge-${mine.status.toLowerCase()}`}>
            {mine.status}
          </span>
        </p>
      );
    }

    if (t.status !== "Open") {
      return <p className="muted">Registrations are closed.</p>;
    }

    if (!user) {
      return (
        <Link to="/login" className="btn btn-primary">
          Login to register
        </Link>
      );
    }

    if (user.role === "admin") {
      return <p className="muted">Admins cannot register teams.</p>;
    }

    if (t.joined >= t.slots) {
      return <p className="muted">All slots are filled.</p>;
    }

    return (
      <form onSubmit={handleRegister} className="form">
        <label htmlFor="team">Team name</label>
        <input
          id="team"
          className="input"
          placeholder="e.g. Night Owls"
          value={teamName}
          onChange={e => setTeamName(e.target.value)}
          required
        />
        {message && <p className="error">{message}</p>}
        <button className="btn btn-primary">Register Team</button>
      </form>
    );
  };

  return (
    <div className="container section">
      <div className="details-banner" data-game={t.game}>
        <span className={`badge badge-${t.status.toLowerCase()}`}>
          {t.status}
        </span>
        <h1>{t.name}</h1>
        <p>{t.game}</p>
      </div>

      <div className="info-grid">
        {info.map(([Icon, label, value]) => (
          <div key={label} className="card info">
            <Icon size={18} />
            <span className="muted small">{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <div className="details-layout">
        <div>
          <h2>Matches</h2>
          {matches.length ? (
            <div className="stack">
              {matches.map(m => (
                <MatchRow key={m.id} m={m} />
              ))}
            </div>
          ) : (
            <p className="muted">No matches scheduled yet.</p>
          )}
        </div>

        <aside className="card register-box">
          <h3>Registration</h3>
          {registerBox()}
        </aside>
      </div>
    </div>
  );
}

/* ---------- Leaderboard ---------- */

export function Leaderboard() {
  return (
    <>
      <PageHeader
        title="Leaderboard"
        subtitle="Top teams ranked by points across all tournaments."
      />
      <div className="container">
        <LeaderboardTable rows={getLeaderboard()} />
      </div>
    </>
  );
}

/* ---------- Login ---------- */

export function Login({ onLogin }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = e => {
    e.preventDefault();

    const result = login(email, password);

    if (result.error) {
      setError(result.error);
      return;
    }

    onLogin(result.user);

    navigate(
      result.user.role === "admin" ? "/admin" : "/dashboard",
      { replace: true }
    );
  };

  return (
    <div className="container section auth-page">
      <div className="card auth-card">
        <div className="auth-heading">
          <Lock size={28} className="accent" />
          <h1>Welcome Back</h1>
          <p className="muted">Sign in to continue your ARENA journey.</p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <AuthInput
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <AuthInput
            label="Password"
            type="password"
            icon={Lock}
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          {error && <p className="error">{error}</p>}

          <button className="btn btn-primary" type="submit">
            Sign In <ArrowRight size={17} />
          </button>
        </form>

        <div className="auth-demo">
          <ShieldCheck size={18} />
          <div>
            <strong>Demo Admin Account</strong>
            <p>Email: {DEMO_ADMIN.email}</p>
            <p>Password: {DEMO_ADMIN.password}</p>
          </div>
        </div>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/signup" className="link">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

/* ---------- Signup ---------- */

export function Signup({ onLogin }) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = e => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const result = signup(name, email, password);

    if (result.error) {
      setError(result.error);
      return;
    }

    onLogin(result.user);
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="container section auth-page">
      <div className="card auth-card">
        <div className="auth-heading">
          <Trophy size={28} className="accent" />
          <h1>Join ARENA</h1>
          <p className="muted">
            Create your account and enter the competition.
          </p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <AuthInput
            label="Full Name"
            icon={User}
            placeholder="Enter your name"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <AuthInput
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <AuthInput
            label="Password"
            type="password"
            icon={Lock}
            placeholder="Minimum 6 characters"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <AuthInput
            label="Confirm Password"
            type="password"
            icon={Lock}
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />

          {error && <p className="error">{error}</p>}

          <button className="btn btn-primary" type="submit">
            Create Account <ArrowRight size={17} />
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login" className="link">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

/* ---------- User Dashboard (temporary) ---------- */

export const UserDashboard = () => (
  <p className="empty container">User Dashboard coming soon...</p>
);

export const MyRegistrations = () => (
  <p className="empty container">My Registrations coming soon...</p>
);

export const MyTeam = () => (
  <p className="empty container">My Team coming soon...</p>
);

export const Profile = () => (
  <p className="empty container">Profile coming soon...</p>
);

/* ---------- Admin Dashboard ---------- */

export function AdminDashboard() {
  const tournaments = getTournaments();
  const users = getUsers();
  const registrations = getRegistrations();
  const matches = getMatches();

  const pending = registrations.filter(
    r => r.status === "Pending"
  );

  const stats = [
    {
      label: "Total Players",
      value: users.filter(u => u.role === "user").length,
      icon: Users
    },
    {
      label: "Tournaments",
      value: tournaments.length,
      icon: Trophy
    },
    {
      label: "Registrations",
      value: registrations.length,
      icon: ClipboardList
    },
    {
      label: "Upcoming Matches",
      value: matches.filter(m => m.status === "Upcoming").length,
      icon: Calendar
    }
  ];

  const actions = [
    {
      title: "Manage Tournaments",
      desc: "Create, edit and delete tournaments.",
      icon: Trophy,
      link: "/admin/tournaments"
    },
    {
      title: "Manage Users",
      desc: "View all registered players.",
      icon: UserRound,
      link: "/admin/users"
    },
    {
      title: "Registrations",
      desc: "Approve or reject applications.",
      icon: ClipboardList,
      link: "/admin/registrations"
    },
    {
      title: "Manage Matches",
      desc: "Schedule tournament matches.",
      icon: Swords,
      link: "/admin/matches"
    },
    {
      title: "Manage Results",
      desc: "Update scores and results.",
      icon: Calendar,
      link: "/admin/results"
    }
  ];

  return (
    <div className="container section">

      {/* Header */}
      <div className="admin-heading">
        <div>
          <span className="badge badge-live">ADMIN CONTROL PANEL</span>
          <h1>Dashboard</h1>
          <p className="muted">
            Manage your ARENA esports platform.
          </p>
        </div>
        <span className="admin-welcome">Administrator</span>
      </div>

      {/* Statistics */}
      <div className="grid grid-4 admin-stats">
        {stats.map(s => (
          <div className="card stat-card" key={s.label}>
            <div className="stat-icon">
              <s.icon size={22} />
            </div>
            <div>
              <p className="muted small">{s.label}</p>
              <strong className="stat-value">{s.value}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Management */}
      <SectionHead title="Quick Management" />

      <div className="grid grid-3">
        {actions.map(a => (
          <Link
            to={a.link}
            className="card admin-action"
            key={a.title}
          >
            <div className="stat-icon">
              <a.icon size={22} />
            </div>
            <div>
              <h3>{a.title}</h3>
              <p className="muted small">{a.desc}</p>
            </div>
            <ArrowRight size={18} className="admin-arrow" />
          </Link>
        ))}
      </div>

      {/* Recent Registrations */}
      <div className="admin-section-head">
        <SectionHead
          title="Recent Registrations"
          link="/admin/registrations"
          linkText="View all"
        />
      </div>

      <div className="card table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Player</th>
              <th>Tournament</th>
              <th>Team</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {registrations.slice(-5).reverse().map(r => {
              const player = users.find(u => u.id === r.userId);
              const tournament = tournaments.find(
                t => t.id === r.tournamentId
              );

              return (
                <tr key={r.id}>
                  <td>{player?.name || "Unknown Player"}</td>
                  <td>{tournament?.name || "Deleted Tournament"}</td>
                  <td>{r.teamName}</td>
                  <td>
                    <span className={`badge badge-${r.status.toLowerCase()}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              );
            })}

            {!registrations.length && (
              <tr>
                <td colSpan="4" className="muted">
                  No registrations yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pending Approvals */}
      <div className="card admin-pending">
        <div>
          <h3>Pending Approvals</h3>
          <p className="muted small">
            Registrations waiting for administrator review.
          </p>
        </div>

        <strong className="stat-value">{pending.length}</strong>

        <Link
          to="/admin/registrations"
          className="btn btn-primary btn-sm"
        >
          Review Now
        </Link>
      </div>

    </div>
  );
}

/* ---------- Remaining Admin Pages ---------- */

export const ManageTournaments = () => (
  <p className="empty container">Manage Tournaments coming soon...</p>
);

export const ManageUsers = () => (
  <p className="empty container">Manage Users coming soon...</p>
);

export const ManageRegistrations = () => (
  <p className="empty container">Manage Registrations coming soon...</p>
);

export const ManageMatches = () => (
  <p className="empty container">Manage Matches coming soon...</p>
);

export const ManageResults = () => (
  <p className="empty container">Manage Results coming soon...</p>
);
