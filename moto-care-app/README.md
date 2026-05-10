# 🏍️ MotoCare

A personal motorcycle maintenance tracker built with React + Vite. Keep a digital logbook for every bike you own — track services, maintenance parts, gas fills, costs and get reminders when the next service is due.

---

## Features

- Add multiple bikes with photo, plate, brand, model, year and current KM
- **Services** — log full services with parts list and labor cost, auto-schedules next service (+1 year / +5,000 km)
- **Maintenance** — track individual items (oil, brakes, tires, chain, spark plugs, etc.) with cost and next due date
- **Gas** — log every fill with liters and price, view monthly bar charts and yearly totals
- **Overview** — dashboard per bike with warnings when service is due soon
- All data saved locally in the browser (localStorage) — no account needed

---

## Requirements

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)
- Git

---

## Clone & Run on a New PC

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 2. Go into the project folder
cd YOUR_REPO_NAME/moto-care-app

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

Then open your browser at **http://localhost:5173**

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production (output in `dist/`) |
| `npm run preview` | Preview the production build locally |

---

## Save Changes Back to GitHub

After you make changes to the code:

```bash
# 1. Stage all changed files
git add .

# 2. Commit with a message describing what you changed
git commit -m "Your message here"

# 3. Push to GitHub
git push
```

---

## Project Structure

```
moto-care-app/
├── public/                  # Static assets
├── src/
│   ├── context/
│   │   └── BikeContext.jsx  # Global state + localStorage persistence for all bikes
│   ├── components/
│   │   ├── Navbar.jsx       # Top navigation bar with bikes dropdown
│   │   ├── BikeCard.jsx     # Card shown in the home page grid
│   │   └── tabs/
│   │       ├── OverviewTab.jsx    # Stats, next service warnings, recent maintenance
│   │       ├── ServicesTab.jsx    # Full service log with parts and costs
│   │       ├── MaintenanceTab.jsx # Individual part changes (brakes, tires, oil, etc.)
│   │       └── GasTab.jsx         # Gas fill log with monthly/yearly charts
│   ├── pages/
│   │   ├── HomePage.jsx      # 2-column grid of all bikes
│   │   ├── AddBikePage.jsx   # Form to add a new bike
│   │   └── BikeDetailPage.jsx # Bike page with 4 tabs and KM editor
│   ├── App.jsx               # Route definitions
│   ├── main.jsx              # App entry point (Router + Context providers)
│   └── index.css             # All styles
├── package.json              # Dependencies and scripts
└── vite.config.js            # Vite configuration
```

---

## Tech Stack

| Library | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI framework |
| [Vite](https://vite.dev/) | Build tool and dev server |
| [React Router DOM](https://reactrouter.com/) | Client-side routing |
| [Recharts](https://recharts.org/) | Bar charts for gas spending |
