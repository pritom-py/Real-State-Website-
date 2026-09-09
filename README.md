<div align="center">

<img src="https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js" />
<img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript" />
<img src="https://img.shields.io/badge/Prisma-5.x-2D3748?style=for-the-badge&logo=prisma" />
<img src="https://img.shields.io/badge/NextAuth.js-5.x-purple?style=for-the-badge&logo=auth0" />
<img src="https://img.shields.io/badge/TailwindCSS-4.x-38BDF8?style=for-the-badge&logo=tailwindcss" />

# 🏡 Alexandra Voss — Luxury Real Estate Website

**A full-stack, production-ready real estate brokerage website built with Next.js 16, featuring a complete Admin Panel, property listings, lead management, and a stunning public-facing frontend.**

[Live Demo](#) · [Report Bug](https://github.com/pritom-py/Real-State-Website-/issues) · [Request Feature](https://github.com/pritom-py/Real-State-Website-/issues)

</div>

---

## 📸 Screenshots

| Public Homepage | Property Listings | Admin Dashboard |
|---|---|---|
| Luxury hero with CTA | Filterable property grid | Stats, charts & leads |

---

## ✨ Features

### 🌐 Public Website
- **Homepage** — Hero section, featured properties, broker stats, testimonials
- **Property Listings** — Filter by beds, baths, type, status & keyword search
- **Property Detail Pages** — Full gallery, amenities, neighborhood info
- **Neighborhood Guides** — Beverly Hills, Bel-Air, Malibu with market data
- **Insights / Blog** — Market analysis articles with rich text editor
- **Testimonials** — Client reviews with star ratings
- **Contact Form** — Lead capture with validation
- **Sold Properties** — Portfolio of past transactions
- **Home Valuation** — Valuation request form

### 🔐 Admin Panel (`/admin`)
- **Secure Login** — JWT-based authentication via NextAuth.js
- **Dashboard** — Property stats, lead counts, charts (Recharts)
- **Properties CRUD** — Add, edit, delete properties with image URLs
- **Leads Management** — View, filter and update lead status
- **Testimonials CRUD** — Add and delete client testimonials
- **Insights / Articles** — Rich-text editor (TipTap), publish/draft toggle
- **Media & Press** — Manage press mentions
- **Neighborhoods** — View all neighborhood pages
- **Settings** — Broker profile, social links, SEO metadata

### ⚙️ Technical
- **Mock Database Mode** — Runs fully without any database (demo mode)
- **Supabase Ready** — Drop in your Postgres connection string to go live
- **Edge Middleware** — Route protection at the CDN edge via NextAuth
- **Server Actions** — Forms submit without client-side JS API calls
- **SEO Optimized** — Dynamic metadata per page
- **Fully Responsive** — Mobile-first CSS design
- **Smooth Animations** — Framer Motion transitions

---

## 🗂️ Project Structure

```
bestbroker/
├── app/
│   ├── (admin)/              # Admin panel routes (protected)
│   │   └── admin/
│   │       ├── page.tsx          # Dashboard
│   │       ├── properties/       # Property CRUD
│   │       ├── leads/            # Lead management
│   │       ├── testimonials/     # Testimonials CRUD
│   │       ├── insights/         # Article editor
│   │       ├── neighborhoods/    # Neighborhood viewer
│   │       ├── media/            # Press mentions
│   │       └── settings/         # Site settings
│   ├── (auth)/               # Auth routes (login page)
│   │   └── admin/login/
│   ├── (public)/             # Public-facing pages
│   │   ├── page.tsx              # Homepage
│   │   ├── properties/           # Listings + detail pages
│   │   ├── neighborhoods/        # Neighborhood guides
│   │   ├── insights/             # Blog / market articles
│   │   ├── testimonials/         # Client reviews
│   │   ├── contact/              # Contact form
│   │   ├── sold/                 # Sold portfolio
│   │   └── valuation/            # Home valuation form
│   └── api/
│       ├── auth/[...nextauth]/   # NextAuth.js handler
│       └── leads/                # Lead submission API
├── components/
│   ├── layout/               # Navbar, Footer, AdminSidebar, AdminHeader
│   ├── property/             # PropertyCard, PropertyGrid, Filters
│   ├── admin/                # AdminCharts, AdminDeleteButton
│   └── ui/                   # Pagination, shared UI
├── lib/
│   ├── prisma.ts             # Prisma client (+ mock mode)
│   ├── mock-data.ts          # Demo data (properties, neighborhoods, etc.)
│   ├── auth.ts               # NextAuth configuration (server)
│   ├── auth-edge.ts          # NextAuth configuration (edge/middleware)
│   └── utils.ts              # Helpers (formatPrice, formatDate, slugify)
├── prisma/
│   ├── schema.prisma         # Full database schema
│   └── seed.ts               # Database seed script
├── middleware.ts             # Edge route protection
├── next.config.ts            # Next.js configuration
└── .env.local                # Environment variables (not committed)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- (Optional) A [Supabase](https://supabase.com) account for a real database

### 1. Clone the Repository

```bash
git clone https://github.com/pritom-py/Real-State-Website-.git
cd Real-State-Website-
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

Open `.env.local` and update the values:

```env
# ── Database (Supabase) ─────────────────────────────────────────────────────
# Get these from: Supabase Dashboard → Project → Settings → Database → Connection string
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# ── Authentication ──────────────────────────────────────────────────────────
# Generate a secret: openssl rand -base64 32
AUTH_SECRET="your-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# ── App ─────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ── Admin Seed Credentials (only used when running: npm run seed) ───────────
SEED_ADMIN_EMAIL="admin@alexandravoss.com"
SEED_ADMIN_PASSWORD="ChangeMe@2024!"
```

> **⚠️ Important:** Never commit `.env.local` to Git. It is already in `.gitignore`.

### 4. Run in Demo Mode (No Database Required)

The project includes a full **mock database** so you can run it immediately without Supabase:

```bash
npm run dev
```

Visit **http://localhost:3000** — the site is fully functional with demo data!

**Admin Panel Login (Demo Mode):**
| Field | Value |
|---|---|
| URL | http://localhost:3000/admin/login |
| Email | `admin@alexandravoss.com` |
| Password | `ChangeMe@2024!` |

---

## 🗄️ Database Setup (Optional — for Production)

If you want to connect a real Supabase PostgreSQL database:

### 1. Create a Supabase Project
Go to [supabase.com](https://supabase.com) → New Project → copy your connection strings into `.env.local`.

### 2. Push the Schema

```bash
npx prisma db push
```

### 3. Seed the Database

This creates the admin user and sample data:

```bash
npx prisma db seed
```

### 4. View Your Database (Optional)

```bash
npx prisma studio
```

Opens a visual database browser at http://localhost:5555.

---

## 🏗️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) + Vanilla CSS |
| **Database ORM** | [Prisma 5](https://www.prisma.io/) |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL) |
| **Authentication** | [NextAuth.js v5](https://authjs.dev/) (JWT + Credentials) |
| **Rich Text Editor** | [TipTap](https://tiptap.dev/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Forms** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Image Optimization** | Next.js Image + [Sharp](https://sharp.pixelplumbing.com/) |
| **Deployment** | [Vercel](https://vercel.com/) (recommended) |

---

## 🔐 Authentication Flow

```
User visits /admin/*
        │
        ▼
   middleware.ts        ← Edge middleware checks JWT session
        │
  ┌─────┴─────┐
  │ No Session │ ──────────► Redirect to /admin/login
  └─────┬─────┘
        │ Has Session
        ▼
  Admin Layout          ← Server-side session re-check
        │
        ▼
  Admin Dashboard ✅
```

**How it works:**
1. `middleware.ts` runs at the CDN edge (fastest possible protection)
2. `/admin/login` is **outside** the protected admin layout group `(admin)` — placed in `(auth)` instead — to prevent redirect loops
3. Passwords are hashed with **bcrypt** (cost factor 12)
4. Sessions use **JWT strategy** (no database sessions needed)

---

## 🌐 Deployment to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "feat: initial production deployment"
git push origin main
```

### 2. Import to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Add all environment variables from `.env.local`
4. Click **Deploy**

### 3. Run Database Seed (After Deploy)
```bash
DIRECT_URL="your-direct-url" npx prisma db seed
```

---

## 📝 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Generate Prisma client + build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma db push` | Push schema to database |
| `npx prisma db seed` | Seed database with sample data |
| `npx prisma studio` | Open Prisma visual database browser |

---

## 🎨 Design System

The design uses a curated luxury palette defined in `app/globals.css`:

| Token | Value | Usage |
|---|---|---|
| `--ivory` | `#F8F5F0` | Page backgrounds |
| `--charcoal` | `#1C1C1C` | Primary text, dark elements |
| `--gold` | `#B8975A` | Accent, CTAs, highlights |
| `--warm-gray` | `#6B6560` | Secondary text |
| `--font-serif` | Cormorant Garamond | Headings, luxury titles |
| `--font-sans` | Inter | Body text, UI labels |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is for educational and portfolio purposes. Feel free to use it as a template for your own real estate website.

---

<div align="center">

Built with ❤️ using **Next.js** · **Prisma** · **NextAuth.js** · **Supabase**

⭐ **Star this repo if you found it helpful!**

</div>
