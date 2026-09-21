# MediCare — Hospital Management System

> 🇹🇷 **Türkçe dokümantasyon: [README.tr.md](README.tr.md)**

A role-based hospital management web application built with React 19, React Router v7, Tailwind CSS v4 and Vite. Four user roles — **Patient**, **Doctor**, **Nurse** and **Front Desk** — each get their own navigation, permissions and workspace.

> ### ⚠️ This is a frontend-only prototype
>
> There is **no backend, no database and no real SMS provider**. Every record comes from [`src/data/mockData.js`](src/data/mockData.js) and lives in the browser's `localStorage`. Authentication is simulated (a fixed demo verification code), and the role checks run entirely in the browser, so they are a **UX guard, not a security boundary**.
>
> The accompanying SRS and SDD describe a full client–server system with a relational database, server-side RBAC and an external SMS service. This repository is the **working interface prototype** of that design — see [docs/SRS.md](docs/SRS.md) and [docs/SDD.md](docs/SDD.md).

---

## Table of contents

- [Academic context](#academic-context)
- [Quick start](#quick-start)
- [Demo accounts](#demo-accounts)
- [Roles and pages](#roles-and-pages)
- [How it works](#how-it-works)
- [User flows](#user-flows)
- [Business rules](#business-rules)
- [Project structure](#project-structure)
- [Documentation](#documentation)
- [Known limitations](#known-limitations)

---

## Academic context

Term project for **CMPE 313 / SENG 214 — Software Engineering**, TED University, Spring 2026.
**Section 3 — Team 6** (5 members). The team followed the **Waterfall** model: requirements were captured in an SRS, design decisions in an SDD, and the UI prototype in this repository.

---

## Quick start

**Requirements:** Node.js **20.19+** or **22.12+** (Vite 8 requirement).

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` and redirects to `/giris` (the sign-in page).

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint over the project |

**Resetting the data:** all state is persisted in `localStorage`. To return to the seeded mock data, open DevTools → Application → Local Storage → delete the site's entries (or run `localStorage.clear()` in the console) and reload.

---

## Demo accounts

Sign-in is a two-step flow: **National ID + role**, then a **6-digit SMS code**. The code is not really sent — it is displayed on screen.

| Role | National ID | Verification code |
| --- | --- | --- |
| Patient | `12345678901` | `123456` |
| Doctor | `45678901234` | `123456` |
| Nurse | `89012345678` | `123456` |
| Front Desk | `01234567890` | `123456` |

The sign-in page has one-click autofill buttons for each of these. Additional seeded accounts (2 more patients, 3 more doctors, 1 more nurse, 1 more front-desk user) are listed in [`src/data/mockData.js`](src/data/mockData.js).

Account recovery (`/hesap-kurtar`) uses a **different** demo code: `654321`. It requires a National ID and the matching registered phone number.

> All identity numbers, names and medical data in this project are **fictional**. No real patient data is involved.

---

## Roles and pages

| Role | Route prefix | Pages |
| --- | --- | --- |
| **Patient** (`hasta`) | `/hasta` | Dashboard, Book Appointment, My Appointments, Test Results, Prescriptions, Family Profiles, Help (FAQ) |
| **Doctor** (`doktor`) | `/doktor` | Dashboard, Schedule, Patient Records, Prescriptions |
| **Nurse** (`hemsire`) | `/hemsire` | Dashboard, Department Schedule, Patient Records |
| **Front Desk** (`onBuro`) | `/on-buro` | Dashboard, Appointments, Manual Entry, Test Status, Caregiver Access, Staff Management, Doctor Schedules |

Public routes (no sign-in required): `/giris` (sign in), `/kayit` (register), `/hesap-kurtar` (account recovery), `/sss` (FAQ).
Shared route (any signed-in role): `/profil`.

Each role's menu is declared once in [`src/components/navigation.js`](src/components/navigation.js) (`roleMenus`), together with its accent colour and landing page (`roleMeta`).

---

## How it works

### Render path

```
main.jsx
  └── App.jsx
        └── AppProvider          ← all shared state + actions (context)
              └── BrowserRouter
                    └── Routes
                          └── ProtectedRoute   ← signed in? role allowed?
                                └── Page
                                      └── Layout → Navbar + <main> + footer
```

### State and persistence

[`src/context/AppContext.jsx`](src/context/AppContext.jsx) is the single source of truth. It holds nine pieces of state, each hydrated from `localStorage` on first render and written back through its own `useEffect`:

`aktifKullanici` (signed-in user) · `aktifProfil` (dependent being viewed) · `randevular` (appointments) · `receteler` (prescriptions) · `bagimliProfiller` (dependent profiles) · `bakimOnayi` (caregiver consents) · `denetimKayitlari` (audit log) · `doktorProgramlari` (doctor schedules) · `personelListesi` (all users)

**Mutable vs. read-only data.** This distinction explains a lot of the app's behaviour:

- **Mutable** — the nine keys above. They start from `mockData.js`, then live in context and `localStorage`. Changes survive a page reload.
- **Read-only** — `testSonuclari`, `tibbiKayitlar`, `bolumler`, `sssIcerigi` are imported directly into the pages that need them. They are never written to, so they always read back as seeded. (This is why a test result never changes status in the UI.)

### Access control

[`src/components/ProtectedRoute.jsx`](src/components/ProtectedRoute.jsx) wraps every private route:

1. No `aktifKullanici` → redirect to `/giris`.
2. Signed in but the role is not in the route's `roller` list → render an **Access Denied** card showing the current role.
3. Otherwise → render the page.

This runs in the browser only. A real deployment would need the same checks enforced server-side.

---

## User flows

### Patient — book an appointment (`/hasta/randevu-al`)

A four-step wizard:

1. **Department** — the eight departments from `bolumler`. Departments with no doctor assigned are disabled.
2. **Doctor** — doctors in that department. A doctor whose schedule has `musait: false` (on coverage transfer) is shown but not selectable.
3. **Date and time** — only dates the doctor published in `musaitSaatler`, and only slots not already taken. The available slots are computed as *the doctor's published slots for that date* **minus** *appointments on that date whose status is not `iptalEdildi`* — so double-booking is impossible.
4. **Confirm** — optional notes, then `randevuAl()` creates the record with status `onaylandi` and writes an audit entry.

If a dependent profile is active, the appointment is created for the dependent (`aktifHastaId`), not the account holder.

### Patient — cancel or reschedule (`/hasta/randevularim`)

Appointments are listed newest-first with tab filters (All / Upcoming / Past / Cancelled). The **Cancel** and **Reschedule** buttons appear only on appointments that are still in the future and still `onaylandi`.

- **Cancel** → `randevuIptal()`. Rejected with a message if the appointment starts in **less than one hour**. Otherwise the status becomes `iptalEdildi` — the record is kept, never deleted, and its slot is released back into availability.
- **Reschedule** → `randevuYenidenZamanla()`. Offers the doctor's remaining free slots, then updates date and time and resets the status to `onaylandi`.

### Patient — test results (`/hasta/test-sonuclari`)

Results are shown parameter by parameter against their reference range, with out-of-range values highlighted. **Download** writes a plain-text summary via a blob URL; **Print** opens a formatted print window. Tests with status `bekliyor` show no values.

### Patient — family profiles (`/hasta/bagimli-profiller`)

Add a dependent (child, parent, spouse…) and switch into their profile. While a dependent is active, the navbar shows a dependent badge and every patient page reads that dependent's data via `aktifHastaId`. Switching back requires no new sign-in.

### Doctor — prescriptions (`/doktor/recete-yonetimi`)

Lists the prescriptions the signed-in doctor issued. Selecting one shows its medications (name, dose, frequency, duration, instructions); editing rewrites the medication list through `receteGuncelle()`, which stamps `guncellemeTarihi` and writes an audit entry.

### Doctor / Nurse — patient records

Doctors see records for patients they have appointments with; nurses see their department's. Opening a record calls `denetimEkle()`, so every access to a medical record is logged.

### Front Desk — manual appointment (`/on-buro/manuel-randevu`)

Look up a patient by National ID, then pick department → doctor → date → slot, using exactly the same availability logic as patient booking. The created record is flagged `manuelGiris: true` and stores the operator's id in `girenPersonel`.

### Front Desk — doctor schedules and coverage (`/on-buro/doktor-program`)

Toggle a doctor's availability, or run a **coverage transfer**: pick an unavailable doctor and a replacement, and `doktorDevirAta()` moves **all of the first doctor's `onaylandi` appointments** to the second, adding a `devirNotu` to each record. The source doctor is then marked unavailable so no new bookings land on them.

### Front Desk — test status (`/on-buro/test-durumu`)

A deliberately restricted lookup: searching a patient returns only test **name, date and status**. Result values, notes and diagnoses are never included in the projection. Each search is written to the audit log.

### Front Desk — caregiver consent (`/on-buro/bakim-veren`)

Records written consent for a caregiver (name, ID, relationship) against a patient, stamped with the approving staff member and the date.

### Front Desk — staff and roles (`/on-buro/personel-yonetimi`)

Search users by name or ID, filter by role, and change a role through `personelRoluGuncelle()` — logged to the audit trail.

---

## Business rules

| Rule | Behaviour | Where |
| --- | --- | --- |
| **1-hour cancellation window** | An appointment cannot be cancelled less than one hour before it starts | `AppContext.jsx` → `randevuIptal()` |
| **15-minute inactivity timeout** | Mouse, keyboard, scroll and touch events reset a timer; after 15 minutes of silence the session is closed (checked every 30 s) | `AppContext.jsx` → inactivity `useEffect` |
| **No double booking** | A slot already held by a non-cancelled appointment is filtered out of availability | `RandevuAl.jsx`, `ManuelRandevu.jsx`, `Randevularim.jsx` |
| **Audit logging** | Sign-in, booking, cancellation, rescheduling, prescription updates, record access, test-status lookups, role changes, coverage transfers and caregiver consents all append to `denetimKayitlari` | `AppContext.jsx` → `denetimEkle()` |
| **Cancellations are soft** | Status becomes `iptalEdildi`; the record is retained | `AppContext.jsx` → `randevuIptal()` |
| **Dependent context** | `aktifHastaId` resolves to the active dependent when one is selected, otherwise the account holder | `AppContext.jsx` |
| **Front-desk data minimisation** | Test status lookup returns status only, never clinical values | `TestDurumu.jsx` |

---

## Project structure

```
.
├── index.html                  Vite entry document
├── vite.config.js              React + Tailwind v4 plugins
├── eslint.config.js            Flat ESLint config (react-hooks, react-refresh)
├── public/                     favicon.svg, icons.svg
├── docs/                       Project documentation (see below)
└── src/
    ├── main.jsx                React root
    ├── App.jsx                 All routes + role guards
    ├── index.css / App.css     Tailwind import and theme tokens
    ├── assets/                 hero.png and logos
    ├── components/
    │   ├── Layout.jsx          Navbar + main + footer shell
    │   ├── Navbar.jsx          Role-aware navigation, dependent badge, sign out
    │   ├── navigation.js       roleMeta and roleMenus (single source for menus)
    │   ├── ProtectedRoute.jsx  Auth + role guard
    │   ├── ui.jsx              Button, Surface, SectionCard, PageHeader, Badge,
    │   │                       StatCard, EmptyState, InfoBanner, Field, Tabs,
    │   │                       Modal, DataTable, Stepper
    │   ├── AppIcon.jsx         Named-icon registry over Heroicons
    │   ├── AuthShell.jsx       Split layout for the auth pages
    │   ├── AuthField.jsx       Re-export of Field for auth forms
    │   └── ui-helpers.js       cn() class joiner, shared input class
    ├── context/
    │   └── AppContext.jsx      All shared state, actions and business rules
    ├── data/
    │   └── mockData.js         Seed data for every entity
    ├── pages/
    │   ├── Giris.jsx           Sign in (ID + role → SMS code)
    │   ├── Kayit.jsx           Patient self-registration
    │   ├── HesapKurtar.jsx     Account recovery
    │   ├── SSS.jsx             FAQ
    │   ├── Profil.jsx          Shared profile editor
    │   ├── hasta/              6 patient pages
    │   ├── doktor/             4 doctor pages
    │   ├── hemsire/            3 nurse pages
    │   └── onBuro/             7 front-desk pages
    └── utils/
        └── helpers.js          Date formatting, lookups, status labels and colours
```

---

## Documentation

| Document | Contents |
| --- | --- |
| [docs/USE-CASES.md](docs/USE-CASES.md) | UML use-case diagram (Mermaid) and a table mapping every use case to routes, files and functions |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Data model, the full `AppContext` API, state machines, persistence, the UI system, and how to attach a real backend |
| [docs/SRS.md](docs/SRS.md) | Software Requirements Specification — use cases, functional and non-functional requirements |
| [docs/SDD.md](docs/SDD.md) | Software Design Document — layered architecture, module decomposition, data dictionary, design rationale |
| [docs/PRESENTATION.md](docs/PRESENTATION.md) | Final presentation content — methodology, elicitation approach, UML models |
| [README.tr.md](README.tr.md) | Turkish version of this document |

> The original SRS, SDD and presentation PDFs are **not** included in this repository — their cover pages carry team members' names and student ID numbers. The Markdown documents above reproduce their technical content without personal data.

---

## Known limitations

- **No real authentication.** The verification code is a constant and no password is ever checked. A `sifre` field exists in the mock data but the sign-in flow does not use it.
- **No server, no database.** Everything is browser state; clearing site data wipes it, and nothing is shared between devices or users.
- **Role checks are client-side only.** They prevent accidental navigation, not a determined user.
- **No SMS, no notifications.** The SRS specifies SMS verification and appointment reminders; neither is wired to a provider.
- **No automated tests.** There is no test runner configured.
- **Seed calendar is fixed and in the past.** Doctor availability is seeded for **5–13 May 2026** only. The booking wizard does not filter out past dates, so a booking made today lands in the past, dashboards show no upcoming visits, and the Cancel/Reschedule buttons never appear. Update `doktorProgramlari` in `mockData.js` to a future window to exercise those flows.
- **Some data is immutable.** Test results, medical records, departments and FAQ entries are read-only imports, so actions never change them.
- **Mixed-language identifiers.** Code identifiers and route paths are Turkish (`randevu`, `hasta`, `recete`); all user-facing text is English.

---

## License

No license file is included. Coursework — all rights reserved by the authors.
