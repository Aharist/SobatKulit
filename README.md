# SobatKulit

Platform edukasi dan penapisan awal kondisi kulit menggunakan kecerdasan buatan multimodal (Gemini 1.5 Flash). Bukan pengganti dokter spesialis.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Authentication**: Clerk v7
- **Database & Storage**: Supabase (PostgreSQL + Storage)
- **AI**: Google Gemini 1.5 Flash (Multimodal)
- **Maps**: Google Maps Embed API
- **Styling**: Vanilla CSS (Futuristic Medical Darkness theme)
- **Icons**: Icons8 Line Awesome (CDN)

## Fitur MVP

1. **Landing Page Interaktif** — Hero section dengan scanner overlay animasi dan gerbang autentikasi
2. **Multimodal AI Skin Scanner** — Foto (kamera/upload) + kuesioner → analisis Gemini AI
3. **Emergency Red-Flag Detector** — Deteksi kondisi darurat + integrasi Google Maps untuk RS/IGD terdekat
4. **Case-Based Skin Tracker** — Pemantauan luka per sesi dengan perbandingan side-by-side
5. **Dermapedia** — Ensiklopedia 10 penyakit kulit populer Indonesia
6. **User Profile & History** — Edit profil opsional + riwayat scan dengan modal detail

## Struktur Proyek

```
sobatkulit/
├── app/
│   ├── layout.js              # Root layout (ClerkProvider)
│   ├── page.js                # Landing Page
│   ├── globals.css            # Design System
│   ├── (auth)/
│   │   ├── sign-in/           # Clerk Sign In
│   │   └── sign-up/           # Clerk Sign Up
│   ├── scanner/page.js        # AI Scanner
│   ├── tracker/page.js        # Skin Tracker
│   ├── edukasi/page.js        # Dermapedia
│   └── api/
│       ├── scan/route.js      # Scan API (Gemini + Supabase)
│       ├── tracker/route.js   # Tracker CRUD API
│       ├── profile/route.js   # Profile API
│       └── history/route.js   # Scan History API
├── components/
│   ├── Navbar.js              # Top nav (desktop)
│   ├── BottomNav.js           # Bottom nav (mobile)
│   ├── ProfileDropdown.js     # Profile menu
│   ├── ProfileModal.js        # Edit profile modal
│   ├── ScanHistoryModal.js    # Scan history list + detail
│   ├── ScannerCamera.js       # Camera/upload component
│   ├── QuestionnaireModal.js  # Scan questionnaire
│   ├── ScanResult.js          # Scan result display
│   ├── EmergencyAlert.js      # Emergency mode UI
│   └── EmergencyMap.js        # Google Maps integration
├── lib/
│   ├── supabase.js            # Supabase client
│   └── gemini.js              # Gemini API helper
├── middleware.js               # Clerk route protection
└── .env.local                 # Environment variables
```

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
File `.env.local` sudah tersedia dengan konfigurasi berikut:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk public key
- `CLERK_SECRET_KEY` — Clerk secret key
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `GOOGLE_GENERATIVE_AI_API_KEY` — Gemini API key
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — Google Maps API key

### 3. Database Setup (Supabase)
Jalankan SQL berikut di Supabase SQL Editor:

```sql
-- Tabel Profil
create table public.profiles (
  id text primary key,
  updated_at timestamp with time zone default now(),
  full_name text,
  birth_date date,
  address text
);

-- Tabel Sesi Tracking
create table public.tracking_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  created_at timestamp with time zone default now(),
  title text not null,
  status text default 'MONITORING' check (status in ('MONITORING', 'RESOLVED'))
);

-- Tabel Scan Logs
create table public.scan_logs (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.tracking_sessions(id) on delete cascade,
  user_id text not null,
  created_at timestamp with time zone default now(),
  image_url text not null,
  body_location text,
  symptoms text[],
  description text,
  condition_name text not null,
  confidence_score integer not null,
  causes text not null,
  handling_tips text[] not null,
  is_emergency boolean default false,
  progression_status text check (progression_status in ('MEMBAIK', 'MEMBURUK', 'STABIL'))
);

-- Storage Bucket
insert into storage.buckets (id, name, public) values ('skin-images', 'skin-images', false);
```

### 4. Run Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Keamanan & Privasi

- Semua route `/scanner` dan `/tracker` dilindungi Clerk middleware
- Semua operasi database filter by `user_id` dari Clerk `auth()`
- Foto kulit disimpan di private bucket Supabase Storage
- Kamera dan geolocation hanya via HTTPS
- Data ke Gemini hanya untuk inferensi real-time
- User dapat menghapus riwayat scan kapan saja

## Medical Disclaimer

SobatKulit adalah platform edukasi kesehatan kulit, bukan penyedia diagnosis medis resmi pengganti dokter spesialis. Selalu konsultasikan kondisi kulit Anda dengan tenaga medis profesional.
