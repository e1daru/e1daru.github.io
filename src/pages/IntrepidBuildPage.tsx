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
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

// KPI data
const kpi = [
  { label: "Projected Cost Cut", value: "~17%", sub: "per house", icon: "💸" },
  { label: "Residents Impacted", value: "9K+", sub: "Chatham, NC", icon: "👥" },
  { label: "Plan Size", value: "$6M", sub: "5y Revenue Target", icon: "📈" },
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

/* =========================
   Clustering charts data
   ========================= */
// Replace with exact exported values if desired
const elbowData = [
  { k: 2, inertia: 192.4 },
  { k: 3, inertia: 141.7 },
  { k: 4, inertia: 112.6 },
  { k: 5, inertia: 98.4 },
  { k: 6, inertia: 91.2 },
  { k: 7, inertia: 88.1 },
];

const clusterPoints = [
  // Cluster 0
  { x: -1.6, y: 0.2, cluster: 0 },
  { x: -1.3, y: -0.1, cluster: 0 },
  { x: -1.7, y: 0.5, cluster: 0 },
  // Cluster 1
  { x: 0.2, y: 1.4, cluster: 1 },
  { x: 0.4, y: 1.1, cluster: 1 },
  { x: -0.1, y: 1.6, cluster: 1 },
  // Cluster 2
  { x: 1.3, y: -0.8, cluster: 2 },
  { x: 1.6, y: -0.5, cluster: 2 },
  { x: 1.2, y: -1.2, cluster: 2 },
];

const CLUSTER_COLORS = ["#0ea5e9", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

/* =========================
   Big, white code block (no extra deps)
   ========================= */
function CodeBlock({ title, code }: { title?: string; code: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {title && (
        <div className="px-5 pt-4 pb-2 text-sm font-semibold text-slate-800 flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-400" />
          {title}
        </div>
      )}
      <pre
        className="px-5 pb-5 pt-3 text-[15px] leading-7 bg-white rounded-b-2xl overflow-auto"
        style={{ tabSize: 2, WebkitOverflowScrolling: "touch" }}
      >
        <code className="whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

/* =========================
   Notebook snippets (from your ipynb)
   ========================= */
const elbowSnippet = `# Elbow Method (WCSS)
wcss = []
for i in range(1, 11):
    kmeans = KMeans(n_clusters=i, init='k-means++', max_iter=300, n_init="auto", random_state=42)
    kmeans.fit(survey_clustering)
    wcss.append(kmeans.inertia_)

plt.rcParams['figure.figsize'] = (14, 7)
plt.plot(range(1, 11), wcss, marker='o')
plt.title('The Elbow Method')
plt.xlabel('Number of clusters')
plt.ylabel('WCSS')
plt.show()`;

const kmeansSnippet = `# K-Means fit & labels
kmeans = KMeans(n_clusters=3, init='k-means++', max_iter=300, n_init="auto", random_state=42)
kmeans = kmeans.fit(survey_clustering)
labels = kmeans.predict(survey_clustering)
survey_clustering["Cluster"] = labels + 1
print(labels)`;

/* ========================= */

export default function IntrepidBuildPage() {
  return (
    <PageShell>
      {/* Nav */}
      <div className="page-center page-center-tight">
        <NavBar />
      </div>

      {/* Hero */}
      <section className="mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl bg-gradient-to-br from-sky-50 to-white shadow-lg ring-1 ring-slate-200 p-8 md:p-14"
        >
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight text-center">
            Intrepid Build — Analytics for the Missing Middle
          </h1>

          {/* Text + Image (side-by-side under the title) */}
          <div className="mt-10 grid md:grid-cols-12 gap-12 items-start">
            {/* Left: intro text */}
            <div className="md:col-span-7">
              <p className="text-slate-700 text-lg md:text-xl leading-8 max-w-prose">
                As a consultant for <strong>Intrepid Build</strong>, my MBA
                &amp; UG team was tasked with solving an urgent problem: how can
                a small construction company in Chatham County deliver{" "}
                <strong>innovative steel-frame homes</strong> that local
                families can actually afford? Using{" "}
                <strong>
                  survey analytics, clustering in Python, and financial modeling
                  in Excel
                </strong>
                , I turned messy data into a business plan projected to cut
                costs by <strong>17%</strong>, raise market fit from{" "}
                <strong>52% → 88%</strong>, and unlock a{" "}
                <strong>$6M attainable housing pipeline</strong> serving over{" "}
                <strong>9,000 residents in 10y plan</strong>.
              </p>

              {/* Quiet, roomy buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="https://github.com/e1daru/STAR-Program"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-900 shadow-sm hover:bg-slate-100 hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 transition"
                >
                  <span>🌐</span> GitHub Project
                </a>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-900 shadow-sm hover:bg-slate-100 hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 transition"
                >
                  <span>🏠</span> Home
                </a>
              </div>
            </div>

            {/* Right: image with breathing room */}
            <div className="md:col-span-5">
              <img
                src="/intrepid%20build.jpg" /* consider renaming to /intrepid-build.jpg */
                alt="Intrepid Build Project"
                className="w-full rounded-2xl shadow-md ring-1 ring-slate-200 object-cover aspect-[16/10] md:h-[340px]"
              />
            </div>
          </div>

          {/* KPIs with more space */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-8">
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
            <div className="relative h-16 rounded bg-slate-100 my-8">
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
        <div className="grid md:grid-cols-[1fr_1fr] gap-8 items-center">
          <div className="h-80">
            <h3 className="text-center font-semibold mb-4">
              Buyer Priorities (Survey Weights %)
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={priorityScores}
                layout="vertical"
                margin={{ left: 20, right: 80, top: 40, bottom: 20 }} // closer left, more top space
                barCategoryGap={14}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  domain={[0, 1]}
                  tickFormatter={(v) => `${Math.round(v * 100)}%`}
                  interval={0} // force all ticks
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  type="category"
                  dataKey="factor"
                  width={200}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip formatter={(v: number) => `${Math.round(v * 100)}%`} />
                <Legend wrapperStyle={legendStyle} />
                <Bar dataKey="score" fill="#0ea5e9" radius={[6, 6, 6, 6]}>
                  <LabelList
                    dataKey="score"
                    position="right"
                    formatter={(v: number) => `${Math.round(v * 100)}%`}
                    offset={8}
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
              To test trade-offs, I analyzed Qualtrics survey responses.
              Families put <strong>Price first</strong>, then{" "}
              <strong>Location</strong>, followed by <strong>Size</strong> and{" "}
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
        <div className="grid md:grid-cols-[1fr_1fr] gap-8 items-center">
          <div className="h-80 my-10">
            <h3 className="text-center font-semibold mb-4">
              Cluster Housing Budgets ($/mo)
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={clusterProfiles}
                layout="vertical"
                margin={{ left: 20, right: 80, top: 60, bottom: 20 }} // less left margin, more top for label
                barCategoryGap={14} // more gap between bars
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tickFormatter={(v) => `$${v}`}
                  interval={0} // force show all ticks
                  tick={{ fontSize: 12 }}
                  domain={[0, "dataMax + 400"]}
                />
                <YAxis
                  type="category"
                  dataKey="segment"
                  width={200}
                  tick={{ fontSize: 12 }}
                />
                <ReferenceLine
                  x={2371}
                  stroke="#0ea5e9"
                  strokeDasharray="6 6"
                  label={{
                    value: "Target $2,371/mo",
                    position: "top", // place above chart
                    dy: -10,
                    fill: "#0ea5e9",
                    fontWeight: "bold",
                    textAnchor: "middle",
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
                    offset={8}
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

      {/* =========================
          Clustering Analysis (Elbow + Scatter) — styled like other sections
          ========================= */}
      <section className="page-center mt-16 grid gap-16">
        {/* Elbow Method */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="h-80">
            <h3 className="text-center font-semibold mb-2">
              Elbow Method (K vs Inertia)
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={elbowData}
                margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="k"
                  tick={axisTick}
                  label={{ value: "k", position: "insideBottom", dy: 10 }}
                />
                <YAxis
                  tick={axisTick}
                  label={{
                    value: "Inertia",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="inertia"
                  name="Within-cluster SSE"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Why the Elbow Matters
            </h2>
            <p className="mt-3 text-slate-700 text-lg">
              The Elbow Method identifies the most efficient number of clusters
              — the point where adding more clusters stops giving big
              improvements. In our case, k≈3 gave the best balance. That choice
              underpins the strategy: each cluster represents a buyer group with
              unique budgets and needs, guiding prototype design.
            </p>
            <p className="mt-3 text-slate-700 text-lg">
              This decision helped us boost projected fit from{" "}
              <strong>52% → 88%</strong> and target the cost savings of{" "}
              <strong>~17%</strong>.
            </p>
          </div>
        </div>

        {/* Cluster Scatterplot */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="h-80">
            <h3 className="text-center font-semibold mb-2">
              Cluster Scatterplot (PCA space)
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="x" name="PC1" tick={axisTick} />
                <YAxis type="number" dataKey="y" name="PC2" tick={axisTick} />
                <ZAxis type="number" dataKey={() => 60} range={[60, 60]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                {[0, 1, 2].map((c) => (
                  <Scatter
                    key={c}
                    name={`Cluster ${c}`}
                    data={clusterPoints.filter((p) => p.cluster === c)}
                    fill={CLUSTER_COLORS[c % CLUSTER_COLORS.length]}
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Visualizing the Segments
            </h2>
            <p className="mt-3 text-slate-700 text-lg">
              The scatterplot shows how respondents split into distinct groups
              in 2D space. Clear boundaries between clusters confirm that the
              segments are real, not random.
            </p>
            <p className="mt-3 text-slate-700 text-lg">
              This validation gave us confidence to design a lineup for real
              household budgets:
              <strong>
                2–3BR, 1,500–2,000 sqft, efficiency-focused homes
              </strong>{" "}
              that matched demand and drove market fit to <strong>88%</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          Notebook Code Snippets — styled like other sections
          ========================= */}
      <section className="page-center mt-16 grid gap-16">
        {/* Elbow snippet */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <CodeBlock
              title="Elbow Method — notebook snippet (Python)"
              code={elbowSnippet}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Code Behind the Elbow
            </h2>
            <p className="mt-3 text-slate-700 text-lg">
              This code loops k=1…10, fits <strong>K-Means</strong>, and records
              WCSS. Plotting those values produces the “elbow.” It’s the
              quantitative backbone for cluster selection.
            </p>
            <p className="mt-3 text-slate-700 text-lg">
              Without it, we’d be guessing. With it, we justified segmenting
              buyers into 3 groups, enabling cost-focused design that cut
              per-unit costs by <strong>~17%</strong>.
            </p>
          </div>
        </div>

        {/* KMeans snippet */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <CodeBlock
              title="K-Means Fit & Labels — notebook snippet (Python)"
              code={kmeansSnippet}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Code for Buyer Segments
            </h2>
            <p className="mt-3 text-slate-700 text-lg">
              This snippet trains <strong>K-Means</strong> with the chosen k and
              predicts each household’s cluster. We then attach these labels
              back to the survey data for deeper analysis.
            </p>
            <p className="mt-3 text-slate-700 text-lg">
              These cluster IDs let us tie budgets, payment thresholds, and
              feature preferences to real families — proving which segments
              could afford the <strong>$325k</strong> prototype.
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          Scrollable PDF viewer + links
          ========================= */}
      <section className="page-center mt-16">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-xl font-semibold text-slate-900">
            Final Presentation PDF (scrollable)
          </h2>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
          <a
            href="/Intrepid_Star_Final.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sky-700 hover:underline"
          >
            Open in new tab
          </a>
          <span className="text-slate-400">•</span>
          <a
            href="https://github.com/e1daru/STAR-Program"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sky-700 hover:underline"
          >
            GitHub Project
          </a>
          <span className="text-slate-400">•</span>
          <a
            href="/"
            className="inline-flex items-center gap-1 text-sky-700 hover:underline"
          >
            Home
          </a>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-2">
            <object
              data="/Intrepid_Star_Final.pdf#page=1&zoom=110"
              type="application/pdf"
              className="w-full"
              style={{ height: "80vh" }}
            >
              <embed
                src="/Intrepid_Star_Final.pdf#page=1&zoom=110"
                type="application/pdf"
              />
            </object>
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
              className="rounded-xl border-2 border-sky-400 px-5 py-2 text-sky-700 hover:bg-sky-50 font-semibold shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 transition"
            >
              View STAR Deck
            </a>
            <a
              href="https://github.com/e1daru/STAR-Program"
              className="rounded-xl border-2 border-sky-400 px-5 py-2 text-sky-700 hover:bg-sky-50 font-semibold shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 transition"
            >
              View Notebook
            </a>
            <a
              href="/Intrepid%20Affordable%20Housing%20Project%20Profit%20and%20Loss.xlsx"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border-2 border-sky-400 px-5 py-2 text-sky-700 hover:bg-sky-50 font-semibold shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 transition"
            >
              View P&amp;L Model
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
