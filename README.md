# 💵 okbutpitchit

Generate beautiful, modern, SaaS-quality pitch decks from any public GitHub repository in seconds.

## What is okbutpitchit?

**okbutpitchit** is a premium web app that uses AI (Groq LLM) and the GitHub API to instantly create investor-ready pitch decks from any GitHub repo. It features a modern, original UI inspired by top SaaS products (Linear, Notion, Vercel, Pitch.com, Arc browser) and is designed for clarity, legibility, and simplicity.

## Features

- **Paste a GitHub repo** and instantly fetch project data
- **AI-powered slide generation** (5–7 slides, flexible count)
- **Interactive chart slide** (paste your own data, real-time updates)
- **Media embed slide** (YouTube/Tweet)
- **Export as PDF or PPTX** (with robust Unicode/emoji handling)
- **Instant pitch mode** (fullscreen, PowerPoint-style UI)
- **Theme selector** (Modern, Classic, Bold)
- **Settings** (tweak tone, add custom chart)

## Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/yourusername/okbutpitchit.git
   cd okbutpitchit
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or yarn install
   ```
3. **Set up environment variables:**
   Create a `.env` file in the root:
   ```
   GROQ_API_KEY=your-groq-api-key-here
   GITHUB_TOKEN=your-github-token-here
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   # or yarn dev
   ```
5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Usage

- Paste a GitHub repo URL and follow the walkthrough to generate your deck.
- Customize the theme, tone, and add your own chart or media.
- Export your deck as PDF or PPTX, or present instantly in pitch mode.

## Credits

- Built by [Farooq](https://farooqqureshi.com/)
- Inspired by [Y Combinator's pitch deck guide](https://www.ycombinator.com/library/4T-how-to-design-a-better-pitch-deck)

---

MIT License.
