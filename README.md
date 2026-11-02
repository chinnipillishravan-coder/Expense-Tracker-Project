# Pennywise Expense Tracker

A responsive React expense tracker with separate sign-in, account creation, and dashboard pages. Your account, expenses, and monthly budget are saved in this browser using `localStorage`; no backend or cloud sync is used.

## Run locally

1. Install Node.js.
2. From this folder, run `npm install`.
3. Run `npm run dev` and open the local URL printed by Vite.
4. Create an account to start tracking expenses.

Run `npm run build` to create a production build in `dist/`.

## GitHub Pages deployment

Enable GitHub Pages once in the repository settings by selecting **Settings →
Pages → Build and deployment → Source → GitHub Actions**. The workflow then
deploys every push to `main` at
https://chinnipillishravan-coder.github.io/Expense-Tracker-Project/.

## Included

- Sign up and sign in, with locally stored PBKDF2 password hashes.
- Overview dashboard with spending totals, monthly budget progress, category breakdown, and a six-month spending chart.
- Add, edit, delete, search, and filter expenses by category and month.
- CSV export for all expenses or the currently filtered transaction list.
- Responsive navigation and layouts for desktop and mobile.

## Local data note

This is a frontend-only project. Passwords are stored as salted hashes, but expense and account data live in browser storage on this device. They are not encrypted at rest, synchronized to a server, or protected from someone with access to this browser profile. Clearing browser storage removes the saved account and expense data.
