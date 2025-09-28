# 🛡️ TruthGuard - AI-Powered Fact Checker

A modern, AI-powered fact-checking application that helps users verify the credibility of statements and news in real-time.

![TruthGuard Banner](https://via.placeholder.com/800x200/3b82f6/ffffff?text=TruthGuard+AI+Fact+Checker)

## ✨ Features

- 🤖 **AI-Powered Analysis**: Uses Groq's Llama 3.3 model for intelligent fact-checking
- ⚡ **Real-time Results**: Get instant fact-checking results with confidence scores
- 🎯 **Source Attribution**: Each fact-check comes with credible sources and references
- 🎨 **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- 🔒 **Secure**: Built with Supabase for reliable backend infrastructure
- 📊 **Confidence Scoring**: AI provides confidence levels for each analysis
- 🌙 **Dark Mode**: Support for both light and dark themes

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Backend**: Supabase Edge Functions
- **AI**: Groq API with Llama 3.3-70B model
- **Database**: PostgreSQL (Supabase)
- **Animation**: Framer Motion
- **Forms**: React Hook Form + Zod validation

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Groq API key

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <YOUR_REPO_URL>
   cd truthguard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   cp .env.example .env
   ```
   
   Fill in your API keys:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Login to Supabase
   npx supabase login
   
   # Link to your project
   npx supabase link --project-ref YOUR_PROJECT_REF
   
   # Deploy database migrations
   npx supabase db push
   
   # Deploy Edge Functions
   npx supabase functions deploy fact-check
   
   # Set secrets
   npx supabase secrets set GROQ_API_KEY=your_groq_api_key
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:8080](http://localhost:8080) to view the application.

## 🔧 API Keys Setup

### Groq API Key
1. Visit [Groq Console](https://console.groq.com/keys)
2. Create a new API key
3. Copy the key and add it to your `.env` file

### Supabase Setup
1. Create a new project at [Supabase](https://supabase.com)
2. Go to Settings → API
3. Copy the URL and anon key to your `.env` file

## 📱 Usage

1. **Enter a statement** in the input field
2. **Click "Check Fact"** to analyze the statement
3. **Review the results** including:
   - Truth status (True/Questionable/False)
   - Confidence score
   - Detailed reasoning
   - Source references

## 🏗️ Project Structure

```
ttruthguard/
├── src/
│   ├── components/           # React components
│   ├── contexts/            # React contexts
│   ├── hooks/               # Custom hooks
│   ├── integrations/        # API integrations
│   └── services/            # Business logic
├── supabase/
│   ├── functions/           # Edge Functions
│   └── migrations/          # Database migrations
├── public/                  # Static assets
└── docs/                    # Documentation
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify
1. Connect repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Set environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Groq](https://groq.com/) for fast AI inference
- [Supabase](https://supabase.com/) for backend infrastructure
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📞 Support

If you have any questions or need help, please open an issue or contact the maintainers.

---

<div align="center">
  Made with ❤️ for truth and transparency
</div>
