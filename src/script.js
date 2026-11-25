/* ARENA - Local Storage Data Layer
   College demonstration project.
   Local Storage authentication is NOT secure for production.
*/

export const GAMES = [
  "Valorant",
  "BGMI",
  "Counter-Strike 2",
  "Call of Duty",
  "Fortnite"
];

// Demo admin account
export const DEMO_ADMIN = {
  email: "admin@arena.gg",
  password: "admin123"
};

/* ---------- Storage Helpers ---------- */

export const load = (key, fallback = []) => {
  try {
    return JSON.parse(localStorage.getItem("arena_" + key)) ?? fallback;
  } catch {
    return fallback;
  }
};

export const save = (key, value) => {
  localStorage.setItem("arena_" + key, JSON.stringify(value));
};

export const newId = (prefix) => prefix + Date.now();

export const getTournaments = () => load("tournaments");
export const getMatches = () => load("matches");
export const getRegistrations = () => load("registrations");
export const getTeams = () => load("teams");
export const getUsers = () => load("users");

export const getLeaderboard = () =>
  load("leaderboard").sort((a, b) => b.points - a.points);

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  });

/* ---------- Seed Sample Data ---------- */

export function seedData() {
  if (localStorage.getItem("arena_tournaments")) return;

  save("users", [
    {
      id: "u1",
      name: "Arena Admin",
      email: DEMO_ADMIN.email,
      password: DEMO_ADMIN.password,
      role: "admin"
    },
    {
      id: "u2",
      name: "Aarav Sharma",
      email: "aarav@arena.gg",
      password: "player123",
      role: "user"
    },
    {
      id: "u3",
      name: "Rohan Verma",
      email: "rohan@arena.gg",
      password: "player123",
      role: "user"
    },
    {
      id: "u4",
      name: "Karthik Nair",
      email: "karthik@arena.gg",
      password: "player123",
      role: "user"
    },
    {
      id: "u5",
      name: "Ananya Rao",
      email: "ananya@arena.gg",
      password: "player123",
      role: "user"
    }
  ]);

  save("tournaments", [
    { id: "t1", name: "Valorant Champions Open", game: "Valorant", prize: "₹5,00,000", date: "2026-11-22", slots: 32, joined: 24, status: "Open" },
    { id: "t2", name: "BGMI Masters Series", game: "BGMI", prize: "₹10,00,000", date: "2026-11-04", slots: 48, joined: 48, status: "Live" },
    { id: "t3", name: "CS2 Pro Showdown", game: "Counter-Strike 2", prize: "₹7,50,000", date: "2026-12-05", slots: 16, joined: 9, status: "Open" },
    { id: "t4", name: "Warzone Invitational", game: "Call of Duty", prize: "₹3,00,000", date: "2026-12-12", slots: 24, joined: 10, status: "Open" },
    { id: "t5", name: "Fortnite Battle Royale Cup", game: "Fortnite", prize: "₹2,50,000", date: "2026-11-28", slots: 40, joined: 31, status: "Open" },
    { id: "t6", name: "Valorant Rising Stars", game: "Valorant", prize: "₹1,50,000", date: "2026-10-18", slots: 16, joined: 16, status: "Completed" },
    { id: "t7", name: "BGMI Winter Clash", game: "BGMI", prize: "₹4,00,000", date: "2026-12-20", slots: 32, joined: 12, status: "Open" },
    { id: "t8", name: "CS2 Autumn Cup", game: "Counter-Strike 2", prize: "₹2,00,000", date: "2026-10-25", slots: 16, joined: 16, status: "Completed" }
  ]);

  const match = (id, tournamentId, game, teamA, teamB, date, time, scores) => ({
    id,
    tournamentId,
    game,
    teamA,
    teamB,
    date,
    time,
    scoreA: scores ? scores[0] : null,
    scoreB: scores ? scores[1] : null,
    status: scores ? "Completed" : "Upcoming"
  });

  save("matches", [
    match("m1", "t1", "Valorant", "Team Nova", "Shadow Wolves", "2026-11-22", "18:00"),
    match("m2", "t1", "Valorant", "Apex Legion", "Night Owls", "2026-11-22", "20:00"),
    match("m3", "t2", "BGMI", "Royal Reapers", "Phoenix Rising", "2026-11-04", "17:00", [42, 38]),
    match("m4", "t2", "BGMI", "Royal Reapers", "Storm Riders", "2026-11-08", "17:00"),
    match("m5", "t3", "Counter-Strike 2", "Iron Wolves", "Cyber Hawks", "2026-12-05", "16:00"),
    match("m6", "t5", "Fortnite", "Storm Riders", "Zero Gravity", "2026-11-28", "19:00"),
    match("m7", "t6", "Valorant", "Team Nova", "Apex Legion", "2026-10-18", "17:00", [13, 9]),
    match("m8", "t8", "Counter-Strike 2", "Iron Wolves", "Cyber Hawks", "2026-10-25", "15:00", [16, 12]),
    match("m9", "t4", "Call of Duty", "Ghost Squad", "Delta Force", "2026-12-12", "18:00")
  ]);

  save("leaderboard", [
    { id: "l1", team: "Team Nova", game: "Valorant", wins: 14, points: 1420 },
    { id: "l2", team: "Royal Reapers", game: "BGMI", wins: 12, points: 1310 },
    { id: "l3", team: "Iron Wolves", game: "Counter-Strike 2", wins: 11, points: 1185 },
    { id: "l4", team: "Apex Legion", game: "Valorant", wins: 9, points: 980 },
    { id: "l5", team: "Storm Riders", game: "Fortnite", wins: 8, points: 905 },
    { id: "l6", team: "Ghost Squad", game: "Call of Duty", wins: 7, points: 820 },
    { id: "l7", team: "Cyber Hawks", game: "Counter-Strike 2", wins: 6, points: 740 },
    { id: "l8", team: "Night Owls", game: "Valorant", wins: 5, points: 655 }
  ]);

  save("registrations", [
    { id: "r1", tournamentId: "t1", userId: "u2", teamName: "Night Owls", status: "Approved" },
    { id: "r2", tournamentId: "t3", userId: "u3", teamName: "Iron Wolves", status: "Pending" },
    { id: "r3", tournamentId: "t1", userId: "u4", teamName: "Team Nova", status: "Approved" },
    { id: "r4", tournamentId: "t5", userId: "u5", teamName: "Storm Riders", status: "Pending" }
  ]);

  save("teams", [
    {
      id: "team1",
      name: "Night Owls",
      ownerId: "u2",
      members: ["Aarav Sharma", "Rohan Verma", "Karthik Nair", "Ishaan Patel", "Vikram Joshi"]
    },
    {
      id: "team2",
      name: "Iron Wolves",
      ownerId: "u3",
      members: ["Rohan Verma", "Kabir Mehta", "Devansh Gupta", "Siddharth Menon"]
    }
  ]);
}

/* ---------- Authentication ---------- */

// Password is excluded from the saved login session.
const toSession = ({ password, ...user }) => user;

export const getCurrentUser = () => load("current", null);

export function signup(name, email, password) {
  name = name.trim();
  email = email.trim().toLowerCase();

  if (name.length < 2) {
    return { error: "Please enter your name." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const users = getUsers();

  if (users.some(u => u.email === email)) {
    return { error: "This email is already registered." };
  }

  const user = {
    id: newId("u"),
    name,
    email,
    password,
    role: "user"
  };

  const session = toSession(user);

  save("users", [...users, user]);
  save("current", session);

  return { user: session };
}

export function login(email, password) {
  email = email.trim().toLowerCase();

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  const user = getUsers().find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return { error: "Incorrect email or password." };
  }

  const session = toSession(user);
  save("current", session);

  return { user: session };
}

export const logout = () => {
  localStorage.removeItem("arena_current");
};

/* ---------- Tournament Registration ---------- */

// Returns an error message or null on success.
export function registerForTournament(tournament, user, teamName) {
  if (!user) return "Please login first.";

  const name = teamName.trim();

  if (name.length < 3) {
    return "Team name must be at least 3 characters.";
  }

  const registrations = getRegistrations();

  if (registrations.some(
    r => r.tournamentId === tournament.id && r.userId === user.id
  )) {
    return "You are already registered for this tournament.";
  }

  const tournaments = getTournaments();
  const t = tournaments.find(x => x.id === tournament.id);

  if (!t) return "Tournament not found.";
  if (t.status !== "Open") return "Registrations are closed.";
  if (t.joined >= t.slots) return "All slots are filled.";

  t.joined += 1;
  save("tournaments", tournaments);

  save("registrations", [
    ...registrations,
    {
      id: newId("r"),
      tournamentId: t.id,
      userId: user.id,
      teamName: name,
      status: "Pending"
    }
  ]);

  const teams = getTeams();

  if (!teams.some(x => x.ownerId === user.id && x.name === name)) {
    save("teams", [
      ...teams,
      {
        id: newId("team"),
        name,
        ownerId: user.id,
        members: [user.name]
      }
    ]);
  }

  return null;
}

/* ---------- Admin Actions ---------- */

export function createTournament({ name, game, prize, date, slots }) {
  const tournaments = getTournaments();
  const newTournament = {
    id: newId("t"),
    name: name.trim(),
    game,
    prize: prize.trim(),
    date,
    slots: Number(slots),
    joined: 0,
    status: "Open"
  };
  save("tournaments", [newTournament, ...tournaments]);
  return newTournament;
}

export function deleteTournament(id) {
  save("tournaments", getTournaments().filter(t => t.id !== id));
  save("registrations", getRegistrations().filter(r => r.tournamentId !== id));
  save("matches", getMatches().filter(m => m.tournamentId !== id));
}

export function updateRegistrationStatus(regId, status) {
  const registrations = getRegistrations();
  const target = registrations.find(r => r.id === regId);
  if (!target) return;

  const prevStatus = target.status;
  target.status = status;
  save("registrations", registrations);

  // Free up a slot if rejected after being counted
  if (prevStatus !== "Rejected" && status === "Rejected") {
    const tournaments = getTournaments();
    const t = tournaments.find(x => x.id === target.tournamentId);
    if (t && t.joined > 0) {
      t.joined -= 1;
      save("tournaments", tournaments);
    }
  }
}

export function createMatch({ tournamentId, teamA, teamB, date, time }) {
  const tournaments = getTournaments();
  const t = tournaments.find(x => x.id === tournamentId);
  const newMatch = {
    id: newId("m"),
    tournamentId,
    game: t ? t.game : GAMES[0],
    teamA: teamA.trim(),
    teamB: teamB.trim(),
    date,
    time,
    scoreA: null,
    scoreB: null,
    status: "Upcoming"
  };
  save("matches", [newMatch, ...getMatches()]);
  return newMatch;
}

export function updateMatchScore(matchId, scoreA, scoreB) {
  const matches = getMatches();
  const m = matches.find(x => x.id === matchId);
  if (!m) return;

  m.scoreA = Number(scoreA);
  m.scoreB = Number(scoreB);
  m.status = "Completed";
  save("matches", matches);

  // Award +100 pts and +1 win to the winning team on the leaderboard
  const winner = m.scoreA > m.scoreB ? m.teamA : m.scoreB > m.scoreA ? m.teamB : null;
  if (winner) {
    const lb = load("leaderboard");
    const row = lb.find(r => r.team.toLowerCase() === winner.toLowerCase());
    if (row) {
      row.wins += 1;
      row.points += 100;
    } else {
      lb.push({ id: newId("l"), team: winner, game: m.game, wins: 1, points: 100 });
    }
    save("leaderboard", lb);
  }
}