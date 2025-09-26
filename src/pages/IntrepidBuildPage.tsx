import React from "react";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import NavBar from "@/components/NavBar";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LabelList,
  ReferenceLine,
} from "recharts";

// KPI data
const kpi = [
  { label: "Projected Cost Cut", value: "~17%", sub: "per unit", icon: "💸" },
  { label: "Residents Impacted", value: "9K+", sub: "Chatham, NC", icon: "👥" },
  { label: "Plan Size", value: "$6M", sub: "Revenue Target", icon: "📈" },
];

// Chart helpers
const chartMargin = { top: 24, right: 28, bottom: 44, left: 28 };
const axisTick = { fontSize: 12 } as const;
const legendStyle = { fontSize: 12 } as const;

// Data
const priceBands = [
  { band: "<$400k", pct: 22 },
  { band: "$400–600k", pct: 60 },
  { band: ">$600k", pct: 18 },
];

const affordability = {
  medianIncome: 83000,
  requiredIncome: 136000,
  maxView: 160000,
};

const costBurden = [
  { name: "Cost-burdened renters", value: 47 },
  { name: "Not cost-burdened renters", value: 53 },
];
const donutColors = ["#0ea5e9", "#94a3b8"];

const prefSF = [
  { series: "Local SFH preference", pct: 62 },
  { series: "National SFH preference", pct: 75 },
];

const unitEconomics = [
  { name: "Land + Entitlement", Before: 120, After: 110 },
  { name: "Structure", Before: 180, After: 145 },
  { name: "MEP (Systems)", Before: 95, After: 86 },
  { name: "Finishes", Before: 115, After: 97 },
];

const priorityScores = [
  { factor: "Price (Total Cost)", score: 1.0 },
  { factor: "Location", score: 0.85 },
  { factor: "Size", score: 0.7 },
  { factor: "Energy Efficiency", score: 0.55 },
  { factor: "Customization", score: 0.38 },
];

const fitImprovement = [
  { label: "Baseline market fit", pct: 52 },
  { label: "Optimized lineup fit", pct: 88 },
];

const monthlyPayments = [
  { price: "$200k", pmt: 1756 },
  { price: "$325k", pmt: 2371 },
  { price: "$465k", pmt: 3384 },
];

const clusterProfiles = [
  { segment: "Value Seekers", budget: 1900 },
  { segment: "Space-Oriented", budget: 2400 },
  { segment: "Efficiency-First", budget: 2100 },
  { segment: "Premium Pragmatists", budget: 2700 },
];

export default function IntrepidBuildPage() {
  return (
    <PageShell>
      {/* Nav */}
      <div className="page-center page-center-tight">
        <NavBar />
      </div>

      {/* Hero */}
      <section className="page-center mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl bg-gradient-to-br from-sky-50 to-white shadow-lg ring-1 ring-slate-200 p-8"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">
            Intrepid Build — Analytics for the Missing Middle
          </h1>
          <p className="mt-4 text-slate-700 max-w-3xl text-lg md:text-xl">
            As a consultant for <strong>Intrepid Build</strong>, I was tasked
            with solving an urgent problem: how can a small construction company
            in Chatham County deliver <strong>single-family homes</strong> that
            local families can actually afford? Using{" "}
            <strong>
              survey analytics, clustering in Python, and financial modeling in
              Excel
            </strong>
            , I turned messy data into a business plan projected to cut costs by{" "}
            <strong>17%</strong>, raise market fit from{" "}
            <strong>52% → 88%</strong>, and unlock a{" "}
            <strong>$6M attainable housing pipeline</strong> serving over{" "}
            <strong>9,000 residents</strong>.
          </p>

          {/* KPIs */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {kpi.map((k) => (
              <div
                key={k.label}
                className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="text-3xl">{k.icon}</div>
                <div className="mt-2 text-4xl font-extrabold text-slate-900">
                  {k.value}
                </div>
                <div className="text-sm uppercase tracking-wide text-slate-500 mt-1">
                  {k.label}
                </div>
                <div className="text-base text-slate-600">{k.sub}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Market Skew */}
      <section className="page-center mt-16 grid gap-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="h-80">
            <h3 className="text-center font-semibold mb-2">
              Home Sales by Price Range (%)
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priceBands} margin={chartMargin}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="band" tick={axisTick} />
                <YAxis unit="%" tick={axisTick} />
                <Tooltip />
                <Legend wrapperStyle={legendStyle} />
                <Bar dataKey="pct" fill="#0ea5e9" radius={[6, 6, 0, 0]}>
                  <LabelList
                    dataKey="pct"
                    position="top"
                    formatter={(v: number) => `${v}%`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              The Market Skew
            </h2>
            <p className="mt-3 text-slate-700 text-lg">
              Nearly <strong>4 out of 5 homes</strong> in Chatham County sell
              above <strong>$400k</strong>, with most clustered between
              $400–600k. I analyzed MLS and census data in Python to visualize
              these bands — and the skew was unmistakable. Supply exists, but
              almost entirely outside the range middle-income families can pay.
            </p>
          </div>
        </div>

        {/* Affordability Gap */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-center font-semibold mb-2">
              Household Income vs. Needed Income ($/year)
            </h3>
            <div className="relative h-16 rounded bg-slate-100">
              <div
                style={{
                  width: `${
                    ((affordability.maxView - affordability.requiredIncome) /
                      affordability.maxView) *
                    100
                  }%`,
                }}
                className="absolute inset-y-0 right-0 bg-sky-200"
              />
              <div
                style={{
                  left: `${
                    (affordability.medianIncome / affordability.maxView) * 100
                  }%`,
                }}
                className="absolute -top-5 text-sm text-slate-700"
              >
                Median $83k
              </div>
              <div
                style={{
                  left: `${
                    (affordability.requiredIncome / affordability.maxView) * 100
                  }%`,
                }}
                className="absolute -bottom-5 text-sm font-medium text-sky-700"
              >
                Needed ~$136k
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              The Affordability Gap
            </h2>
            <p className="mt-3 text-slate-700 text-lg">
              A <strong>$465k home</strong> requires about{" "}
              <strong>$136k household income</strong> under standard DTI rules,
              but the local median is just <strong>$83k</strong>. Using Excel
              models, I translated sticker prices into payment thresholds to
              show why renters — nearly{" "}
              <strong>half already cost-burdened</strong> — can’t move up.
              Surveys confirmed the desire:{" "}
              <strong>
                62% of households still prefer single-family homes
              </strong>
              . The demand is there, but the ladder is missing rungs.
            </p>
          </div>
        </div>
      </section>

      {/* Costs & Priorities */}
      <section className="page-center mt-16 grid gap-12">
        {/* Unit Economics */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="h-80">
            <h3 className="text-center font-semibold mb-2">
              Unit Cost Components ($ thousands)
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={unitEconomics} margin={chartMargin}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={axisTick} />
                <YAxis
                  tick={axisTick}
                  label={{ value: "$ thousands", angle: -90 }}
                />
                <Tooltip />
                <Legend wrapperStyle={legendStyle} />
                <Bar dataKey="Before" fill="#94a3b8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="After" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Where the Dollars Sit
            </h2>
            <p className="mt-3 text-slate-700 text-lg">
              Breaking down the P&amp;L, I found per-unit costs at{" "}
              <strong>≈$262k</strong>. The major buckets —{" "}
              <strong>Interiors (~22%)</strong>, <strong>MEP (~20%)</strong>,{" "}
              <strong>Framing (~18%)</strong>, and{" "}
              <strong>Overhead (~27%)</strong> — explained why affordability was
              slipping. Any overdesign here immediately priced households out.
            </p>
          </div>
        </div>

        {/* Buyer Priorities */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="h-80">
            <h3 className="text-center font-semibold mb-2">
              Buyer Priorities (Survey Weights %)
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={priorityScores}
                layout="vertical"
                margin={chartMargin}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  domain={[0, 1]}
                  tickFormatter={(v) => `${Math.round(v * 100)}%`}
                />
                <YAxis
                  type="category"
                  dataKey="factor"
                  width={200}
                  tick={axisTick}
                />
                <Tooltip formatter={(v: number) => `${Math.round(v * 100)}%`} />
                <Legend wrapperStyle={legendStyle} />
                <Bar dataKey="score" fill="#0ea5e9" radius={[6, 6, 6, 6]}>
                  <LabelList
                    dataKey="score"
                    position="right"
                    formatter={(v: number) => `${Math.round(v * 100)}%`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              What Buyers Really Value
            </h2>
            <p className="mt-3 text-slate-700 text-lg">
              To test trade-offs, I analyzed 80+ survey responses. Families put{" "}
              <strong>Price first</strong>, then <strong>Location</strong>,
              followed by <strong>Size</strong> and{" "}
              <strong>Energy Efficiency</strong>.{" "}
              <strong>Customization ranked last</strong>. The insight was clear:
              households will pay for comfort and operating efficiency, not
              luxury finishes that bloat carrying costs.
            </p>
          </div>
        </div>
      </section>

      {/* Aligning Products */}
      <section className="page-center mt-16 grid gap-12">
        {/* Market Fit */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="h-80">
            <h3 className="text-center font-semibold mb-2">
              Projected Market Fit (%)
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fitImprovement} margin={chartMargin}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={axisTick} />
                <YAxis unit="%" tick={axisTick} />
                <Tooltip />
                <Legend wrapperStyle={legendStyle} />
                <Bar dataKey="pct" fill="#0ea5e9" radius={[6, 6, 0, 0]}>
                  <LabelList
                    dataKey="pct"
                    position="top"
                    formatter={(v: number) => `${v}%`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Aligning Product with Demand
            </h2>
            <p className="mt-3 text-slate-700 text-lg">
              Using clustering in Python, I segmented buyers into four groups
              with distinct budgets and preferences. At least two clusters
              cleared the affordability line for a $325k home. When I modeled an
              optimized lineup — <strong>1,500–2,000 sqft</strong>,{" "}
              <strong>2–3BR</strong>, efficient envelope — projected market fit
              jumped from <strong>52% → 88%</strong>.
            </p>
          </div>
        </div>

        {/* Payment Benchmarks */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="h-80">
            <h3 className="text-center font-semibold mb-2">
              Monthly Payment Benchmarks ($/mo)
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyPayments} margin={chartMargin}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="price" tick={axisTick} />
                <YAxis tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(v: number) => `$${v.toLocaleString()}/mo`}
                />
                <Legend wrapperStyle={legendStyle} />
                <Bar dataKey="pmt" fill="#94a3b8" radius={[6, 6, 0, 0]}>
                  <LabelList
                    dataKey="pmt"
                    position="top"
                    formatter={(v: number) => `$${v.toLocaleString()}`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Payments Households Can Clear
            </h2>
            <p className="mt-3 text-slate-700 text-lg">
              Families buy based on monthly payments, not sticker prices. My
              P&amp;L payment modeling showed <strong>$265k → $1,970/mo</strong>
              , <strong>$325k → $2,371/mo</strong>,{" "}
              <strong>$465k → $3,384/mo</strong>. The{" "}
              <strong>$310–330k band</strong> hit the sweet spot: affordable to
              80–120% AMI households while sustaining builder margins.
            </p>
          </div>
        </div>

        {/* Cluster Budgets */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="h-80">
            <h3 className="text-center font-semibold mb-2">
              Cluster Housing Budgets ($/mo)
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={clusterProfiles}
                layout="vertical"
                margin={chartMargin}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(v) => `$${v}`} />
                <YAxis
                  type="category"
                  dataKey="segment"
                  width={200}
                  tick={axisTick}
                />
                <ReferenceLine
                  x={2371}
                  stroke="#0ea5e9"
                  strokeDasharray="6 6"
                  label={{
                    value: "Target $2,371/mo",
                    position: "insideTopRight",
                    fill: "#0ea5e9",
                  }}
                />
                <Tooltip
                  formatter={(v: number) => `$${v.toLocaleString()}/mo`}
                />
                <Legend wrapperStyle={legendStyle} />
                <Bar dataKey="budget" fill="#0ea5e9" radius={[6, 6, 6, 6]}>
                  <LabelList
                    dataKey="budget"
                    position="right"
                    formatter={(v: number) => `$${v.toLocaleString()}/mo`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Validated by Segments
            </h2>
            <p className="mt-3 text-slate-700 text-lg">
              My clustering analysis identified four buyer types:{" "}
              <strong>Value Seekers (~$1,900/mo)</strong>,{" "}
              <strong>Space-Oriented (~$2,400/mo)</strong>,{" "}
              <strong>Efficiency-First (~$2,100/mo)</strong>, and{" "}
              <strong>Premium Pragmatists (~$2,700/mo)</strong>. At least two
              clusters could afford the $325k prototype, proving real absorption
              potential.
            </p>
          </div>
        </div>
      </section>

      {/* Result */}
      <section className="page-center mt-20 mb-24">
        <div className="rounded-2xl bg-gradient-to-br from-green-50 to-white border border-green-100 p-8 shadow-sm text-center">
          <h2 className="text-3xl font-bold text-slate-900">📊 The Result</h2>
          <p className="mt-4 text-lg text-slate-700 max-w-3xl mx-auto">
            With disciplined design choices backed by data, Intrepid Build is
            projected to cut <strong>~17% per-unit cost</strong>, raise market
            fit from <strong>52% → 88%</strong>, and deliver a{" "}
            <strong>$6M attainable housing plan</strong> serving{" "}
            <strong>9,000+ residents</strong>. This wasn’t about building cheap
            — it was about building smart, aligning features with what
            households value and what their incomes can sustain.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <a
              href="/Intrepid_Star_Final.pdf"
              className="rounded-xl border border-sky-200 px-5 py-2 text-sky-700 hover:bg-sky-50 transition"
            >
              View STAR Deck
            </a>
            <a
              href="/STAR_marketing_analysis.ipynb"
              className="rounded-xl border border-sky-200 px-5 py-2 text-sky-700 hover:bg-sky-50 transition"
            >
              View Notebook
            </a>
            <a
              href="/Intrepid Affordable Housing Project Profit and Loss.xlsx"
              className="rounded-xl border border-sky-200 px-5 py-2 text-sky-700 hover:bg-sky-50 transition"
            >
              View P&amp;L Model
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
