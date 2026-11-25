# ARENA — Esports Tournament Management Portal

**ARENA** is a frontend esports tournament management platform built with React, Vite, and browser `localStorage`. It allows players to browse tournaments, form teams, register for events, and track live standings, while giving administrators a full control panel to manage tournaments, approvals, match schedules, and leaderboard results.

---

## Features

### Public & Competitive Views
* **Tournament Discovery:** Browse tournaments across *Valorant*, *BGMI*, *Counter-Strike 2*, *Call of Duty*, and *Fortnite* with real-time game filtering and keyword search.
* **Tournament Details:** View prize pools, dates, slot availability (`joined/slots`), match schedules, and register a squad directly.
* **Dynamic Leaderboard:** Features a Top 3 Podium showcase, game-specific filter chips, and ranked team standings sorted by points and wins.

### Player Portal
* **Authentication & Sessions:** Client-side signup and login (`arena_current`) with password-stripped session objects and protected routes.
* **Player Dashboard:** Overview of total registrations, approved entries, pending approvals, active teams, and upcoming matches.
* **Squad & Profile Management:** Track registration statuses, view team rosters and match history, and customize gamer tags and primary games.

### Admin Control Panel
* **Platform Overview:** Live metrics for total players, tournaments, registrations, upcoming matches, and pending approval alerts.
* **Manage Tournaments:** Create new tournaments or delete existing ones (automatically cascading cleanup to linked registrations and matches).
* **Approvals & Registrations:** Filter applications (`All`, `Pending`, `Approved`, `Rejected`) and approve or reject team entries with automatic slot adjustments.
* **Match Scheduling & Results:** Schedule upcoming fixtures and record final scores—automatically awarding `+100 PTS` and `+1 Win` to the winning team on the leaderboard.

---

## Tech Stack

* **Frontend Framework:** React 18, React Router DOM
* **Build Tool:** Vite 5
* **Icons:** Lucide React
* **Styling:** Custom CSS3 (`src/style.css`) with CSS custom properties and responsive CSS Grid layouts
* **Persistence:** Browser `localStorage` (`src/script.js`)

---

## Project Structure

```text
ARENA/
├── public/
│   └── _redirects          # SPA fallback routing for Netlify
├── src/
│   ├── App.jsx             # Root router, session state, and role-based route guards
│   ├── components.jsx      # Reusable UI components (Navbar, Footer, TournamentCard, PageHeader)
│   ├── main.jsx            # React DOM entry point
│   ├── pages.jsx           # Public pages, Auth views, Player Portal, and Admin pages
│   ├── script.js           # localStorage data layer, seed data, auth, and CRUD helpers
│   └── style.css           # Dark theme design tokens, layouts, and responsive breakpoints
├── index.html              # HTML entry shell & Google Fonts (Rajdhani, Inter)
├── package.json            # Dependencies and npm scripts
└── vite.config.js          # Vite configuration
