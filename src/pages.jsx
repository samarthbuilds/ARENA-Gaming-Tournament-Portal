import { useState } from "react";
import {
  Link, useParams, useSearchParams, useNavigate
} from "react-router-dom";
import {
  Gamepad2, Calendar, Users, Trophy, ArrowRight,
  Eye, EyeOff, ShieldCheck, Lock, Mail, User,
  ClipboardList, UserRound, Swords, CheckCircle2, Clock
} from "lucide-react";

import {
  GAMES, DEMO_ADMIN, formatDate, getTournaments,
  getMatches, getLeaderboard, getRegistrations,
  getUsers, registerForTournament, login, signup,
  createTournament, deleteTournament, updateRegistrationStatus,
  createMatch, updateMatchScore
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

function LeaderboardTable({ rows, showRankOffset = 0 }) {
  return (
    <div className="card table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Team</th>
            <th>Game</th>
            <th>Wins</th>
            <th style={{ textAlign: "right" }}>Points</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const rank = i + 1 + showRankOffset;
            return (
              <tr key={r.id}>
                <td className={rank <= 3 ? "rank top" : "rank"}>#{rank}</td>
                <td><strong>{r.team}</strong></td>
                <td>
                  <span className="badge">{r.game}</span>
                </td>
                <td>{r.wins}W</td>
                <td className="prize" style={{ textAlign: "right" }}>
                  {r.points.toLocaleString()} PTS
                </td>
              </tr>
            );
          })}
          {!rows.length && (
            <tr>
              <td colSpan="5" className="muted" style={{ textAlign: "center", padding: "32px" }}>
                No teams ranked for this game yet.
              </td>
            </tr>
          )}
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
              color: "#999",
              pointerEvents: "none"
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
              width: "auto",
              margin: 0,
              padding: 4,
              background: "none",
              border: "none",
              color: "#999",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center"
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
  const [game, setGame] = useState("All");
  const allRows = getLeaderboard();
  const rows = game === "All"
    ? allRows
    : allRows.filter(r => r.game === game);

  const podium = rows.slice(0, 3);
  const podiumColors = [
    { label: "1ST PLACE", accent: "#fbbf24", bg: "rgba(251, 191, 36, 0.14)" },
    { label: "2ND PLACE", accent: "#cbd5e1", bg: "rgba(203, 213, 225, 0.14)" },
    { label: "3RD PLACE", accent: "#f59e0b", bg: "rgba(217, 119, 6, 0.14)" }
  ];

  return (
    <>
      <PageHeader
        title="Leaderboard"
        subtitle="Top teams ranked by points across all tournaments."
      />

      <div className="container">
        {/* Game Filter Chips */}
        <div className="toolbar">
          <div className="chips">
            {["All", ...GAMES].map(g => (
              <button
                key={g}
                className={`chip ${game === g ? "active" : ""}`}
                onClick={() => setGame(g)}
              >
                {g}
              </button>
            ))}
          </div>
          <span className="muted small">Showing {rows.length} ranked teams</span>
        </div>

        {/* Top 3 Podium Cards */}
        {podium.length > 0 && (
          <div className="grid grid-3" style={{ marginBottom: 28 }}>
            {podium.map((team, idx) => {
              const style = podiumColors[idx];
              return (
                <div
                  key={team.id}
                  className="card card-body"
                  style={{
                    borderColor: idx === 0 ? "rgba(251, 191, 36, 0.45)" : "var(--border)",
                    background: idx === 0
                      ? "linear-gradient(160deg, rgba(251, 191, 36, 0.08), var(--surface))"
                      : "var(--surface)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span
                      className="badge"
                      style={{ background: style.bg, color: style.accent }}
                    >
                      {style.label}
                    </span>
                    <Trophy size={20} style={{ color: style.accent }} />
                  </div>

                  <div>
                    <h3 style={{ fontSize: "1.4rem", marginBottom: 4 }}>{team.team}</h3>
                    <span className="muted small">{team.game}</span>
                  </div>

                  <div className="card-footer">
                    <span className="muted small">{team.wins} Wins</span>
                    <strong style={{ color: "var(--green)", fontSize: "1.05rem" }}>
                      {team.points.toLocaleString()} PTS
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full Standings Table */}
        <LeaderboardTable rows={rows} />
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

/* ---------- User Dashboard ---------- */

export function UserDashboard({ user }) {
  const tournaments = getTournaments();
  const registrations = getRegistrations().filter(
    r => r.userId === user?.id
  );
  const matches = getMatches();

  const myTeams = [...new Set(registrations.map(r => r.teamName))];
  const myMatches = matches.filter(
    m => myTeams.includes(m.teamA) || myTeams.includes(m.teamB)
  );
  const displayMatches = (myMatches.length ? myMatches : matches)
    .filter(m => m.status === "Upcoming")
    .slice(0, 3);

  const openTournaments = tournaments
    .filter(t => t.status === "Open")
    .slice(0, 3);

  const stats = [
    {
      label: "My Registrations",
      value: registrations.length,
      icon: ClipboardList
    },
    {
      label: "Approved Entries",
      value: registrations.filter(r => r.status === "Approved").length,
      icon: CheckCircle2
    },
    {
      label: "Pending Approvals",
      value: registrations.filter(r => r.status === "Pending").length,
      icon: Clock
    },
    {
      label: "Active Teams",
      value: myTeams.length,
      icon: Users
    }
  ];

  const quickLinks = [
    {
      title: "My Registrations",
      desc: "Check tournament entry status and details.",
      icon: ClipboardList,
      link: "/registrations"
    },
    {
      title: "My Team",
      desc: "View your registered squad names and games.",
      icon: Users,
      link: "/team"
    },
    {
      title: "Player Profile",
      desc: "View your ARENA account and player info.",
      icon: UserRound,
      link: "/profile"
    }
  ];

  return (
    <div className="container section">
      {/* Header */}
      <div className="page-header" style={{ paddingTop: 0 }}>
        <div>
          <span className="badge badge-live">PLAYER DASHBOARD</span>
          <h1 style={{ marginTop: 8 }}>
            Welcome back, <span className="accent">{user?.name || "Player"}</span>
          </h1>
          <p className="muted">
            Track your tournament entries, squads, and upcoming matches.
          </p>
        </div>

        <Link to="/tournaments" className="btn btn-primary">
          Browse Tournaments <ArrowRight size={17} />
        </Link>
      </div>

      {/* Statistics */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          marginBottom: 32
        }}
      >
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

      {/* Quick Navigation */}
      <SectionHead title="Player Hub" />
      <div className="grid grid-3" style={{ marginBottom: 36 }}>
        {quickLinks.map(item => (
          <Link
            to={item.link}
            className="card card-body"
            key={item.title}
            style={{ display: "flex", alignItems: "center", gap: 14 }}
          >
            <div className="stat-icon" style={{ flexShrink: 0 }}>
              <item.icon size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <h3>{item.title}</h3>
              <p className="muted small">{item.desc}</p>
            </div>
            <ArrowRight size={18} className="muted" />
          </Link>
        ))}
      </div>

      {/* My Registrations & Upcoming Matches */}
      <div className="grid grid-2" style={{ marginBottom: 36 }}>
        <div>
          <SectionHead
            title="My Tournament Entries"
            link="/registrations"
            linkText="View all"
          />
          <div className="card table-wrap">
            <table className="table" style={{ minWidth: "100%" }}>
              <thead>
                <tr>
                  <th>Tournament</th>
                  <th>Team</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {registrations.slice(-5).reverse().map(r => {
                  const tournament = tournaments.find(
                    t => t.id === r.tournamentId
                  );
                  return (
                    <tr key={r.id}>
                      <td>
                        <Link
                          to={`/tournaments/${r.tournamentId}`}
                          className="link"
                        >
                          {tournament?.name || "Tournament"}
                        </Link>
                      </td>
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
                    <td colSpan="3" className="muted">
                      You haven't registered for any tournaments yet.{" "}
                      <Link to="/tournaments" className="link">
                        Join one now
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <SectionHead
            title={myMatches.length ? "Your Upcoming Matches" : "Upcoming Arena Matches"}
            link="/leaderboard"
            linkText="Leaderboard"
          />
          {displayMatches.length ? (
            <div className="stack">
              {displayMatches.map(m => (
                <MatchRow key={m.id} m={m} />
              ))}
            </div>
          ) : (
            <div className="card card-body">
              <p className="muted">No upcoming matches scheduled right now.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Open Tournaments */}
      <SectionHead
        title="Open for Registration"
        link="/tournaments"
        linkText="All tournaments"
      />
      <div className="grid grid-3">
        {openTournaments.map(t => (
          <TournamentCard key={t.id} t={t} />
        ))}
      </div>
    </div>
  );
}

/* ---------- My Registrations ---------- */

export function MyRegistrations({ user }) {
  const registrations = getRegistrations().filter(r => r.userId === user?.id);
  const tournaments = getTournaments();

  return (
    <div className="container section">
      <PageHeader
        title="My Registrations"
        subtitle="Track all tournaments you have entered and their approval status."
      />

      {registrations.length ? (
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Tournament</th>
                <th>Game</th>
                <th>Team Name</th>
                <th>Tournament Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {registrations.slice().reverse().map(r => {
                const t = tournaments.find(item => item.id === r.tournamentId);
                return (
                  <tr key={r.id}>
                    <td>
                      <Link to={`/tournaments/${r.tournamentId}`} className="link">
                        {t?.name || "Deleted Tournament"}
                      </Link>
                    </td>
                    <td className="muted">{t?.game || "—"}</td>
                    <td><strong>{r.teamName}</strong></td>
                    <td className="muted">{t?.date ? formatDate(t.date) : "—"}</td>
                    <td>
                      <span className={`badge badge-${r.status.toLowerCase()}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty">
          <p>You haven't registered for any tournaments yet.</p>
          <Link to="/tournaments" className="btn btn-primary" style={{ marginTop: 14 }}>
            Browse Tournaments
          </Link>
        </div>
      )}
    </div>
  );
}

/* ---------- My Team ---------- */

export function MyTeam({ user }) {
  const registrations = getRegistrations().filter(r => r.userId === user?.id);
  const tournaments = getTournaments();
  const leaderboard = getLeaderboard();
  const matches = getMatches();

  const teamNames = [...new Set(registrations.map(r => r.teamName))];

  return (
    <div className="container section">
      <PageHeader
        title="My Teams"
        subtitle="View your registered squads, leaderboard standings, and match history."
      />

      {teamNames.length ? (
        <div className="grid grid-2">
          {teamNames.map(team => {
            const teamRegs = registrations.filter(r => r.teamName === team);
            const standing = leaderboard.find(
              row => row.team.toLowerCase() === team.toLowerCase()
            );
            const teamMatches = matches.filter(
              m => m.teamA === team || m.teamB === team
            );

            return (
              <div className="card card-body" key={team} style={{ gap: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="stat-icon">
                      <Users size={22} />
                    </div>
                    <div>
                      <h3>{team}</h3>
                      <span className="muted small">Captain: {user?.name}</span>
                    </div>
                  </div>
                  <span className="badge badge-approved">
                    {standing ? `${standing.points} pts · ${standing.wins}W` : "Unranked"}
                  </span>
                </div>

                <div>
                  <p className="muted small" style={{ marginBottom: 8 }}>
                    Registered Tournaments ({teamRegs.length})
                  </p>
                  <div className="stack">
                    {teamRegs.map(r => {
                      const t = tournaments.find(item => item.id === r.tournamentId);
                      return (
                        <div
                          key={r.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px 12px",
                            borderRadius: 10,
                            background: "var(--surface-2)"
                          }}
                        >
                          <span>{t?.name || "Tournament"} ({t?.game || "Game"})</span>
                          <span className={`badge badge-${r.status.toLowerCase()}`}>
                            {r.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="card-footer">
                  <span className="muted small">Matches played/scheduled: {teamMatches.length}</span>
                  <Link to="/tournaments" className="link small">
                    Enter another tournament <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty">
          <p>No teams created yet. Register for an open tournament to form your squad.</p>
          <Link to="/tournaments" className="btn btn-primary" style={{ marginTop: 14 }}>
            Find a Tournament
          </Link>
        </div>
      )}
    </div>
  );
}

/* ---------- Player Profile ---------- */

export function Profile({ user }) {
  const registrations = getRegistrations().filter(r => r.userId === user?.id);
  const [gamerTag, setGamerTag] = useState(
    () => localStorage.getItem(`arena_tag_${user?.id}`) || ""
  );
  const [mainGame, setMainGame] = useState(
    () => localStorage.getItem(`arena_game_${user?.id}`) || GAMES[0]
  );
  const [saved, setSaved] = useState(false);

  const handleSave = e => {
    e.preventDefault();
    if (user?.id) {
      localStorage.setItem(`arena_tag_${user.id}`, gamerTag);
      localStorage.setItem(`arena_game_${user.id}`, mainGame);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="container section">
      <PageHeader
        title="Player Profile"
        subtitle="Manage your ARENA player identity and gaming preferences."
      />

      <div className="grid grid-2" style={{ alignItems: "start" }}>
        {/* Account Overview */}
        <div className="card card-body" style={{ gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div className="stat-icon" style={{ width: 58, height: 58 }}>
              <UserRound size={28} />
            </div>
            <div>
              <h2>{user?.name || "Player"}</h2>
              <p className="muted small">{user?.email}</p>
              <span className="badge badge-live" style={{ marginTop: 6 }}>
                Verified Competitor
              </span>
            </div>
          </div>

          <div className="grid grid-2" style={{ gap: 12 }}>
            <div className="card" style={{ padding: 14, background: "var(--surface-2)" }}>
              <span className="muted small">Tournaments Joined</span>
              <strong className="stat-value" style={{ marginTop: 4 }}>
                {registrations.length}
              </strong>
            </div>
            <div className="card" style={{ padding: 14, background: "var(--surface-2)" }}>
              <span className="muted small">Approved Entries</span>
              <strong className="stat-value" style={{ marginTop: 4 }}>
                {registrations.filter(r => r.status === "Approved").length}
              </strong>
            </div>
          </div>
        </div>

        {/* Gaming Preferences Form */}
        <div className="card card-body">
          <h3>Gaming Details</h3>
          <form className="form" onSubmit={handleSave}>
            <div className="form-group">
              <label>In-Game Name / Gamer Tag</label>
              <input
                className="input"
                placeholder="e.g. ShadowStrike#IN1"
                value={gamerTag}
                onChange={e => setGamerTag(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Primary Game</label>
              <select
                className="input"
                value={mainGame}
                onChange={e => setMainGame(e.target.value)}
              >
                {GAMES.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {saved && <p className="success">Player profile updated!</p>}

            <button type="submit" className="btn btn-primary">
              Save Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

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

/* ---------- Admin: Manage Tournaments ---------- */

export function ManageTournaments() {
  const [tournaments, setTournaments] = useState(getTournaments);
  const [name, setName] = useState("");
  const [game, setGame] = useState(GAMES[0]);
  const [prize, setPrize] = useState("");
  const [date, setDate] = useState("2026-12-15");
  const [slots, setSlots] = useState(16);

  const handleCreate = e => {
    e.preventDefault();
    if (!name.trim() || !prize.trim()) return;
    createTournament({ name, game, prize, date, slots });
    setTournaments(getTournaments());
    setName("");
    setPrize("");
  };

  const handleDelete = id => {
    deleteTournament(id);
    setTournaments(getTournaments());
  };

  return (
    <div className="container section">
      <div className="page-header" style={{ paddingTop: 0 }}>
        <div>
          <h1>Manage Tournaments</h1>
          <p className="muted">Create new tournaments or remove existing ones.</p>
        </div>
        <Link to="/admin" className="btn btn-ghost btn-sm">← Back to Dashboard</Link>
      </div>

      <div className="card card-body" style={{ marginBottom: 28 }}>
        <h3>Create Tournament</h3>
        <form onSubmit={handleCreate} className="grid grid-3" style={{ alignItems: "end" }}>
          <div className="form-group">
            <label>Tournament Name</label>
            <input
              className="input"
              placeholder="e.g. Winter Valorant Cup"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Game</label>
            <select className="input" value={game} onChange={e => setGame(e.target.value)}>
              {GAMES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Prize Pool</label>
            <input
              className="input"
              placeholder="e.g. ₹2,00,000"
              value={prize}
              onChange={e => setPrize(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              className="input"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Max Teams</label>
            <input
              type="number"
              min="4"
              max="128"
              className="input"
              value={slots}
              onChange={e => setSlots(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Add Tournament</button>
        </form>
      </div>

      <div className="card table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Tournament</th>
              <th>Game</th>
              <th>Prize</th>
              <th>Date</th>
              <th>Slots</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tournaments.map(t => (
              <tr key={t.id}>
                <td><strong>{t.name}</strong></td>
                <td className="muted">{t.game}</td>
                <td className="prize">{t.prize}</td>
                <td className="muted">{formatDate(t.date)}</td>
                <td>{t.joined}/{t.slots}</td>
                <td><span className={`badge badge-${t.status.toLowerCase()}`}>{t.status}</span></td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Admin: Manage Users ---------- */

export function ManageUsers() {
  const users = getUsers();
  const registrations = getRegistrations();

  return (
    <div className="container section">
      <div className="page-header" style={{ paddingTop: 0 }}>
        <div>
          <h1>Manage Users</h1>
          <p className="muted">All registered ARENA players and administrators.</p>
        </div>
        <Link to="/admin" className="btn btn-ghost btn-sm">← Back to Dashboard</Link>
      </div>

      <div className="card table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Player Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Tournaments Entered</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => {
              const count = registrations.filter(r => r.userId === u.id).length;
              return (
                <tr key={u.id}>
                  <td><strong>{u.name}</strong></td>
                  <td className="muted">{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === "admin" ? "badge-live" : "badge-approved"}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td>{count}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Admin: Manage Registrations (Pending Approvals) ---------- */

export function ManageRegistrations() {
  const [registrations, setRegistrations] = useState(getRegistrations);
  const [filter, setFilter] = useState("All");
  const users = getUsers();
  const tournaments = getTournaments();

  const handleAction = (id, status) => {
    updateRegistrationStatus(id, status);
    setRegistrations(getRegistrations());
  };

  const list = registrations.filter(
    r => filter === "All" || r.status === filter
  );

  return (
    <div className="container section">
      <div className="page-header" style={{ paddingTop: 0 }}>
        <div>
          <h1>Registrations & Approvals</h1>
          <p className="muted">Approve or reject team tournament applications.</p>
        </div>
        <Link to="/admin" className="btn btn-ghost btn-sm">← Back to Dashboard</Link>
      </div>

      <div className="toolbar">
        <div className="chips">
          {["All", "Pending", "Approved", "Rejected"].map(status => (
            <button
              key={status}
              className={`chip ${filter === status ? "active" : ""}`}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="card table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Player</th>
              <th>Tournament</th>
              <th>Team</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.slice().reverse().map(r => {
              const player = users.find(u => u.id === r.userId);
              const t = tournaments.find(x => x.id === r.tournamentId);
              return (
                <tr key={r.id}>
                  <td><strong>{player?.name || "Unknown Player"}</strong></td>
                  <td>{t?.name || "Deleted Tournament"}</td>
                  <td>{r.teamName}</td>
                  <td>
                    <span className={`badge badge-${r.status.toLowerCase()}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      {r.status !== "Approved" && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleAction(r.id, "Approved")}
                        >
                          Approve
                        </button>
                      )}
                      {r.status !== "Rejected" && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleAction(r.id, "Rejected")}
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {!list.length && (
              <tr>
                <td colSpan="5" className="muted">No registrations in this category.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Admin: Manage Matches ---------- */

export function ManageMatches() {
  const tournaments = getTournaments();
  const [matches, setMatches] = useState(getMatches);
  const [tournamentId, setTournamentId] = useState(tournaments[0]?.id || "");
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [date, setDate] = useState("2026-12-01");
  const [time, setTime] = useState("18:00");

  const handleSchedule = e => {
    e.preventDefault();
    if (!teamA.trim() || !teamB.trim()) return;
    createMatch({ tournamentId, teamA, teamB, date, time });
    setMatches(getMatches());
    setTeamA("");
    setTeamB("");
  };

  return (
    <div className="container section">
      <div className="page-header" style={{ paddingTop: 0 }}>
        <div>
          <h1>Manage Matches</h1>
          <p className="muted">Schedule upcoming matchups for active tournaments.</p>
        </div>
        <Link to="/admin" className="btn btn-ghost btn-sm">← Back to Dashboard</Link>
      </div>

      <div className="card card-body" style={{ marginBottom: 28 }}>
        <h3>Schedule Match</h3>
        <form onSubmit={handleSchedule} className="grid grid-3" style={{ alignItems: "end" }}>
          <div className="form-group">
            <label>Tournament</label>
            <select className="input" value={tournamentId} onChange={e => setTournamentId(e.target.value)}>
              {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Team A</label>
            <input
              className="input"
              placeholder="e.g. Night Owls"
              value={teamA}
              onChange={e => setTeamA(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Team B</label>
            <input
              className="input"
              placeholder="e.g. Team Nova"
              value={teamB}
              onChange={e => setTeamB(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              className="input"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Time</label>
            <input
              type="time"
              className="input"
              value={time}
              onChange={e => setTime(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Schedule Match</button>
        </form>
      </div>

      <div className="grid grid-2">
        {matches.map(m => <MatchRow key={m.id} m={m} />)}
      </div>
    </div>
  );
}

/* ---------- Admin: Manage Results ---------- */

export function ManageResults() {
  const [matches, setMatches] = useState(getMatches);
  const [scores, setScores] = useState({});

  const handleSaveResult = m => {
    const entry = scores[m.id] || { a: m.scoreA ?? 0, b: m.scoreB ?? 0 };
    updateMatchScore(m.id, entry.a, entry.b);
    setMatches(getMatches());
  };

  return (
    <div className="container section">
      <div className="page-header" style={{ paddingTop: 0 }}>
        <div>
          <h1>Manage Results</h1>
          <p className="muted">Enter final scores to complete matches and update the leaderboard.</p>
        </div>
        <Link to="/admin" className="btn btn-ghost btn-sm">← Back to Dashboard</Link>
      </div>

      <div className="stack">
        {matches.map(m => {
          const current = scores[m.id] || { a: m.scoreA ?? "", b: m.scoreB ?? "" };
          return (
            <div
              key={m.id}
              className="card card-body"
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16
              }}
            >
              <div>
                <span className="muted small">{m.game} · {formatDate(m.date)} · {m.time}</span>
                <h3 style={{ marginTop: 4 }}>{m.teamA} vs {m.teamB}</h3>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  type="number"
                  min="0"
                  className="input"
                  style={{ width: 76, textAlign: "center" }}
                  placeholder="0"
                  value={current.a}
                  onChange={e => setScores({ ...scores, [m.id]: { ...current, a: e.target.value } })}
                />
                <strong>-</strong>
                <input
                  type="number"
                  min="0"
                  className="input"
                  style={{ width: 76, textAlign: "center" }}
                  placeholder="0"
                  value={current.b}
                  onChange={e => setScores({ ...scores, [m.id]: { ...current, b: e.target.value } })}
                />
                <button className="btn btn-primary btn-sm" onClick={() => handleSaveResult(m)}>
                  {m.status === "Completed" ? "Update" : "Save Result"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}