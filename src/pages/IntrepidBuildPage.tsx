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
  ReferenceLine,
  LabelList,
  Label,
} from "recharts";

/**
 * IntrepidBuildPage — Buildup • Conflict • Solution (boxed layout)
 * Story-first, with each chart + explanation in a clean box for easy scanning.
 * Deps: npm i recharts framer-motion
 */

// KPI (hero)
const kpi = [
  { label: "Projected Cost Cut", value: "~17%", sub: "per unit" },
  { label: "Residents Impacted", value: "9K+", sub: "Chatham, NC" },
  { label: "Plan Size", value: "$6M", sub: "revenue target" },
];

// Chart layout helpers
const chartMargin = { top: 24, right: 28, bottom: 44, left: 28 };
const axisTick = { fontSize: 12 } as const;
const legendStyle = { fontSize: 12 } as const;

// ── DATA — Buildup
const priceBands = [
  { band: "<$400k", pct: 22 }, // ~78% are ≥$400k
  { band: "$400–600k", pct: 60 },
  { band: ">$600k", pct: 18 },
];

const affordability = {
  medianIncome: 83000,
  requiredIncome: 136000,
  maxView: 160000,
};

const costBurden = [
  { name: "Cost‑burdened renters", value: 47 },
  { name: "Not cost‑burdened renters", value: 53 },
];
const donutColors = ["#0ea5e9", "#94a3b8"]; // sky/slate

const prefSF = [
  { series: "Local SFH preference", pct: 62 },
  { series: "National SFH preference", pct: 75 },
];

// ── DATA — Conflict
const unitEconomics = [
  { name: "Land + Entitlement", Before: 120, After: 110 },
  { name: "Structure", Before: 180, After: 145 },
  { name: "MEP (Systems)", Before: 95, After: 86 },
  { name: "Finishes (Interior)", Before: 115, After: 97 },
  { name: "Soft Costs + Overhead", Before: 90, After: 78 },
];

const priorityScores = [
  { factor: "Price (Total Cost)", score: 1.0 },
  { factor: "Location (Commute/Schools)", score: 0.85 },
  { factor: "Size (Sqft/Bedrooms)", score: 0.7 },
  { factor: "Energy Efficiency (Utilities)", score: 0.55 },
  { factor: "New Construction", score: 0.42 },
  { factor: "Customization", score: 0.38 },
  { factor: "Amenities (Community)", score: 0.34 },
];

// ── DATA — Solution
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
  {
    segment: "Value Seekers",
    budget: 1900,
    size: 0.28,
    topPrefs: "SFH, 2–3BR, modest finishes",
  },
  {
    segment: "Space‑Oriented",
    budget: 2400,
    size: 0.33,
    topPrefs: "1.8–2.2k sqft, 3BR",
  },
  {
    segment: "Efficiency‑First",
    budget: 2100,
    size: 0.22,
    topPrefs: "EE windows, insulation, low utilities",
  },
  {
    segment: "Premium Pragmatists",
    budget: 2700,
    size: 0.17,
    topPrefs: "durable exterior, quick build",
  },
];

function SourceNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 text-[12px] md:text-[13px] text-slate-500">
      {children}
    </div>
  );
}

export default function IntrepidBuildPage() {
  const tweetHook = `We cut per‑unit cost ~17% and lifted market fit to ~88% by letting buyer data pick the spec and the P&L call the shots. #DataScience #Housing #AffordableHomes`;

  return (
    <PageShell>
      {/* Nav */}
      <div className="page-center page-center-tight">
        <NavBar />
      </div>

      {/* Hero */}
      <section className="page-center mt-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl bg-white/70 shadow-lg ring-1 ring-slate-200 p-6 md:p-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Intrepid Build — A Data‑Driven Path to Attainable SFH
          </h1>
          <p className="mt-3 text-slate-700 max-w-3xl text-lg md:text-xl">
            In a market where{" "}
            <span className="font-semibold">~78% of sales are $400k+</span> and
            the median income is ~<span className="font-semibold">$83k</span>,
            we used surveys + segmentation + a prototype P&L to design a
            single‑family lineup that{" "}
            <span className="font-semibold">cuts cost ~17%</span> and
            <span className="font-semibold"> boosts market fit to ~88%</span>.
            Data chooses the spec; finance chooses the price.
          </p>

          {/* KPI — boxed */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {kpi.map((k) => (
              <div
                key={k.label}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="text-4xl md:text-5xl font-extrabold leading-none text-slate-900">
                  {k.value}
                </div>
                <div className="text-xs md:text-sm uppercase tracking-wide text-slate-500 mt-2">
                  {k.label}
                </div>
                <div className="text-base text-slate-600">{k.sub}</div>
              </div>
            ))}
          </div>

          {/* Tweetable hook */}
          <div className="mt-6 rounded-xl border border-sky-100 bg-sky-50 p-5 text-slate-800">
            <div className="text-[11px] md:text-xs uppercase tracking-wide text-sky-700 font-semibold">
              Hook (tweet‑able)
            </div>
            <p className="mt-1 text-sm md:text-base">{tweetHook}</p>
          </div>
        </motion.div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* BUILDUP */}
      <section className="page-center mt-12 grid gap-8">
        {/* 1. Price Bands */}
        <div className="grid md:grid-cols-2 gap-8 items-center rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priceBands} margin={chartMargin}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="band" tick={axisTick} />
                <YAxis unit="%" tick={axisTick} />
                <Tooltip />
                <Legend wrapperStyle={legendStyle} />
                <Bar
                  dataKey="pct"
                  name="Share of sales"
                  fill="#0ea5e9"
                  radius={[8, 8, 0, 0]}
                >
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
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
              Buildup — Price‑Band Distribution
            </h2>
            <p className="mt-3 text-slate-700 text-base md:text-lg">
              It frames the problem. If most sales clear $400k, then supply for
              the middle is thin.
            </p>
            <p className="mt-2 text-slate-700 text-base md:text-lg">
              Roughly <strong>3 of 4</strong> transactions are at{" "}
              <strong>$400k+</strong>; only about <strong>22%</strong> are under
              $400k.
            </p>
            <p className="mt-2 text-slate-700 text-base md:text-lg">
              The entry price is too high for many 80–120% AMI households.
            </p>
            <p className="mt-2 text-slate-700 text-base md:text-lg">
              Reduce delivered cost via standardization and schedule compression
              — not by compromising livability.
            </p>
            <SourceNote>STAR Final (price distribution)</SourceNote>
          </div>
        </div>

        {/* 2. Affordability */}
        <div className="grid md:grid-cols-2 gap-8 items-center rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <div>
            <div className="text-sm md:text-base font-medium text-slate-900 mb-3">
              Affordability Threshold vs Local Incomes
            </div>
            <div className="mt-2 relative h-16 rounded bg-slate-100">
              <div
                style={{
                  width: `${
                    ((affordability.maxView - affordability.requiredIncome) /
                      affordability.maxView) *
                    100
                  }%`,
                }}
                className="absolute inset-y-0 right-0 bg-sky-200"
                aria-label="Income shortfall region"
              />
              <div
                style={{
                  left: `${
                    (affordability.medianIncome / affordability.maxView) * 100
                  }%`,
                }}
                className="absolute -top-5 text-[12px] md:text-sm text-slate-700"
              >
                Median $83k
              </div>
              <div
                style={{
                  left: `${
                    (affordability.requiredIncome / affordability.maxView) * 100
                  }%`,
                }}
                className="absolute -bottom-5 text-[12px] md:text-sm font-medium text-sky-700"
              >
                Needed ~$136k
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
              Buildup — Affordability Gap
            </h2>
            <p className="mt-3 text-slate-700 text-base md:text-lg">
              Price only matters through the payment buyers must carry.
            </p>
            <p className="mt-2 text-slate-700 text-base md:text-lg">
              A <strong>$465k</strong> home needs roughly <strong>$136k</strong>{" "}
              income (20% down, ~7.9%, 30% rule) vs a median{" "}
              <strong>$83k</strong>.
            </p>
            <p className="mt-2 text-slate-700 text-base md:text-lg">
              The gap explains why renter households can’t convert to ownership
              despite demand.
            </p>
            <p className="mt-2 text-slate-700 text-base md:text-lg">
              Set product pricing off <em>payment bands</em>; then back‑solve
              specifications to hit margin.
            </p>
            <SourceNote>STAR Final (affordability calc)</SourceNote>
          </div>
        </div>

        {/* 3. Rent burden + SFH preference */}
        <div className="grid md:grid-cols-2 gap-8 items-center rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <div className="grid sm:grid-cols-1 gap-8">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costBurden}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={100}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {costBurden.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={donutColors[idx % donutColors.length]}
                      />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" wrapperStyle={legendStyle} />
                  <Tooltip formatter={(v: number, n: string) => [`${v}%`, n]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prefSF} margin={chartMargin}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="series" tick={axisTick} />
                  <YAxis unit="%" tick={axisTick} />
                  <Tooltip />
                  <Legend wrapperStyle={legendStyle} />
                  <Bar
                    dataKey="pct"
                    name="SFH preference"
                    fill="#0ea5e9"
                    radius={[8, 8, 0, 0]}
                  >
                    <LabelList
                      dataKey="pct"
                      position="top"
                      formatter={(v: number) => `${v}%`}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
              Buildup — Pressure & Preference
            </h2>
            <p className="mt-3 text-slate-700 text-base md:text-lg">
              They show pressure in rentals <em>and</em> the persistent
              preference for SFH.
            </p>
            <p className="mt-2 text-slate-700 text-base md:text-lg">
              <span className="font-semibold">What they show:</span>{" "}
              <strong>47%</strong> of renters are cost‑burdened. Preference
              still leans SFH (local <strong>≈62%</strong> vs national{" "}
              <strong>≈75%</strong>).
            </p>
            <p className="mt-2 text-slate-700 text-base md:text-lg">
              The product shouldn’t change desire — it should change delivery so
              desired SFH becomes attainable.
            </p>
            <p className="mt-2 text-slate-700 text-base md:text-lg">
              Pursue SFH prototypes but engineer them to a payment‑anchored
              target.
            </p>
            <SourceNote>STAR Final (rent burden, SFH preference)</SourceNote>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* CONFLICT */}
      <section className="page-center mt-12 grid gap-8">
        {/* 1. Unit economics */}
        <div className="grid md:grid-cols-2 gap-8 items-center rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={unitEconomics} margin={chartMargin}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={axisTick} />
                <YAxis tick={axisTick}>
                  <Label
                    value="$ thousands"
                    angle={-90}
                    position="insideLeft"
                  />
                </YAxis>
                <Tooltip />
                <Legend wrapperStyle={legendStyle} />
                <Bar
                  dataKey="Before"
                  name="Before (baseline spec)"
                  fill="#94a3b8"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="After"
                  name="After (optimized spec)"
                  fill="#0ea5e9"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
              Conflict — Unit Cost Components: Before vs After
            </h2>
            <p className="mt-3 text-slate-700 text-base md:text-lg">
              It reveals where dollars actually sit — the levers we can pull
              without harming value.
            </p>
            <p className="mt-2 text-slate-700 text-base md:text-lg">
              Structure, MEP, and interior finishes dominate controllable cost.
            </p>
            <p className="mt-2 text-slate-700 text-base md:text-lg">
              Standardized SKUs + simplified details compress schedule and
              reduce carry — savings compound.
            </p>
            <p className="mt-2 text-slate-700 text-base md:text-lg">
              Lock a parts catalog, value‑engineer assemblies, and sequence
              trades for fewer handoffs.
            </p>
            <SourceNote>P&L model (component breakdown)</SourceNote>
          </div>
        </div>

        {/* 2. Priority weights */}
        <div className="grid md:grid-cols-2 gap-8 items-center rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <div className="h-96">
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
                  tick={axisTick}
                />
                <YAxis
                  dataKey="factor"
                  type="category"
                  width={280}
                  tick={axisTick}
                />
                <Tooltip formatter={(v: number) => `${Math.round(v * 100)}%`} />
                <Legend wrapperStyle={legendStyle} />
                <Bar
                  dataKey="score"
                  name="Importance weight"
                  fill="#0ea5e9"
                  radius={[8, 8, 8, 8]}
                >
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
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
              Conflict — What Buyers Actually Weight
            </h2>
            <p className="mt-3 text-slate-700 text-base md:text-lg">
              It prevents spec decisions from drifting toward aesthetics buyers
              won’t pay for.
            </p>
            <p className="mt-2 text-slate-700 text-base md:text-lg">
              <strong>Price</strong> dominates, followed by{" "}
              <strong>Location</strong>, then <strong>Size</strong> and{" "}
              <strong>Energy Efficiency</strong>.
            </p>
            <p className="mt-2 text-slate-700 text-base md:text-lg">
              Customization and premium amenities rank low — perfect places to
              save.
            </p>
            <p className="mt-2 text-slate-700 text-base md:text-lg">
              Invest in efficiency & livability, cut expensive flourish that
              doesn’t move these weights.
            </p>
            <SourceNote>STAR survey synthesis (priority ranking)</SourceNote>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* SOLUTION */}
      <section className="page-center mt-12 grid gap-8">
        {/* 1. Fit improvement */}
        <div className="grid md:grid-cols-2 gap-8 items-center rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fitImprovement} margin={chartMargin}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={axisTick} />
                <YAxis unit="%" tick={axisTick} />
                <Tooltip />
                <Legend wrapperStyle={legendStyle} />
                <Bar
                  dataKey="pct"
                  name="Market fit"
                  fill="#0ea5e9"
                  radius={[8, 8, 0, 0]}
                >
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
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
              Solution — Market Fit Improvement
            </h2>
            <p className="mt-3 text-slate-700 text-base md:text-lg">
              Fit predicts absorption speed and discount pressure.
            </p>
            <p className="mt-2 text-slate-700 text-base md:text-lg">
              Pruning to a lean SFH lineup (≈1,500–2,000 sqft, 2–3 BR, efficient
              envelope) lifts projected fit from <strong>≈52%</strong> to{" "}
              <strong>≈88%</strong>.
            </p>
            <p className="mt-2 text-slate-700 text-base md:text-lg">
              Less variety, better targeting → shorter marketing tails.
            </p>
            <p className="mt-2 text-slate-700 text-base md:text-lg">
              Lock the lean lineup and route savings to energy envelope +
              schedule.
            </p>
          </div>
        </div>

        {/* 2. Payment benchmarks */}
        <div className="grid md:grid-cols-2 gap-8 items-center rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyPayments} margin={chartMargin}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="price" tick={axisTick} />
                <YAxis tick={axisTick}>
                  <Label
                    value="$ / month (P&I)"
                    angle={-90}
                    position="insideLeft"
                  />
                </YAxis>
                <Tooltip
                  formatter={(v: number) => `$${v.toLocaleString()}/mo`}
                />
                <Legend wrapperStyle={legendStyle} />
                <Bar
                  dataKey="pmt"
                  name="Monthly payment"
                  fill="#94a3b8"
                  radius={[8, 8, 0, 0]}
                >
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
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
              Solution — Payment Benchmarks
            </h2>
            <p className="mt-3 text-slate-700 text-base md:text-lg">
              It makes pricing tangible in the way buyers decide — by payment.
            </p>
            <p className="mt-2 text-slate-700 text-base md:text-lg">
              $200k → <strong>$1,756/mo</strong>, $325k →{" "}
              <strong>$2,371/mo</strong>, $465k → <strong>$3,384/mo</strong>{" "}
              (P&I, 20% down, ~7.9%).
            </p>
            <p className="mt-2 text-slate-700 text-base md:text-lg">
              The <strong>$325k</strong> target sits in reach for multiple
              segments identified in the notebook.
            </p>
            <p className="mt-2 text-slate-700 text-base md:text-lg">
              Price homes to the <em>$2,371/mo</em> band; use options as add‑ons
              without breaking the threshold.
            </p>
            <SourceNote>P&L payment modeling</SourceNote>
          </div>
        </div>

        {/* 3. Segment budgets */}
        <div className="grid md:grid-cols-2 gap-8 items-center rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={clusterProfiles}
                layout="vertical"
                margin={chartMargin}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tickFormatter={(v) => `$${v.toLocaleString()}`}
                  domain={[0, 3000]}
                  tick={axisTick}
                />
                <YAxis
                  type="category"
                  dataKey="segment"
                  width={260}
                  tick={axisTick}
                />
                <Legend
                  verticalAlign="top"
                  payload={[
                    {
                      value: "Target $2,371/mo",
                      type: "line",
                      id: "ref",
                      color: "#0ea5e9",
                    },
                  ]}
                  wrapperStyle={legendStyle}
                />
                <Tooltip
                  formatter={(v: number) => `$${v.toLocaleString()}/mo`}
                  labelFormatter={(l) => `${l}`}
                />
                <ReferenceLine
                  x={2371}
                  ifOverflow="extendDomain"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  strokeDasharray="6 6"
                  label={{
                    value: "Target $2,371/mo",
                    position: "insideTopRight",
                    offset: 10,
                    fill: "#0ea5e9",
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="budget"
                  name="Median segment budget"
                  fill="#0ea5e9"
                  radius={[8, 8, 8, 8]}
                >
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
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
              Solution — Segment Budgets (Notebook)
            </h2>
            <p className="mt-3 text-slate-700 text-base md:text-lg">
              It validates whether our price target matches how clusters
              actually budget.
            </p>
            <p className="mt-2 text-slate-700 text-base md:text-lg">
              Median monthly budgets by segment with a dashed reference at{" "}
              <strong>$2,371/mo</strong>.
            </p>
            <p className="mt-2 text-slate-700 text-base md:text-lg">
              Segments clearing the line can absorb quickly without discounts;
              those below need either options or smaller plans.
            </p>
            <p className="mt-2 text-slate-700 text-base md:text-lg">
              Launch with the segments above the line; keep an alternative spec
              ready for the margin segment.
            </p>
            <SourceNote>
              STAR_marketing_analysis.ipynb (clusters) • P&L payment modeling
            </SourceNote>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="page-center mt-14 mb-24">
        <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-white border border-sky-100 p-6 md:p-8 shadow-sm">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
                Result
              </h2>
              <p className="mt-3 text-slate-700 text-base md:text-lg">
                With features aligned to preferences and costs trimmed where it
                counts, the lineup is projected to cut per‑unit cost by ~17% and
                lift fit from ~52% → ~88% — enabling more attainable homes,
                faster.
              </p>
              <div className="mt-5 flex gap-3">
                <a
                  href="/#/"
                  className="rounded-xl bg-sky-600 px-4 py-2 text-white hover:bg-sky-700 transition"
                >
                  Back to Home
                </a>
                <a
                  href="/Utiushev_Eldar_Resume.pdf"
                  className="rounded-xl border border-sky-200 px-4 py-2 text-sky-700 hover:bg-sky-50 transition"
                >
                  View Resume
                </a>
              </div>
            </div>
            <div className="md:col-span-1">
              <div className="rounded-xl overflow-hidden bg-slate-100 aspect-[4/3]">
                <img
                  src="/STAR.jpg"
                  alt="Project hero"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
