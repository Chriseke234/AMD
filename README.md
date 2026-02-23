# AskMyData: AI-Powered Data Analytics SaaS

AskMyData is a high-performance, production-ready AI analytics platform that allows users to talk to their data, build beautiful dashboards, and collaborate with teams.

## 🚀 Key Features

- **AI Analytics Engine**: Natural language to SQL querying with safety safeguards.
- **Dataset Management**: Direct uploads to Supabase Storage with automated metadata extraction.
- **Interactive Dashboards**: Premium widget library with drag-and-drop support.
- **Admin Hub**: Full-featured console for system monitoring, usage tracking, and feature flags.
- **Team Collaboration**: Workspace sharing, member invites, and role-based permissions.
- **Premium UI**: Modern purple/white aesthetic, dark mode support, and smooth animations.

## 🛠 Project Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Backend**: [Supabase](https://supabase.com/) (Postgres, Auth, Storage)
- **Styling**: Vanilla CSS with custom design tokens
- **Icons**: Lucide React

## 📦 Getting Started

### 1. Prerequisites
- Node.js 18+ 
- A Supabase Project

### 2. Environment Variables
Create a `.env.local` file in the root directory and add the following:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Installation
```bash
npm install
```

### 4. Development
```bash
npm run dev
```

## 🌐 Deployment to Vercel

1. **Push to GitHub**: Initialize a repo and push your code.
2. **Connect to Vercel**: Import the project into Vercel.
3. **Environment Variables**: Add the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the Vercel dashboard.
4. **Deploy**: Build and enjoy your live AI Analytics platform!

---
Built with ❤️ by AskMyData Team.
