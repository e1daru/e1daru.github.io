import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import IntrepidBuildPage from "@/pages/IntrepidBuildPage";
import E2SPage from "@/pages/E2SPage";
import LuxuryPage from "@/pages/LuxuryPage";
import ECommerceAnalyticsPage from "@/pages/ECommerceAnalyticsPage";
import AirPolPage from "@/pages/AirPolPage";
import NewshiPage from "@/pages/NewshiPage";
import Layout from "@/components/Layout";
import NavBar from "@/components/NavBar";
import type { Project } from "@/types";

function ComingSoon({ title }: { title: string }) {
  return (
    <Layout>
      <NavBar />
      <div className="mx-auto max-w-3xl p-8 pt-24 text-center">
        <h1 className="text-3xl font-bold font-mono text-zinc-100">{title}</h1>
        <p className="mt-2 text-zinc-400">Full write-up coming soon.</p>
      </div>
    </Layout>
  );
}

const projects: Project[] = [
  {
    title: "Newshi: Bloomberg Terminal for Prediction Markets",
    desc: "A real-time analytics platform for Kalshi prediction markets featuring live pricing, volume tracking, and AI-matched news powered by semantic embeddings.",
    path: "/projects/newshi",
    img: "/newshi.jpeg",
    featured: true,
    tags: [
      "Next.js",
      "React",
      "TypeScript",
      "FastAPI",
      "Python",
      "PostgreSQL",
      "pgvector",
    ],
    liveUrl: "https://newshi.live",
    githubUrl: "https://github.com/e1daru/KalshiAnalytics",
  },
  {
    img: "/STAR.jpg",
    alt: "$6M Affordable Housing Plan",
    title: "$6M Affordable Housing Plan, Optimized with Data Science",
    desc: "Teamed with MBAs to de-risk a construction firm's $6M housing project. Our data-driven strategy, P&L, and K-means marketing analysis slashed costs by ~20%.",
    path: "/projects/intrepid",
    tags: ["Python", "K-Means", "Pandas", "Financial Modeling"],
  },
  {
    img: "/airpol.jpg",
    alt: "Bishkek Air Pollution Analysis",
    title: "Bishkek Under the Dome: Data Behind the Smog",
    desc: "Deep-dive analysis of air quality in Bishkek, Kyrgyzstan. Using PurpleAir sensors and time-series forecasting, revealed pollution patterns 15x WHO limits.",
    path: "/projects/airpol",
    tags: ["Python", "Time Series", "PurpleAir API", "Forecasting"],
  },
  {
    img: "/e2s.jpg",
    alt: "EATS2SEATS",
    title: "US Open 2024 Operations Data Analytics",
    desc: "Built a smart tool that predicts staff cancellations and automates scheduling for large sport events. It cut last-minute no-shows by 11% and saved over 160 hours per event.",
    path: "/projects/e2s",
    tags: ["Python", "Random Forest", "Pandas", "Scheduling"],
  },
  {
    img: "/busi488.jpg",
    alt: "BUSI 488 Data Science Project",
    title: "Decoding the Hype: Luxury Brand Strategy from TikTok",
    desc: "Decoding TikTok for luxury brands. Our AI classifier delivered 78% precise insights from 21K comments, slashing research budgets by 95%.",
    path: "/projects/luxury",
    tags: ["Python", "NLP", "TikTok API", "Classification"],
  },
  {
    img: "/ra.jpg",
    alt: "E-Commerce Analytics",
    title: "Data-Driven E-Commerce: Decoding 15 Million Purchases",
    desc: "Transformed massive purchase data into a strategic roadmap. Analyzed 15M+ records, pinpointed critical buying triggers, and engineered an optimized pipeline.",
    path: "/projects/ecom",
    tags: ["Python", "Pandas", "SQL", "Data Pipeline"],
  },
  {
    img: "/fullstack.jpg",
    alt: "Office Hours Portal",
    title: "Leveling Up Learning: A Gamified Office Hours Portal",
    desc: "Helped design a gamified office hours portal with a dynamic ranking and rewards system. The result was a 25% surge in profile clicks out of 2,000+ CS students.",
    path: "/projects/CSportal",
    tags: ["React", "Node.js", "PostgreSQL", "Gamification"],
  },
  {
    img: "/competitions.jpg",
    alt: "Consulting Competitions",
    title: "Case Competitions: Award-Winning Strategy & Leadership",
    desc: "Spearheaded multiple teams to victory in high-stakes case competitions for Deloitte and P&G with data-driven strategies under intense pressure.",
    path: "/projects/CCC",
    tags: ["Strategy", "Data Analysis", "Presentation"],
    liveUrl:
      "https://www.linkedin.com/posts/eldaru_i-am-happy-to-announce-that-my-team-and-i-activity-7111505631823486976-1Ytr?utm_source=share&utm_medium=member_desktop&rcm=ACoAADaP6vMBZTmyCqC9NKAmUHgCu2I54TmKXmk",
  },
];

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home projects={projects} />} />
      <Route path="/projects/newshi" element={<NewshiPage />} />
      <Route path="/projects/intrepid" element={<IntrepidBuildPage />} />
      <Route path="/projects/e2s" element={<E2SPage />} />
      <Route path="/projects/airpol" element={<AirPolPage />} />
      <Route path="/projects/luxury" element={<LuxuryPage />} />
      <Route path="/projects/ecom" element={<ECommerceAnalyticsPage />} />
      <Route
        path="/projects/CSportal"
        element={<ComingSoon title="Office Hours Portal" />}
      />
      <Route
        path="/projects/CCC"
        element={<ComingSoon title="Consulting Competitions" />}
      />
      <Route
        path="*"
        element={
          <Layout>
            <NavBar />
            <div className="p-8 pt-24 text-center text-zinc-400">
              Page not found
            </div>
          </Layout>
        }
      />
    </Routes>
  );
}
