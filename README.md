<div align="center">

# 🏢 Bellatrix — Corporate Website & CMS

**Marketing site for Bellatrix, an enterprise-software company, with a built-in admin CMS for editing every page without touching code.**

*Empowering your business with next-gen enterprise software solutions.*

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Redux](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-0EA5E9?style=for-the-badge&logo=tailwindcss&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white)

</div>

---

## ✨ Features

**Public site**
- Dynamic pages for services, solutions and industries (`app/[slug]`) rendered with the Next.js App Router
- Smooth scrolling (Lenis), Framer Motion animations and Swiper carousels
- SEO built in: generated `sitemap`, `robots`, Open Graph images and app icons

**Admin CMS (`/admin`)**
- 🧱 **Drag-and-drop page builder** (dnd-kit) — reorder sections and components visually
- 📄 Page templates and a components showcase for consistent layouts
- 🗂️ Categories, messages inbox, settings and password management
- 🔐 Authenticated dashboard with protected routes
- ⚡ Real-time content sync via Socket.io

## 🧰 Tech Stack

| Layer | Tools |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| State & data | Redux Toolkit, Zustand, TanStack Query, Axios |
| UI | Tailwind CSS, MUI, Heroicons, Framer Motion, Swiper |
| Forms | React Hook Form |
| Realtime | Socket.io client + Node sync server |
| Tooling | ESLint, json-server (local mock data) |

## 📁 Project Structure

```
app/            Next.js routes (public pages, [slug], admin, auth, SEO files)
src/
  components/   Reusable UI
  page-components/  Page sections used by the builder
  Redux/ store/ State management
  services/     API clients
  hooks/ utils/ Shared logic
public/         Static assets
sync-server.cjs Real-time sync server for CMS edits
```

## 🚀 Getting Started

```bash
git clone https://github.com/mos1239487394823939839223/Bellatrix-next.js.git
cd Bellatrix-next.js
npm install

# Next.js + sync server
npm run dev

# Next.js + sync server + local mock API (json-server on :3001)
npm run dev:all
```

Create a `.env.local` with:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api.example.com
NEXT_PUBLIC_API_BASE_URL_WITH_API=https://your-api.example.com/api
```

| Script | Description |
|---|---|
| `npm run dev` | Next.js dev server + sync server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Lint the codebase |

---

<div align="center">

Built by **[Mustafa Anwer Hamed](https://github.com/mos1239487394823939839223)**

</div>
