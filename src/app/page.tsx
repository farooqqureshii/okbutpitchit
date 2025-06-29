"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AnimatedUnderline from "./components/AnimatedUnderline";

// Slide type
export type Slide = {
  title: string;
  text?: string;
  bullets?: string[];
  chart?: any;
  media?: any;
};

const ChartSlide = dynamic(() => import("./components/ChartSlide"), { ssr: false });
const MediaEmbed = dynamic(() => import("./components/MediaEmbed"), { ssr: false });
const ExportPPTX = dynamic(() => import("./components/ExportPPTX"), { ssr: false });
const PitchMode = dynamic(() => import("./components/PitchMode"), { ssr: false });

// Demo deck fallback
const demoSlides: Slide[] = [
  {
    title: "Vibe Draw",
    text: "Turn your roughest sketches into stunning 3D worlds with Vibe Draw, the AI-powered cursor for 3D modeling.",
    bullets: ["Revolutionary AI-powered 3D modeling", "Transform sketches into professional models", "Perfect for designers, architects, and creators"]
  },
  {
    title: "The Problem",
    text: "3D modeling is complex, time-consuming, and requires years of training. Most creative ideas never make it to 3D because the tools are too difficult.",
    bullets: ["Traditional 3D software has steep learning curves", "Hours of work for simple models", "Creative bottleneck for non-technical users"]
  },
  {
    title: "Market Opportunity",
    text: "The 3D modeling market is exploding with AR/VR growth",
    chart: {
      type: 'line',
      data: {
        labels: ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024'],
        datasets: [{
          label: 'Monthly Revenue',
          data: [500, 1200, 2100, 4200, 8000],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      title: "50% Monthly Revenue Growth"
    }
  },
  {
    title: "Our Solution",
    text: "AI-powered cursor that understands your intent and creates 3D models from simple sketches",
    bullets: ["Draw anywhere, get 3D models instantly", "No technical knowledge required", "Professional results in minutes, not hours", "Built-in collaboration and sharing"]
  },
  {
    title: "What's Next",
    text: "Scale to become the Figma of 3D modeling",
    bullets: ["Launch enterprise features", "Expand AI model capabilities", "Build marketplace for 3D assets", "Series A funding to accelerate growth"]
  }
];

const steps = [
  { label: "Repo", icon: "repo" },
  { label: "Theme", icon: "theme" },
  { label: "Settings", icon: "settings" },
  { label: "Processing", icon: "processing" },
  { label: "Result", icon: "result" },
];

export default function Home() {
  const [step, setStep] = useState(0);
  const [theme, setTheme] = useState("modern");
  const [repoUrl, setRepoUrl] = useState("");
  const [settings, setSettings] = useState({
    tone: "balanced",
    includeCharts: true,
  });
  const [customChartData, setCustomChartData] = useState("");
  const [mediaEmbed, setMediaEmbed] = useState("");
  const [loading, setLoading] = useState(false);
  const [slides, setSlides] = useState<Slide[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [pitchOpen, setPitchOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [repoName, setRepoName] = useState("");
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Let's give the component a moment to mount before triggering animations
    const timer = setTimeout(() => setHasAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const deckToShow = (slides && slides.length > 0) ? slides : demoSlides;
  const isDemo = !slides || slides.length === 0;

  // Auto-advance progress bar during processing
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  // Enhanced stepper
  function Stepper() {
    return (
      <div className="flex items-center justify-center gap-4 mb-16 mt-8 px-4">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`relative rounded-full w-10 h-10 flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
              i === step
                ? "bg-blue-600 text-white shadow-md"
                : i < step
                ? "bg-green-500 text-white"
                : "bg-neutral-200 text-neutral-400"
            }`}>
              {i < step ? "✓" : i + 1}
            </div>
            <div className={`text-base font-medium transition-all duration-300 hidden sm:block ${
              i === step ? "text-blue-700" : i < step ? "text-green-600" : "text-neutral-400"
            }`}>
              {s.label}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-8 h-1 rounded-full transition-all duration-300 ${
                i < step ? "bg-green-500" : "bg-neutral-200"
              }`} />
            )}
          </div>
        ))}
      </div>
    );
  }

  // GitHub repo input first
  function RepoStep() {
    const [isValidUrl, setIsValidUrl] = useState(false);
    
    useEffect(() => {
      setIsValidUrl(repoUrl.startsWith("https://github.com/") && repoUrl.split("/").length >= 5);
    }, [repoUrl]);

  return (
      <section className="relative overflow-hidden min-h-screen">
        {/* Header */}
        <div className="absolute top-4 left-4 z-10">
          <div className="text-xl sm:text-2xl font-bold text-neutral-800 px-4 py-2 bg-white/80 rounded-xl backdrop-blur-sm border border-neutral-200 shadow-sm">
            okbutpitchit
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-black mb-8 leading-tight text-neutral-700">
              Turn Any{" "}
              <span className="relative inline-block pb-2">
                <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  GitHub Repo
                </span>
                <AnimatedUnderline color="#10b981" delay={0.6}/>
              </span>{" "}
              Into a{" "}
              <span className="relative inline-block pb-2">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Stunning Pitch Deck
                </span>
                <AnimatedUnderline color="#d946ef" delay={0.8}/>
              </span>
            </h1>
            
            <p className="text-4xl md:text-5xl font-black mb-6 text-neutral-700">
              in{" "}
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: "easeOut", delay: 1.2 }}
                className="inline-block"
              >
                <span className="text-orange-600 font-bold bg-orange-100 px-3 py-1 rounded-lg">
                  seconds
                </span>
              </motion.span>
            </p>
            
            <p className="text-xl text-neutral-500 mb-12 max-w-2xl mx-auto">
              Instantly generate a beautiful, investor-ready pitch deck from any public GitHub repository.  No design skills required.
            </p>
            
            {/* Input */}
            <div className="w-full max-w-2xl mb-12 mx-auto">
              <form 
                className="flex items-center gap-2 bg-white/50 border border-neutral-200 rounded-2xl p-2 shadow-lg backdrop-blur-sm"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (isValidUrl) setStep(1);
                }}
              >
                <div className="pl-2 text-neutral-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <input
                  type="url"
                  placeholder="Paste GitHub repo URL here"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full bg-transparent text-lg text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!isValidUrl}
                  className="px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-md hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Generate
                </button>
              </form>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  icon: "⚡️",
                  title: "Instant Summary",
                  description: "AI summarizes your repo, problem, solution, and stack in seconds.",
                },
                {
                  icon: "🖼️",
                  title: "Beautiful Slides",
                  description: "Modern, professional decks with multiple themes.",
                },
                {
                  icon: "📄",
                  title: "Export Or Present",
                  description: "PowerPoint or present on the spot, we have you covered.",
                },
              ].map((feature) => (
                <motion.div
                  key={feature.title}
                  whileHover={{ y: -6, scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.07)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="text-center p-6 bg-white/40 backdrop-blur-sm rounded-2xl shadow-lg border border-black/5"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-2">{feature.title}</h3>
                  <p className="text-neutral-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="pt-8 pb-6 text-center">
            <p className="text-xs text-neutral-400">
              Inspired by{" "}
              <a 
                href="https://www.ycombinator.com/library/4T-how-to-design-a-better-pitch-deck" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-neutral-700 font-medium underline underline-offset-2"
              >
                Y Combinator's pitch deck guide
              </a>
              {" · Built by "}
              <a
                href="https://farooqqureshi.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-neutral-700 font-medium underline underline-offset-2"
              >
                Farooq
              </a>
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Theme selection step
  function ThemeStep() {
    const themes = [
      { 
        name: "modern", 
        label: "Modern", 
        desc: "Clean, minimal, professional",
        preview: "bg-gradient-to-br from-white via-blue-50 to-indigo-100",
        textColor: "text-neutral-900",
        sampleTitle: "Revenue Growth",
        sampleText: "Q4 revenue increased 127% year-over-year, driven by enterprise adoption.",
        accent: "bg-blue-500"
      },
      { 
        name: "classic", 
        label: "Classic", 
        desc: "Warm, elegant, timeless",
        preview: "bg-gradient-to-br from-amber-50 via-orange-50 to-red-100",
        textColor: "text-amber-900",
        sampleTitle: "Revenue Growth", 
        sampleText: "Q4 revenue increased 127% year-over-year, driven by enterprise adoption.",
        accent: "bg-amber-600"
      },
      { 
        name: "bold", 
        label: "Bold", 
        desc: "High contrast, striking, memorable",
        preview: "bg-gradient-to-br from-slate-900 via-black to-slate-800",
        textColor: "text-white",
        sampleTitle: "Revenue Growth",
        sampleText: "Q4 revenue increased 127% year-over-year, driven by enterprise adoption.",
        accent: "bg-blue-400"
      }
    ];

    return (
      <section className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-6 text-neutral-900">
            Choose Your Theme
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Pick a visual style that matches your project's personality
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl">
          {themes.map((t) => (
            <button
              key={t.name}
              type="button"
              className={`group relative rounded-2xl p-8 text-left shadow-lg transition-all duration-300 border-2 hover:scale-105 ${
                theme === t.name 
                  ? "border-blue-500 bg-blue-50 scale-105 shadow-xl" 
                  : "border-neutral-200 bg-white hover:bg-neutral-50 hover:shadow-xl"
              }`}
              onClick={(e) => {
                e.preventDefault();
                setTheme(t.name);
              }}
            >
              <div className={`w-full h-40 rounded-xl mb-6 ${t.preview} border border-neutral-200 p-6 flex flex-col justify-between relative overflow-hidden`}>
                <div>
                  <h4 className={`text-xl font-bold mb-3 ${t.textColor}`}>{t.sampleTitle}</h4>
                  <p className={`text-sm ${t.textColor} opacity-90 leading-relaxed`}>{t.sampleText}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${t.accent}`}></div>
                  <div className={`text-xs ${t.textColor} opacity-60`}>127% Growth</div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm"></div>
              </div>
              <h3 className="text-xl font-bold mb-2">{t.label}</h3>
              <p className="text-neutral-600">{t.desc}</p>
              {theme === t.name && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>
        
        <div className="flex gap-4">
          <button
            type="button"
            className="text-neutral-500 hover:text-neutral-700 font-semibold py-3 px-8 rounded-xl text-lg transition-colors"
            onClick={() => setStep(0)}
          >
            Back
          </button>
          <button
            type="button"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={() => setStep(2)}
          >
            Continue
          </button>
        </div>
      </section>
    );
  }

  // Simplified settings
  function SettingsStep() {
    return (
      <section className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-6 text-neutral-900">
            Customize Your Deck
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Fine-tune the tone and add custom data visualization
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-4xl w-full">
          {/* Presentation Tone */}
          <div className="mb-10">
            <h3 className="text-xl font-bold mb-6 text-neutral-800">Presentation Tone</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: "balanced", label: "Balanced", desc: "Perfect mix of technical and business" },
                { value: "business", label: "Business-Focused", desc: "Emphasize market opportunity and growth" },
                { value: "technical", label: "Technical Deep-Dive", desc: "Highlight architecture and innovation" }
              ].map((tone) => (
                <label key={tone.value} className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-200 ${
                  settings.tone === tone.value 
                    ? "border-blue-500 bg-blue-50 shadow-md" 
                    : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                }`}>
                  <input
                    type="radio"
                    name="tone"
                    value={tone.value}
                    checked={settings.tone === tone.value}
                    onChange={(e) => {
                      e.preventDefault();
                      setSettings(s => ({ ...s, tone: tone.value }));
                    }}
                    className="sr-only"
                  />
                  <div className="text-lg font-semibold mb-2">{tone.label}</div>
                  <div className="text-neutral-600 text-sm">{tone.desc}</div>
                </label>
              ))}
            </div>
          </div>
          
          {/* Chart Integration */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-xl font-bold text-neutral-800">Chart Integration</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.includeCharts}
                  onChange={(e) => {
                    e.preventDefault();
                    setSettings(s => ({ ...s, includeCharts: e.target.checked }));
                  }}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-neutral-700">Include charts in deck</span>
              </label>
            </div>
            
            {settings.includeCharts && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-neutral-700">
                      Custom Chart Data (CSV format)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const exampleData = "Month,Revenue\nJan,12000\nFeb,18000\nMar,25000\nApr,32000\nMay,41000\nJun,55000";
                        setCustomChartData(exampleData);
                      }}
                      className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg transition-colors"
                    >
                      Generate Example
                    </button>
                  </div>
                  <textarea
                    placeholder="Month,Revenue&#10;Jan,1200&#10;Feb,2400&#10;Mar,3600&#10;Apr,4800&#10;May,6000"
                    value={customChartData}
                    onChange={handleCustomChartDataChange}
                    className="w-full h-32 border-2 border-neutral-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-200"
                  />
                  <p className="text-xs text-neutral-500 mt-2">
                    Paste CSV data to create custom charts. Leave empty to use GitHub stats.
                  </p>
                </div>
                
                {customChartData && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                    <div className="text-green-800 font-semibold mb-2 text-sm">Chart Preview Ready</div>
                    <div className="text-green-700 text-sm">
                      Your custom data will be visualized in the deck. 
                      {customChartData.split('\n').length - 1} data points detected.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Media Embed */}
          <div className="mb-10">
            <h3 className="text-xl font-bold mb-6 text-neutral-800">Media Embed</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-neutral-700">
                    Tweet URL or YouTube Video URL (optional)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMediaEmbed("https://www.youtube.com/watch?v=jGztGfRujSE");
                    }}
                    className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg transition-colors"
                  >
                    Use Example Video
                  </button>
                </div>
                <input
                  type="url"
                  placeholder="https://twitter.com/user/status/123... or https://youtube.com/watch?v=..."
                  value={mediaEmbed}
                  onChange={(e) => {
                    e.preventDefault();
                    setMediaEmbed(e.target.value);
                  }}
                  className="w-full border-2 border-neutral-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-200"
                />
                <p className="text-xs text-neutral-500 mt-2">
                  Add a tweet or YouTube video to showcase your project in action.  Leave empty to skip.
                </p>
              </div>
              
              {mediaEmbed && (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                  <div className="text-green-800 font-semibold mb-2 text-sm">Media Ready</div>
                  <div className="text-green-700 text-sm">
                    Your media will be embedded in the deck to showcase your project.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 mt-12">
          <button
            className="text-neutral-500 hover:text-neutral-700 font-semibold py-3 px-8 rounded-xl text-lg transition-colors"
            onClick={() => setStep(1)}
          >
            Back
          </button>
          <button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={async () => {
              setStep(3);
              setLoading(true);
              setProgress(0);
              setStatus("Analyzing your GitHub repository...");
              setError(null);
              setSlides(null);
              
              const addCustomSlides = (deck: Slide[]): Slide[] => {
                let finalDeck = [...deck];

                // Add media slide
                if (mediaEmbed) {
                  const mediaSlide = {
                    title: "Demo in Action",
                    text: "A look at our project in action.",
                    media: {
                      type: mediaEmbed.includes('youtube.com') || mediaEmbed.includes('youtu.be') ? 'youtube' : 'twitter',
                      url: mediaEmbed
                    }
                  };
                  finalDeck.splice(4, 0, mediaSlide); // Insert after "Solution"
                }

                // Add chart slide
                if (settings.includeCharts && customChartData) {
                  const lines = customChartData.trim().split('\n');
                  if (lines.length > 1) {
                    const headers = lines[0].split(',');
                    const data = lines.slice(1).map(line => line.split(','));
                    if (headers.length >= 2 && data.length > 0) {
                      const labels = data.map(row => row[0]);
                      const values = data.map(row => parseFloat(row[1]) || 0);
                      const chartSlide = {
                        title: "Custom Chart",
                        text: "User-provided data visualization.",
                        chart: {
                          type: 'bar',
                          data: {
                            labels,
                            datasets: [{
                              label: headers[1],
                              data: values,
                              borderColor: theme === 'bold' ? '#38bdf8' : '#3b82f6',
                              backgroundColor: theme === 'bold' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                              borderWidth: 2,
                              fill: true,
                            }]
                          },
                          title: headers[1] || 'Custom Data Chart'
                        }
                      };
                      finalDeck.splice(3, 0, chartSlide); // Insert after "Problem"
                    }
                  }
                }
                return finalDeck;
              };

              try {
                // Simulate realistic progress
                setTimeout(() => setStatus("Extracting project insights..."), 1000);
                setTimeout(() => setStatus("Generating slides with AI..."), 2500);
                setTimeout(() => setStatus("Adding finishing touches..."), 4000);
                
                // 1. Fetch GitHub data
                const githubRes = await fetch("/api/github", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ repoUrl }),
                });
                
                let githubData;
                if (!githubRes.ok) {
                  const errorText = await githubRes.text();
                  throw new Error(`GitHub API failed: ${errorText.includes('<!DOCTYPE') ? 'Server error' : errorText}`);
                }
                githubData = await githubRes.json();
                
                setProgress(50);
                setStatus("Generating slides with AI...");
                
                // 2. Call Groq for slides
                const groqRes = await fetch("/api/groq", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ 
                    repoData: githubData, 
                    settings: { ...settings, customChartData, mediaEmbed }, 
                    theme 
                  }),
                });
                
                if (!groqRes.ok) {
                  const errorText = await groqRes.text();
                  throw new Error(`AI generation failed: ${errorText.includes('<!DOCTYPE') ? 'Server error' : errorText}`);
                }
                
                const groqData = await groqRes.json();
                const finalSlides = addCustomSlides(groqData.slides || demoSlides);

                setSlides(finalSlides);
                setProgress(100);
                setStatus("Your deck is ready!");
                
                setTimeout(() => setStep(4), 1000);
              } catch (e: any) {
                console.error('Generation error:', e);
                setError(`Oops! ${e.message || 'Something went wrong'}. Don't worry - we've prepared a demo deck for you to explore!`);
                
                const finalDemoSlides = addCustomSlides(demoSlides);
                setSlides(finalDemoSlides);

                setProgress(100);
                setTimeout(() => setStep(4), 1000);
              } finally {
                setLoading(false);
              }
            }}
          >
            Generate My Deck
          </button>
        </div>
      </section>
    );
  }

  // Processing step
  function ProcessingStep() {
    return (
      <section className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-6 text-neutral-900">
            Creating Your Pitch Deck
          </h1>
          <p className="text-lg text-neutral-600">
            Our AI is analyzing your project and crafting the perfect story...
          </p>
        </div>
        
        <div className="w-full max-w-2xl mb-8">
          <div className="relative h-4 bg-neutral-200 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%`, willChange: 'width' }}
            >
            </div>
          </div>
          <div className="flex justify-between text-sm text-neutral-500 mt-2">
            <span>0%</span>
            <span className="font-semibold">{Math.round(progress)}%</span>
            <span>100%</span>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <div className="text-xl font-semibold text-neutral-700 mb-2">
            {status || "Working magic..."}
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 max-w-2xl text-center mb-8">
            <div className="text-red-600 text-lg font-semibold mb-2">Heads up!</div>
            <div className="text-red-700">{error}</div>
          </div>
        )}
        
        {!loading && progress >= 100 && (
          <button
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-10 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={() => setStep(4)}
          >
            See My Deck
          </button>
        )}
      </section>
    );
  }

  // Clean slide display
  function ResultStep() {
    const isDemo = !slides || slides.length === 0;
    const [currentSlide, setCurrentSlide] = useState(0);
    
    return (
      <section className="flex flex-col items-center justify-start w-full min-h-screen py-6 sm:py-8">
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-3xl font-black mb-2 text-neutral-900">
            Your Deck is Ready!
          </h1>
          {isDemo ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-2xl mx-auto">
              <div className="text-blue-800 text-sm font-semibold mb-1">Demo Mode</div>
              <div className="text-blue-700 text-xs">
                {error ? error : "We've created a sample deck for you. Add your GitHub repo and API keys to generate your real deck!"}
              </div>
            </div>
          ) : (
            <p className="text-sm text-neutral-600">
              Your personalized pitch deck is ready to impress!
            </p>
          )}
        </div>
        
        {/* Clean slide viewer */}
        <div className="w-full max-w-5xl mx-auto px-4 flex-1 flex flex-col">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-neutral-200 flex-1 flex flex-col">
            {/* Slide navigation bar */}
            <div className="bg-neutral-50 border-b border-neutral-200 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-semibold text-neutral-700">
                  Slide {currentSlide + 1} / {deckToShow.length}
                </h3>
                <div className="text-xs text-neutral-500 hidden sm:block">
                  {deckToShow[currentSlide]?.title}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                  disabled={currentSlide === 0}
                  className="p-1.5 rounded-md bg-white border border-neutral-300 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/></svg>
                </button>
                <button
                  onClick={() => setCurrentSlide(Math.min(deckToShow.length - 1, currentSlide + 1))}
                  disabled={currentSlide === deckToShow.length - 1}
                  className="p-1.5 rounded-md bg-white border border-neutral-300 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg>
                </button>
              </div>
            </div>
            
            {/* Main slide display */}
            <div className="relative bg-neutral-100 flex-1">
              <div className={`aspect-[16/9] p-4 sm:p-8 transition-all duration-300 h-full ${
                theme === "modern"
                  ? "bg-gradient-to-br from-white to-blue-50 text-neutral-900"
                  : theme === "classic"
                  ? "bg-gradient-to-br from-amber-50 to-orange-50 text-amber-900"
                  : "bg-gradient-to-br from-slate-900 to-black text-white"
              }`}>
                <div className="h-full flex flex-col justify-center items-center text-center">
                  <h1 className="text-4xl font-black mb-6 leading-tight max-w-3xl">
                    {deckToShow[currentSlide]?.title}
                  </h1>
                  
                  {deckToShow[currentSlide]?.text && (
                    <div className="text-lg leading-relaxed mb-6 opacity-90 max-w-3xl">
                      {deckToShow[currentSlide].text}
                    </div>
                  )}
                  
                  {deckToShow[currentSlide]?.bullets && (
                    <ul className="space-y-2 text-base max-w-2xl text-left">
                      {deckToShow[currentSlide].bullets!.map((bullet: string, j: number) => (
                        <li key={j} className="flex items-start gap-3">
                          <span className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            theme === "modern" ? "bg-blue-500" :
                            theme === "classic" ? "bg-amber-600" :
                            "bg-blue-400"
                          }`}></span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {deckToShow[currentSlide]?.chart && (
                    <div className="mt-4 w-full max-w-3xl aspect-[2/1]">
                      <ChartSlide chart={deckToShow[currentSlide].chart} theme={theme} />
                    </div>
                  )}
                  
                  {deckToShow[currentSlide]?.media && (
                    <div className="mt-4 w-full max-w-xl">
                      <MediaEmbed media={deckToShow[currentSlide].media} />
                    </div>
                  )}
                </div>
                
                {/* Slide number indicator */}
                <div className="absolute bottom-4 right-4 text-xs opacity-50">
                  {currentSlide + 1} / {deckToShow.length}
                </div>
              </div>
            </div>
            
            {/* Slide thumbnails */}
            <div className="bg-neutral-100 border-t border-neutral-200 p-2">
              <div className="flex justify-center gap-2 overflow-x-auto pb-1">
                {deckToShow.map((slide: Slide, i: number) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`flex-shrink-0 w-28 h-16 rounded-md border-2 transition-all duration-200 overflow-hidden text-left p-2
                      ${ i === currentSlide ? "border-blue-500 bg-white" : "border-transparent bg-neutral-200 hover:border-neutral-400"}
                      ${ theme === 'bold' ? 'hover:border-slate-500' : '' }
                    `}
                  >
                    <p className={`text-xs font-semibold ${theme === 'bold' ? 'text-white/70' : 'text-neutral-500'}`}>
                      {i + 1}
                    </p>
                    <p className={`text-sm font-bold truncate ${theme === 'bold' ? 'text-white' : 'text-neutral-800'}`}>
                      {slide.title}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-wrap gap-4 justify-center items-center mt-6">
            <button
              onClick={() => setPitchOpen(true)}
              className="text-neutral-600 hover:text-neutral-800 font-semibold py-2 px-5 rounded-lg text-sm transition-colors border border-neutral-300 hover:bg-neutral-100"
            >
              Pitch It Now
            </button>
            
            <ExportPPTX slides={deckToShow} theme={theme} />
            
            <button
              className="text-neutral-600 hover:text-neutral-800 font-semibold py-2 px-5 rounded-lg text-sm transition-colors border border-neutral-300 hover:bg-neutral-100"
              onClick={() => {
                setStep(0);
                setRepoUrl("");
                setSlides(null);
                setError(null);
                setCustomChartData("");
                setMediaEmbed("");
                setProgress(0);
              }}
            >
              Create New Deck
            </button>
          </div>
        </div>
      </section>
    );
  }

  const handleCustomChartDataChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    // Replace tabs with commas for easier pasting from Excel/Sheets
    const pastedData = e.target.value;
    const csvData = pastedData.replace(/\t/g, ",");
    setCustomChartData(csvData);
  };

  const addCustomSlides = (originalSlides: Slide[]): Slide[] => {
    let finalDeck = [...originalSlides];

    // Add media slide
    if (mediaEmbed) {
      const mediaSlide = {
        title: "Demo in Action",
        text: "A look at our project in action.",
        media: {
          type: mediaEmbed.includes('youtube.com') || mediaEmbed.includes('youtu.be') ? 'youtube' : 'twitter',
          url: mediaEmbed
        }
      };
      finalDeck.splice(4, 0, mediaSlide); // Insert after "Solution"
    }

    // Add chart slide
    if (settings.includeCharts && customChartData) {
      const lines = customChartData.trim().split('\n');
      if (lines.length > 1) {
        const headers = lines[0].split(',');
        const data = lines.slice(1).map(line => line.split(','));
        if (headers.length >= 2 && data.length > 0) {
          const labels = data.map(row => row[0]);
          const values = data.map(row => parseFloat(row[1]) || 0);
          const chartSlide = {
            title: "Custom Chart",
            text: "User-provided data visualization.",
            chart: {
              type: 'bar',
              data: {
                labels,
                datasets: [{
                  label: headers[1],
                  data: values,
                  borderColor: theme === 'bold' ? '#38bdf8' : '#3b82f6',
                  backgroundColor: theme === 'bold' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                  borderWidth: 2,
                  fill: true,
                }]
              },
              title: headers[1] || 'Custom Data Chart'
            }
          };
          finalDeck.splice(3, 0, chartSlide); // Insert after "Problem"
        }
      }
    }
    return finalDeck;
  };

  const renderSlide = (slide: Slide) => {
    // ... existing code ...
    return (
      <div className="h-full flex flex-col justify-center items-center text-center">
        <h1 className="text-4xl font-black mb-6 leading-tight max-w-3xl">
          {slide.title}
        </h1>
        
        {slide.text && (
          <div className="text-lg leading-relaxed mb-6 opacity-90 max-w-3xl">
            {slide.text}
          </div>
        )}
        
        {slide.bullets && (
          <ul className="space-y-2 text-base max-w-2xl text-left">
            {slide.bullets.map((bullet: string, j: number) => (
              <li key={j} className="flex items-start gap-3">
                <span className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  theme === "modern" ? "bg-blue-500" :
                  theme === "classic" ? "bg-amber-600" :
                  "bg-blue-400"
                }`}></span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}
        
        {slide.chart && (
          <div className="mt-4 w-full max-w-3xl aspect-[2/1]">
            <ChartSlide chart={slide.chart} theme={theme} />
          </div>
        )}
        
        {slide.media && (
          <div className="mt-4 w-full max-w-xl">
            <MediaEmbed media={slide.media} />
          </div>
        )}
      </div>
    );
  };

  // The main component return
  return (
    <main className="min-h-screen font-sans antialiased">
      <div 
        className="absolute inset-0 -z-10"
        style={{
          backgroundColor: '#ffffff',
          backgroundImage: 'linear-gradient(rgba(128, 128, 128, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(128, 128, 128, 0.15) 1px, transparent 1px)',
          backgroundSize: '2rem 2rem'
        }}
      ></div>

      <div className="absolute top-5 left-5 sm:top-6 sm:left-6 z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={hasAnimated ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <div 
            className="text-2xl font-bold text-neutral-800 px-4 py-2 bg-white/80 rounded-xl backdrop-blur-sm border border-neutral-200 shadow-sm"
          >
            okbutpitchit
          </div>
        </motion.div>
      </div>

      {/* Hero section always mounted */}
      {step === 0 && (
        <section className="relative overflow-hidden min-h-screen">
          <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 pb-16">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-6xl md:text-7xl font-black mb-8 leading-tight text-neutral-700">
                Turn Any{" "}
                <span className="relative inline-block pb-2">
                  <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    GitHub Repo
                  </span>
                  <AnimatedUnderline color="#10b981" delay={0.6}/>
                </span>{" "}
                Into a{" "}
                <span className="relative inline-block pb-2">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Stunning Pitch Deck
                  </span>
                  <AnimatedUnderline color="#d946ef" delay={0.8}/>
                </span>
              </h1>
              <p className="text-4xl md:text-5xl font-black mb-6 text-neutral-700">
                in{" "}
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 1.2 }}
                  className="inline-block"
                >
                  <span className="text-orange-600 font-bold bg-orange-100 px-3 py-1 rounded-lg">
                    seconds
                  </span>
                </motion.span>
              </p>
              <p className="text-xl text-neutral-500 mb-12 max-w-2xl mx-auto">
                Instantly generate a beautiful, investor-ready pitch deck from any public GitHub repository.  No design skills required.
              </p>
              {/* Input */}
              <div className="w-full max-w-2xl mb-12 mx-auto">
                <form 
                  className="flex items-center gap-2 bg-white/50 border border-neutral-200 rounded-2xl p-2 shadow-lg backdrop-blur-sm"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (repoUrl.startsWith("https://github.com/") && repoUrl.split("/").length >= 5) setStep(1);
                  }}
                >
                  <div className="pl-2 text-neutral-400">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <input
                    type="url"
                    placeholder="Paste GitHub repo URL here"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="w-full bg-transparent text-lg text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!(repoUrl.startsWith("https://github.com/") && repoUrl.split("/").length >= 5)}
                    className="px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-md hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Generate
                  </button>
                </form>
              </div>
              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {[
                  {
                    icon: "⚡️",
                    title: "Instant Summary",
                    description: "AI summarizes your repo, problem, solution, and stack in seconds.",
                  },
                  {
                    icon: "🖼️",
                    title: "Beautiful Slides",
                    description: "Modern, professional decks with multiple themes.",
                  },
                  {
                    icon: "📄",
                    title: "Export Or Present",
                    description: "PowerPoint or present on the spot, we have you covered.",
                  },
                ].map((feature) => (
                  <motion.div
                    key={feature.title}
                    whileHover={{ y: -6, scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.07)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="text-center p-6 bg-white/40 backdrop-blur-sm rounded-2xl shadow-lg border border-black/5"
                  >
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-lg font-semibold text-neutral-800 mb-2">{feature.title}</h3>
                    <p className="text-neutral-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            {/* Footer */}
            <div className="pt-8 pb-6 text-center">
              <p className="text-xs text-neutral-400">
                Inspired by{" "}
                <a 
                  href="https://www.ycombinator.com/library/4T-how-to-design-a-better-pitch-deck" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-neutral-700 font-medium underline underline-offset-2"
                >
                  Y Combinator's pitch deck guide
                </a>
                {" · Built by "}
                <a
                  href="https://farooqqureshi.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-neutral-700 font-medium underline underline-offset-2"
                >
                  Farooq
                </a>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Stepper and other steps */}
      {step > 0 && (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Stepper />
          <div style={{ display: step === 1 ? "block" : "none" }}><ThemeStep /></div>
          <div style={{ display: step === 2 ? "block" : "none" }}><SettingsStep /></div>
          <div style={{ display: step === 3 ? "block" : "none" }}><ProcessingStep /></div>
          <div style={{ display: step === 4 ? "block" : "none" }}><ResultStep /></div>
        </div>
      )}

      <PitchMode slides={deckToShow} theme={theme} open={pitchOpen} onClose={() => setPitchOpen(false)} />
    </main>
  );
}