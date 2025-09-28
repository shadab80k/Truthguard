# 🚀 TruthGuard Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### 1. Clone & Install
```bash
git clone https://github.com/shadab80k/truthguard.git
cd truthguard
npm install
```

### 2. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env
```

**Required API Keys** (all free tiers available):
- **Groq API**: [console.groq.com](https://console.groq.com/keys) - Free tier: 14,400 requests/day
- **Supabase**: [supabase.com](https://supabase.com) - Free tier: 50,000 requests/month

### 3. Development Server
```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) to see TruthGuard in action!

## Features Configuration

### Standard Mode (Default)
- No additional setup required
- Uses AI analysis only
- ~70-85% accuracy

### Advanced Mode 
- Requires Supabase setup for web scraping
- Uses curated sources + web scraping + AI
- ~85-95% accuracy

## Production Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy with one click

### Netlify
1. Connect repository to Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add environment variables

## API Keys Setup

### Groq API (Required)
1. Visit [Groq Console](https://console.groq.com/keys)
2. Create free account
3. Generate API key
4. Add to `.env` as `GROQ_API_KEY`

### Supabase (For Advanced Features)
1. Create project at [Supabase](https://supabase.com)
2. Get URL and anon key from Settings > API
3. Add to `.env` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

## Troubleshooting

### Common Issues
- **API Key errors**: Ensure keys are properly set in `.env`
- **Build errors**: Clear `node_modules` and reinstall
- **CORS issues**: Check Supabase CORS settings

### Support
- Open an issue on GitHub
- Check existing issues for solutions