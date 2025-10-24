# 💖 Love Timeline

A beautiful SvelteKit + Supabase application for sharing love memories with PWA support.

## ✨ Features

- 📸 Upload photos and videos
- 📚 Organize memories in albums
- 💖 Beautiful pastel pink theme
- 📱 Mobile-first responsive design
- 🔄 PWA with offline support
- ⚡ Fast image optimization with Supabase Transform
- 🔐 Supabase authentication with magic links

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd love-timeline
npm install
```

### 2. Setup Supabase

1. Create a new Supabase project
2. Copy `.env.example` to `.env` and fill in your Supabase credentials:

```env
PUBLIC_SUPABASE_URL=your_supabase_url_here
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 3. Database Setup

Run these SQL commands in your Supabase SQL editor:

```sql
-- Create albums table
CREATE TABLE albums (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create memories table
CREATE TABLE memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust as needed for your auth requirements)
CREATE POLICY "Allow all operations for authenticated users" ON albums
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON memories
  FOR ALL USING (auth.role() = 'authenticated');
```

### 4. Storage Setup

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `memories`
3. Set it to public
4. Enable image transformations

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see your app!

## 🏗️ Build & Deploy

### Build for Production

```bash
npm run build
```

### Deploy to Cloudflare Pages

1. Connect your GitHub repo to Cloudflare Pages
2. Set build command: `npm run build`
3. Set build output directory: `build`
4. Add environment variables in Cloudflare Pages dashboard:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## 📁 Project Structure

```
src/
├── lib/
│   ├── supabase/          # Supabase client & server
│   ├── img.ts             # Image optimization utility
│   └── upload.ts          # Upload utilities
├── components/
│   ├── ui/                # shadcn-svelte components
│   ├── Image.svelte       # Optimized image component
│   ├── NavbarTabs.svelte  # Bottom navigation
│   └── TimelineCard.svelte # Memory card component
└── routes/
    ├── +layout.svelte     # Main layout
    ├── +page.svelte       # Home page
    ├── albums/            # Album pages
    ├── upload/            # Upload page
    ├── auth/              # Authentication
    ├── profile/           # User profile
    └── api/               # API routes
```

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.js` to customize the pink theme:

```js
colors: {
  primary: {
    // Your custom colors
  }
}
```

### PWA Settings

Update `vite.config.ts` to customize PWA settings:

```ts
SvelteKitPWA({
  manifest: {
    name: 'Your App Name',
    theme_color: '#your-color',
    // ... other settings
  }
})
```

## 🔧 Tech Stack

- **Framework**: SvelteKit + TypeScript
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Styling**: Tailwind CSS
- **UI Components**: shadcn-svelte
- **Animations**: Motion One
- **PWA**: Vite PWA Plugin
- **Deployment**: Cloudflare Pages

## 📱 PWA Features

- ✅ Add to Home Screen
- ✅ Offline shell
- ✅ App-like experience
- ✅ Push notifications ready
- ✅ Responsive design

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for your own love timeline! 💖
