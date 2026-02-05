# 3D Commerce App - Minimal Runnable Installer

A minimal, working web application with a non-technical installer wizard.

## How to Run

```bash
# 1. Navigate to app directory
cd app

# 2. Install dependencies
npm install

# 3. Start the server
npm start

# 4. Open in browser
http://localhost:3000
```

## What Happens

### First Run
- Opens installer wizard
- Complete 5 simple steps
- Saves configuration
- Shows dashboard

### After Setup
- Browser reload → dashboard (not installer)
- Server restart → dashboard
- Login with admin email

### Re-run Setup
- Click "Re-run Setup" in dashboard
- Configuration is erased
- Installer runs again

## Tech Stack

| Component | Choice | Reason |
|-----------|--------|--------|
| Backend | Express | Simple, minimal |
| Frontend | Vanilla JS | No build step |
| Auth | Email session | No external deps |
| Storage | JSON file | No database needed |

## Files

```
app/
├── server/
│   ├── index.js      # Express server
│   ├── config.js     # Config read/write
│   └── data/
│       └── config.json   # Created on install
├── client/
│   ├── index.html    # HTML + CSS
│   └── src/
│       └── app.js    # Installer + Dashboard
└── package.json
```

## Known Limitations

- Single admin (no multi-user)
- In-memory sessions (restart = logout)
- No password (email-only auth)
- Minimal styling

These are intentional for Day-1 simplicity.
