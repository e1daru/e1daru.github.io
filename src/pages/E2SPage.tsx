import React from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  Cell,
  LabelList,
} from "recharts";

// ---------- Tiny JSON fetch hook ----------
function useJSON<T = any>(url: string) {
  const [data, setData] = React.useState<T | null>(null);
  const [error, setError] = React.useState<Error | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    fetch(url, { signal: ac.signal, cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
        return r.json();
      })
      .then((json) => setData(json))
      .catch((e) => {
        if ((e as any).name !== "AbortError") setError(e as Error);
      })
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, [url]);

  return { data, error, loading };
}

// ---------- Types ----------
type Plan = { week: string; demand: number; scheduled: number };
type FeatureImportance = { name: string; value: number };
type TrendPoint = { label: string; rate: number };

// ---------- Chart helpers (matching Intrepid) ----------
const chartMargin = { top: 24, right: 28, bottom: 44, left: 28 };
const axisTick = { fontSize: 12, fill: '#a1a1aa' } as const;
const legendStyle = { fontSize: 12 } as const;
const COLORS = ["#0ea5e9", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

// ---------- KPI data ----------
const kpi = [
  { label: "Staff Managed", value: "200+", sub: "at large events", icon: "👥" },
  {
    label: "Dropout Reduction",
    value: "11%",
    sub: "23% → 12%",
    icon: "📉",
  },
  {
    label: "Payroll Hours Saved",
    value: "~160",
    sub: "per 200-staff event",
    icon: "⏱️",
  },
  {
    label: "Cost Saved / Event",
    value: "$2,880",
    sub: "160h × $18/h",
    icon: "💰",
  },
];

// ---------- Code snippets ----------
const noShowModelSnippet = `# RandomForest No-Show Classifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score

rf = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    random_state=42
)
rf.fit(X_train, y_train)

# Cross-validated AUC
scores = cross_val_score(rf, X, y, cv=5, scoring='roc_auc')
print(f"Mean AUC: {scores.mean():.3f} ± {scores.std():.3f}")`;

const payrollETLSnippet = `# Payroll ETL — shift → hours → payouts
import pandas as pd

shifts = pd.read_csv("shifts.csv", parse_dates=["start", "end"])
shifts["hours"] = (shifts["end"] - shifts["start"]).dt.total_seconds() / 3600

# Tip allocation by hours worked
total_tips = tips_pool["amount"].sum()
shifts["tip_share"] = (shifts["hours"] / shifts["hours"].sum()) * total_tips
shifts["payout"] = shifts["hours"] * shifts["rate"] + shifts["tip_share"]`;

// ---------- Code block component (matching Intrepid) ----------
function CodeBlock({ title, code }: { title?: string; code: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 shadow-sm">
      {title && (
        <div className="px-5 pt-4 pb-2 text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-zinc-500" />
          {title}
        </div>
      )}
      <pre
        className="px-5 pb-5 pt-3 text-[15px] leading-7 bg-zinc-900 rounded-b-2xl overflow-auto"
        style={{ tabSize: 2, WebkitOverflowScrolling: "touch" }}
      >
        <code className="whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

// ---------- Page ----------
export default function E2SPage() {
  // Live data from /public/e2s/*.json
  const {
    data: staffingPlan,
    loading: planLoading,
    error: planError,
  } = useJSON<Plan[]>("/e2s/staffing_plan.json");

  const {
    data: featureImportances,
    loading: fiLoading,
    error: fiError,
  } = useJSON<FeatureImportance[]>("/e2s/feature_importance.json");

  const {
    data: noShowTrend,
    loading: trendLoading,
    error: trendError,
  } = useJSON<TrendPoint[]>("/e2s/no_show_trend.json");

  return (
    <Layout>
      <NavBar />
      <div className="pt-20"></div>

      {/* Hero */}
      <section className="mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 shadow-lg ring-1 ring-zinc-800 p-8 md:p-14"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-100 tracking-tight text-center">
            EATS2SEATS — Workforce Analytics & Ops Automation
          </h1>

          <div className="mt-10 grid md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-7">
              <p className="text-zinc-300 text-lg md:text-xl leading-8 max-w-prose">
                Built a staffing intelligence toolkit for large sporting events:
                predicted <strong>no-show risk</strong> with a RandomForest
                model, <strong>optimized scheduling</strong> to close coverage
                gaps, and <strong>automated payroll ETL</strong> including tip
                allocation. Result: lower last-minute churn, fewer coverage
                gaps, and faster back-office ops — saving an estimated{" "}
                <strong>$2,880 per 200-staff event</strong>.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-zinc-700 bg-zinc-900 px-6 py-3 text-base font-medium text-zinc-100 shadow-sm hover:bg-zinc-800 hover:border-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 transition"
                >
                  <span>🏠</span> Home
                </a>
              </div>
            </div>

            <div className="md:col-span-5 flex flex-wrap gap-3 justify-center md:justify-end md:pt-4">
              <span className="inline-flex items-center rounded-full px-4 py-1.5 text-base font-medium bg-cyan-400/20 text-white">
                Data Science
              </span>
              <span className="inline-flex items-center rounded-full px-4 py-1.5 text-base font-medium bg-zinc-700 text-zinc-300">
                Ops Automation
              </span>
              <span className="inline-flex items-center rounded-full px-4 py-1.5 text-base font-medium border border-zinc-600 text-zinc-300">
                Business Analysis
              </span>
            </div>
          </div>

          {/* KPIs */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-4 gap-8">
            {kpi.map((k) => (
              <div
                key={k.label}
                className="flex flex-col items-center rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm"
              >
                <div className="text-3xl">{k.icon}</div>
                <div className="mt-2 text-4xl font-extrabold text-zinc-100">
                  {k.value}
                </div>
                <div className="text-sm uppercase tracking-wide text-zinc-500 mt-1">
                  {k.label}
                </div>
                <div className="text-base text-zinc-400">{k.sub}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Challenge & Role */}
      <section className="page-center mt-16 grid gap-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">
              The Challenge
            </h2>
            <ul className="mt-3 text-zinc-300 text-lg space-y-3 list-disc pl-5">
              <li>High no-show variability by shift, role, and venue.</li>
              <li>Manual scheduling created last-minute coverage gaps.</li>
              <li>Payroll reconciliation was time-consuming and error-prone.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">My Role</h2>
            <ul className="mt-3 text-zinc-300 text-lg space-y-3 list-disc pl-5">
              <li>
                Built a RandomForest model to predict no-show probability.
              </li>
              <li>
                Automated payroll ETL (shift → hours → payouts) with Python.
              </li>
              <li>Designed dashboards for staffing vs. demand planning.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* No-Show Rate — Before vs. After */}
      <section className="page-center mt-16 grid gap-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="h-80">
            <h3 className="text-center font-semibold mb-2">
              No-Show Rate — Before vs. After
            </h3>
            {trendError && (
              <div className="text-sm text-red-600">
                Failed to load /e2s/no_show_trend.json
              </div>
            )}
            {trendLoading && (
              <div className="text-sm text-zinc-500">Loading trend…</div>
            )}
            {noShowTrend && noShowTrend.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={noShowTrend} margin={chartMargin}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="label" tick={axisTick} />
                  <YAxis
                    tickFormatter={(v) => `${Math.round((v as number) * 100)}%`}
                    tick={axisTick}
                  />
                  <Tooltip
                    formatter={(v: number) => `${Math.round(v * 100)}%`}
                    contentStyle={{ background: '#111118', border: '1px solid #27272a', color: '#e4e4e7' }}
                  />
                  <Legend wrapperStyle={legendStyle} />
                  <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
                    {noShowTrend.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                    <LabelList
                      dataKey="rate"
                      position="top"
                      formatter={(label: React.ReactNode) =>
                        `${Math.round(Number(label) * 100)}%`
                      }
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">
              Cutting No-Shows in Half
            </h2>
            <p className="mt-3 text-zinc-300 text-lg">
              Before the ML model, no-show rates hovered around{" "}
              <strong>23%</strong>. After deploying the RandomForest predictor
              and risk-based scheduling adjustments, the rate dropped to{" "}
              <strong>18%</strong> — and after full ops automation it fell to{" "}
              <strong>12%</strong>. That <strong>11-point improvement</strong>{" "}
              translated directly into fewer last-minute scrambles and more
              reliable event coverage.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Importance */}
      <section className="page-center mt-16 grid gap-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="h-80">
            <h3 className="text-center font-semibold mb-2">
              Top Predictors (Feature Importance)
            </h3>
            {fiError && (
              <div className="text-sm text-red-600">
                Failed to load /e2s/feature_importance.json
              </div>
            )}
            {fiLoading && (
              <div className="text-sm text-zinc-500">
                Loading feature importances…
              </div>
            )}
            {featureImportances && featureImportances.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureImportances} margin={chartMargin}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="name" tick={axisTick} />
                  <YAxis
                    tickFormatter={(v) => `${Math.round((v as number) * 100)}%`}
                    tick={axisTick}
                  />
                  <Tooltip
                    formatter={(v: number) => `${Math.round(v * 100)}%`}
                    contentStyle={{ background: '#111118', border: '1px solid #27272a', color: '#e4e4e7' }}
                  />
                  <Legend wrapperStyle={legendStyle} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {featureImportances.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                    <LabelList
                      dataKey="value"
                      position="top"
                      formatter={(label: React.ReactNode) =>
                        `${Math.round(Number(label) * 100)}%`
                      }
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">
              What Drives No-Shows
            </h2>
            <p className="mt-3 text-zinc-300 text-lg">
              Feature importance analysis revealed the strongest predictors of
              no-show risk. Factors like <strong>lagged no-show history</strong>,{" "}
              <strong>shift timing</strong>, <strong>role type</strong>, and{" "}
              <strong>venue</strong> dominated. These insights let operations
              teams target interventions — confirmation calls, standby pools,
              swap suggestions — where they mattered most.
            </p>
          </div>
        </div>

        {/* Staffing vs Demand */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="h-80">
            <h3 className="text-center font-semibold mb-2">
              Staffing vs. Demand (Example)
            </h3>
            {planError && (
              <div className="text-sm text-red-600">
                Failed to load /e2s/staffing_plan.json
              </div>
            )}
            {planLoading && (
              <div className="text-sm text-zinc-500">
                Loading staffing plan…
              </div>
            )}
            {staffingPlan && staffingPlan.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={staffingPlan} margin={chartMargin}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="week" tick={axisTick} />
                  <YAxis tick={axisTick} />
                  <Tooltip contentStyle={{ background: '#111118', border: '1px solid #27272a', color: '#e4e4e7' }} />
                  <Legend wrapperStyle={legendStyle} />
                  <Line
                    type="monotone"
                    dataKey="demand"
                    name="Demand"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="scheduled"
                    name="Scheduled"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">
              Closing Coverage Gaps
            </h2>
            <p className="mt-3 text-zinc-300 text-lg">
              The staffing dashboard tracked demand vs. scheduled staff in real
              time. Before the model, <strong>~15% of shifts</strong> went
              unfilled. After risk-based overstaffing and standby pools, that
              dropped to <strong>~5%</strong>. The line chart shows how closely
              scheduled staffing tracked actual demand after optimization.
            </p>
          </div>
        </div>
      </section>

      {/* Pipeline & Validation */}
      <section className="page-center mt-16 grid gap-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">
              End-to-End Pipeline
            </h2>
            <ol className="mt-3 text-zinc-300 text-lg space-y-3 list-decimal pl-5">
              <li>Ingest shift & roster data (CSV/API) → validate schemas.</li>
              <li>
                Feature engineering (lagged no-shows, role, venue, weather).
              </li>
              <li>Model scoring to flag high-risk shifts & staff.</li>
              <li>Scheduling assist: suggest swaps/standby staffing.</li>
              <li>
                Timesheet → payroll ETL, tip allocation, exceptions report.
              </li>
            </ol>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">
              Validation & Quality
            </h2>
            <ul className="mt-3 text-zinc-300 text-lg space-y-3 list-disc pl-5">
              <li>
                Train/test split by event; cross-validated on historical events.
              </li>
              <li>
                Monitored precision/recall at top-risk deciles (alert
                thresholds).
              </li>
              <li>
                Back-tested overstaffing vs. standby pools cost/benefit.
              </li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">
              Dashboards & Alerts
            </h2>
            <ul className="mt-3 text-zinc-300 text-lg space-y-3 list-disc pl-5">
              <li>Event command center: live staffing vs. demand status.</li>
              <li>Risk heatmap by venue/time; SMS/Slack alerts for gaps.</li>
              <li>Finance view: payouts, tips, anomalies for approval.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">
              Skills Applied
            </h2>
            <ul className="mt-3 text-zinc-300 text-lg space-y-3 list-disc pl-5">
              <li>RandomForest classification, cross-validation, threshold tuning.</li>
              <li>Python (pandas, numpy, scikit-learn), ETL for payroll & tips.</li>
              <li>Capacity planning, stakeholder interviews, KPI design.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Code Snippets */}
      <section className="page-center mt-16 grid gap-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <CodeBlock
              title="No-Show Model — Python snippet"
              code={noShowModelSnippet}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">
              Predicting No-Shows
            </h2>
            <p className="mt-3 text-zinc-300 text-lg">
              A <strong>RandomForest</strong> classifier trained on historical
              shift data — lagged no-shows, role, venue, weather, and timing
              features. Cross-validated AUC guided threshold selection for
              alerting operations teams to high-risk shifts before they became
              coverage gaps.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <CodeBlock
              title="Payroll ETL — Python snippet"
              code={payrollETLSnippet}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">
              Automating Payroll
            </h2>
            <p className="mt-3 text-zinc-300 text-lg">
              The ETL pipeline ingests raw shift data, computes hours worked,
              allocates tips proportionally by hours, and produces final payouts.
              This replaced a manual spreadsheet process, cutting payout
              corrections by <strong>~30%</strong> and saving hours of
              back-office work per event.
            </p>
          </div>
        </div>
      </section>

      {/* Artifacts — Notebooks */}
      <section className="page-center mt-16">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-xl font-semibold text-zinc-100">
            Project Notebooks
          </h2>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
          <a
            href="/e2s/no-show_rate_model.ipynb"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sky-700 hover:underline"
          >
            No-Show Model
          </a>
          <span className="text-zinc-500">•</span>
          <a
            href="/e2s/TipAllocation.ipynb"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sky-700 hover:underline"
          >
            Tip Allocation
          </a>
          <span className="text-zinc-500">•</span>
          <a
            href="/e2s/Account_Finance_Model.ipynb"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sky-700 hover:underline"
          >
            Account Finance Model
          </a>
          <span className="text-zinc-500">•</span>
          <a
            href="/"
            className="inline-flex items-center gap-1 text-sky-700 hover:underline"
          >
            Home
          </a>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 shadow-sm p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-zinc-800 p-5">
              <h3 className="font-semibold text-zinc-100 mb-2">
                No-Show Rate Model
              </h3>
              <p className="text-zinc-400 text-sm">
                RandomForest modeling, cross-validation, and threshold tuning
                for no-show prediction.
              </p>
              <a
                href="/e2s/no-show_rate_model.ipynb"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sky-700 text-sm hover:underline"
              >
                Open notebook →
              </a>
            </div>
            <div className="rounded-xl border border-zinc-800 p-5">
              <h3 className="font-semibold text-zinc-100 mb-2">
                Tip Allocation
              </h3>
              <p className="text-zinc-400 text-sm">
                Payroll ETL pipeline — shift hours to payouts with proportional
                tip allocation.
              </p>
              <a
                href="/e2s/TipAllocation.ipynb"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sky-700 text-sm hover:underline"
              >
                Open notebook →
              </a>
            </div>
            <div className="rounded-xl border border-zinc-800 p-5">
              <h3 className="font-semibold text-zinc-100 mb-2">
                Account Finance Model
              </h3>
              <p className="text-zinc-400 text-sm">
                Financial modeling and accounting logic for event operations.
              </p>
              <a
                href="/e2s/Account_Finance_Model.ipynb"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sky-700 text-sm hover:underline"
              >
                Open notebook →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Result */}
      <section className="page-center mt-20 mb-24">
        <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-zinc-900 via-cyan-950/25 to-zinc-950 p-8 shadow-sm text-center">
          <h2 className="text-3xl font-bold text-zinc-100">The Result</h2>
          <p className="mt-4 text-lg text-zinc-300 max-w-3xl mx-auto">
            With a data-driven approach to workforce management, EATS2SEATS
            achieved an <strong>11-point reduction in no-show rates</strong>{" "}
            (23% → 12%), cut coverage gaps from{" "}
            <strong>15% → 5% unfilled shifts</strong>, and saved an estimated{" "}
            <strong>$2,880 per 200-staff event</strong> through payroll
            automation. This wasn't just about building a model — it was about
            connecting prediction to action, turning risk scores into staffing
            decisions, and automating the back-office ops that drained hours
            from every event.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <a
              href="/e2s/no-show_rate_model.ipynb"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border-2 border-sky-400 px-5 py-2 text-sky-300 hover:bg-sky-400/10 font-semibold shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 transition"
            >
              View Model Notebook
            </a>
            <a
              href="/e2s/TipAllocation.ipynb"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border-2 border-sky-400 px-5 py-2 text-sky-300 hover:bg-sky-400/10 font-semibold shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 transition"
            >
              View Payroll ETL
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </Layout>
  );
}
