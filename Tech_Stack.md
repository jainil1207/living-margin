# Technology Stack: The Living Margin

## 1. Frontend Architecture
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Library**: React 19

*Reasoning*: Next.js App Router provides excellent routing, server-side rendering, and SEO capabilities right out of the box. TypeScript ensures type safety and prevents runtime errors.

## 2. Styling & UI
- **CSS Framework**: Tailwind CSS v3
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: `next/font/google` (Inter)

*Reasoning*: Tailwind CSS allows for rapid, utility-first UI development. Framer Motion handles complex micro-interactions and scroll animations easily. (Note: Tailwind v3 is used specifically to ensure compatibility with 32-bit Node.js environments).

## 3. Backend & Database (Planned)
- **BaaS**: Supabase
- **Database**: PostgreSQL
- **Authentication**: Supabase Auth (Email/Password & OAuth)
- **Data Fetching**: Supabase JS Client

*Reasoning*: Supabase provides an instantly scalable PostgreSQL database with built-in row-level security (RLS) and real-time capabilities, which is perfect for real-time social margin notes.

## 4. Development Environment
- **Node.js**: ia32 (32-bit architecture environment)
- **Dev Server Compiler**: Webpack (with cache disabled to respect memory limits)
- **Package Manager**: npm
