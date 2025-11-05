import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import IntrepidBuildPage from "@/pages/IntrepidBuildPage";
import E2SPage from "@/pages/E2SPage";
import LuxuryPage from "@/pages/LuxuryPage";
import ECommerceAnalyticsPage from "@/pages/ECommerceAnalyticsPage";
import AirPolPage from "@/pages/AirPolPage";
import type { Project } from "@/types";

// Simple placeholder page you can replace later
function ComingSoon({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-3xl p-8 text-center">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-2 text-slate-600">Full write-up coming soon.</p>
    </div>
  );
}

const projects: Project[] = [
  {
    img: "/STAR.jpg",
    alt: "$6M Affordable Housing Plan, Optimized with Data Science",
    title: "$6M Affordable Housing Plan, Optimized with Data Science",
    desc: "Teamed with MBAs to de-risk a construction firm's $6M housing project. Our data-driven strategy, P&L, and K-means marketing analysis slashed costs by ~20%.",
    path: "/projects/intrepid",
  },
  {
    img: "/e2s.jpg",
    alt: "EATS2SEATS",
    title: "US Open 2024 Operations Data Analytics",
    desc: "Built a smart tool that predicts staff cancellations and automates scheduling for large sport events. It cut last-minute no-shows by 11% and saved over 160 hours of administrative work per event, ensuring reliable staffing and major cost savings.",
    path: "/projects/e2s",
  },
  {
    img: "/airpol.jpg",
    alt: "Bishkek Air Pollution Analysis",
    title: "Bishkek Under the Dome: Data Behind the Smog",
    desc: "Deep-dive analysis of air quality in Bishkek, Kyrgyzstan. Using PurpleAir sensors and time-series forecasting, revealed pollution patterns 15× WHO limits and built predictive models to help families minimize exposure.",
    path: "/projects/airpol",
  },
  {
    img: "/busi488.jpg",
    alt: "BUSI 488 Data Science Project",
    title: "Decoding the Hype: Turning Social Noise into Luxury Brand Strategy",
    desc: "Decoding TikTok for luxury brands. Our AI classifier delivered 78% precise insights from 21K comments, slashing research budgets by 95%.",
    path: "/projects/luxury",
  },
  {
    img: "/ra.jpg",
    alt: "Research Assistant Project",
    title: "Data-Driven E-Commerce: Decoding 15 Million Purchases",
    desc: "Transformed massive purchase data into a strategic roadmap. By analyzing 15M+ records, we pinpointed critical buying triggers and engineered a optimized pipeline that dramatically accelerated processing speed for deep, scalable analysis.",
    path: "/projects/ecom",
  },
  {
    img: "/fullstack.jpg",
    alt: "Full-Stack Developer Project",
    title: "Leveling Up Learning: A Gamified Office Hours Portal",
    desc: "To boost participation, helped to design a gamify office hours portal featuring a dynamic ranking and rewards system with points, badge, and ranking features. The result was a 25% surge in profile clicks out of 2,000+ CS students.",
    path: "/projects/CSportal",
  },
  {
    img: "/competitions.jpg",
    alt: "Consulting Competitions",
    title: "Case Competitions: Award-Winning Strategy & Team Leadership",
    desc: "Spearheaded multiple teams to victory in high-stakes case competitions for Deloitte and P&G. We consistently delivered winning, data-driven strategies under intense pressure and tight deadlines.",
    path: "/projects/CCC",
  },
];

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home projects={projects} />} />

      {/* Project detail pages */}
      <Route path="/projects/intrepid" element={<IntrepidBuildPage />} />
      <Route path="/projects/e2s" element={<E2SPage />} />
      <Route path="/projects/airpol" element={<AirPolPage />} />
      <Route path="/projects/luxury" element={<LuxuryPage />} />
      <Route path="/projects/ecom" element={<ECommerceAnalyticsPage />} />
      <Route
        path="/projects/CSportal"
        element={<ComingSoon title="Office Hours Portal " />}
      />
      <Route
        path="/projects/CCC"
        element={<ComingSoon title="Consulting Competitions" />}
      />

      {/* Fallback */}
      <Route path="*" element={<div className="p-8">Page not found</div>} />
    </Routes>
  );
}
