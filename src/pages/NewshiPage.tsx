import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import NavBar from "@/components/NavBar";
import TechTag from "@/components/TechTag";
import Footer from "@/components/Footer";

const kpi = [
  { label: "Events Tracked", value: "5,000+", icon: "📊" },
  { label: "Markets", value: "50,000+", icon: "📈" },
  { label: "News Sources", value: "60+", icon: "📰" },
  { label: "Articles Indexed", value: "10,000+", icon: "🔍" },
];

const tech = [
  "Next.js 16",
  "React 19",
  "TypeScript",
  "FastAPI",
  "Python 3",
  "PostgreSQL 16",
  "pgvector",
  "EmbeddingGemma-300M",
  "Docker Compose",
  "Nginx",
  "DigitalOcean",
];

const features = [
  {
    title: "Live Market Dashboards",
    desc: "Event dashboards with live price history, open-interest visualizations, and top markets ranked by volume.",
  },
  {
    title: "AI-Matched News Feed",
    desc: "Semantic vector similarity between event titles and article text surfaces the most relevant breaking news for each market.",
  },
  {
    title: "Real-Time Data Pipeline",
    desc: "Continuous ingestion of Kalshi market data, RSS news feeds, and embeddings via a long-running worker process.",
  },
  {
    title: "Fast Event Search",
    desc: "Instant search across 5,000+ tracked Kalshi event titles with ranked results.",
  },
];

const fade = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

export default function NewshiPage() {
  return (
    <Layout>
      <NavBar />

      {/* Hero */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="page-center">
          <motion.div {...fade}>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-cyan-400 transition-colors mb-8"
            >
              <ArrowLeft size={16} /> Back to projects
            </Link>
          </motion.div>

          <motion.p
            {...fade}
            transition={{ ...fade.transition, delay: 0.05 }}
            className="font-mono text-cyan-400 text-sm mb-3"
          >
            Featured Project
          </motion.p>

          <motion.h1
            {...fade}
            transition={{ ...fade.transition, delay: 0.1 }}
            className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-100 tracking-tight leading-tight mb-4"
          >
            Newshi
          </motion.h1>

          <motion.p
            {...fade}
            transition={{ ...fade.transition, delay: 0.15 }}
            className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed mb-8"
          >
            A Bloomberg Terminal-style web app for tracking Kalshi prediction
            markets with live pricing, volume, and AI-matched news. Built for
            traders, researchers, and enthusiasts who want to understand how
            breaking news moves markets in real time.
          </motion.p>

          <motion.div
            {...fade}
            transition={{ ...fade.transition, delay: 0.2 }}
            className="flex items-center gap-4 mb-12"
          >
            <a
              href="https://newshi.live"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-mono text-sm text-cyan-400 border border-cyan-400/40 rounded-lg px-5 py-2.5 hover:bg-cyan-400/10 transition-colors"
            >
              <ExternalLink size={16} /> Visit newshi.live
            </a>
            <a
              href="https://github.com/e1daru/KalshiAnalytics"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-mono text-sm text-zinc-400 border border-zinc-700 rounded-lg px-5 py-2.5 hover:border-zinc-500 hover:text-zinc-200 transition-colors"
            >
              <Github size={16} /> Source Code
            </a>
          </motion.div>

          {/* KPIs */}
          <motion.div
            {...fade}
            transition={{ ...fade.transition, delay: 0.25 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {kpi.map((k) => (
              <div
                key={k.label}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 text-center"
              >
                <div className="text-2xl mb-2">{k.icon}</div>
                <div className="font-mono text-xl md:text-2xl font-bold text-zinc-100">
                  {k.value}
                </div>
                <div className="text-xs text-zinc-500 mt-1">{k.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why */}
      <section className="py-16 md:py-20">
        <div className="page-center">
          <motion.h2
            {...fade}
            className="font-mono text-2xl font-bold text-zinc-100 mb-6"
          >
            Why This Exists
          </motion.h2>
          <motion.p
            {...fade}
            className="text-zinc-400 text-base leading-relaxed max-w-3xl"
          >
            Kalshi gives users market data. Newshi adds the missing context
            layer: a live multi-source news feed matched by AI to events, so
            users can move from "what is happening in the market?" to "what news
            is likely driving it?" in one screen.
          </motion.p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20">
        <div className="page-center">
          <motion.h2
            {...fade}
            className="font-mono text-2xl font-bold text-zinc-100 mb-10"
          >
            Key Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                {...fade}
                transition={{ ...fade.transition, delay: i * 0.08 }}
                className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6"
              >
                <h3 className="font-mono text-base font-medium text-zinc-100 mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-16 md:py-20">
        <div className="page-center">
          <motion.h2
            {...fade}
            className="font-mono text-2xl font-bold text-zinc-100 mb-6"
          >
            How It Works
          </motion.h2>
          <motion.div {...fade} className="space-y-4 text-zinc-400 text-base leading-relaxed max-w-3xl">
            <p>
              The worker ingests open Kalshi events and markets, then fetches
              news from dozens of RSS sources. Event titles and article text are
              embedded with <span className="text-cyan-400 font-mono text-sm">EmbeddingGemma-300M</span>,
              stored in PostgreSQL with <span className="text-cyan-400 font-mono text-sm">pgvector</span>,
              and ranked by cosine similarity to surface the most relevant
              articles per event.
            </p>
            <p>
              The frontend is a Next.js 16 dashboard with auto-refreshing views.
              The backend is a FastAPI service serving the home feed, search,
              market data, and top-news endpoints. Everything runs in Docker
              Compose on a DigitalOcean droplet with Nginx and Certbot for HTTPS.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 md:py-20">
        <div className="page-center">
          <motion.h2
            {...fade}
            className="font-mono text-2xl font-bold text-zinc-100 mb-6"
          >
            Tech Stack
          </motion.h2>
          <motion.div {...fade} className="flex flex-wrap gap-2">
            {tech.map((t) => (
              <TechTag key={t} label={t} />
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </Layout>
  );
}
