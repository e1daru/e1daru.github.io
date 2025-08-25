import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import IntrepidBuildPage from "@/pages/IntrepidBuildPage";
import E2SPage from "@/pages/E2SPage";
import LuxuryPage from "@/pages/LuxuryPage";
import ECommerceAnalyticsPage from "@/pages/ECommerceAnalyticsPage";
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
    alt: "STAR Consulting Program",
    title: "STAR Consulting Program",
    desc: "Collaborated with MBA teammates to design a $6M affordable housing plan for 9K+ residents, using K-means segmentation and P&L modeling to cut costs by ~17–20%.",
    path: "/projects/intrepid-build",
  },
  {
    img: "/e2s.jpg",
    alt: "EATS2SEATS",
    title: "EATS2SEATS Data Analytics",
    desc: "Managed 85+ staff at the 2024 U.S. Open, automated payroll in Python, and built a Random Forest model reducing staff dropout by 11%.",
    path: "/projects/eats2seats",
  },
  {
    img: "/busi488.jpg",
    alt: "BUSI 488 Data Science Project",
    title: "Luxury Brand Classifier",
    desc: "Developed a RoBERTa-based model on 21K TikTok comments, delivering ~78% precision brand insights and cutting research costs by ~95%.",
    path: "/projects/luxury",
  },
  {
    img: "/ra.jpg",
    alt: "Research Assistant Project",
    title: "E-Commerce Analytics",
    desc: "Analyzed 15M+ purchase records to uncover key buying drivers and optimized large-scale data processing runtime.",
    path: "/projects/ecommerce-analytics",
  },
  {
    img: "/fullstack.jpg",
    alt: "Full-Stack Developer Project",
    title: "Office Hours Portal",
    desc: "Built a FastAPI + Angular ranking system for 2K+ students, improving profile clicks by 25% and reducing API latency by ~50%.",
    path: "/projects/office-hours-portal",
  },
  {
    img: "/competitions.jpg",
    alt: "Consulting Competitions",
    title: "Case Competition Wins",
    desc: "Deloitte Winner, P&G Finalist, UCC Winner—led teams delivering data-driven strategies under tight deadlines.",
    path: "/projects/competitions",
  },
];

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home projects={projects} />} />

      {/* Project detail pages */}
      <Route path="/projects/intrepid-build" element={<IntrepidBuildPage />} />
      <Route path="/projects/eats2seats" element={<E2SPage />} />
      <Route path="/projects/luxury" element={<LuxuryPage />} />
      <Route
        path="/projects/ecommerce-analytics"
        element={<ECommerceAnalyticsPage />}
      />
      <Route
        path="/projects/office-hours-portal"
        element={<ComingSoon title="Office Hours Portal" />}
      />
      <Route
        path="/projects/competitions"
        element={<ComingSoon title="Consulting Competitions" />}
      />

      {/* Fallback */}
      <Route path="*" element={<div className="p-8">Page not found</div>} />
    </Routes>
  );
}
