import React from "react";
import PageShell from "@/components/PageShell";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Cell,
} from "recharts";
import {
  Brain,
  ChartBarBig,
  CheckCircle2,
  Cpu,
  FileText,
  GitCompare,
  Rocket,
  Settings,
  Users,
} from "lucide-react";

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
type KPI = { kpi: string; label: string };
type Plan = { week: string; demand: number; scheduled: number };
type FeatureImportance = { name: string; value: number };
type TrendPoint = { label: string; rate: number };

// ---------- Visual theme ----------
const COLORS = ["#0ea5e9", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"]; // matches Intrepid page

// ---------- Tiny UI ----------
const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => (
  <div
    className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${
      className || ""
    }`}
  >
    {children}
  </div>
);

const CardHeader: React.FC<
  React.PropsWithChildren<{ title?: React.ReactNode; icon?: React.ReactNode }>
> = ({ children, title, icon }) => (
  <div className="px-6 pt-6">
    {title && (
      <div className="mb-2 flex items-center gap-2 text-slate-900 font-semibold">
        {icon}
        {title}
      </div>
    )}
    {children}
  </div>
);

const CardBody: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => <div className={`px-6 pb-6 pt-3 ${className || ""}`}>{children}</div>;

function useTabs(initial: string) {
  const [tab, setTab] = React.useState(initial);
  const TabButton = ({ value, children }: any) => (
    <button
      onClick={() => setTab(value)}
      aria-pressed={tab === value}
      className={`rounded-xl border px-4 py-2.5 text-sm md:text-[15px] transition ${
        tab === value
          ? "bg-slate-900 text-white border-slate-900"
          : "bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
  return { tab, setTab, TabButton };
}

// ---------- Page ----------
export default function E2SPage() {
  const { tab, TabButton } = useTabs("overview");

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

  // Optional: if you export a trend JSON
  const {
    data: noShowTrend,
    loading: trendLoading,
    error: trendError,
  } = useJSON<TrendPoint[]>("/e2s/no_show_trend.json");

  const KPIS: KPI[] = [
    { kpi: "+200", label: "Staff at large events managed" },
    { kpi: "11%", label: "Dropout reduction (23% → 12%)" },
    { kpi: "~160 hrs", label: "Payroll hours saved / 200-staff event" },
    {
      kpi: "$2,880",
      label: "Cost saved on AVG / 200-staff event (160h * $18/h = $2,880)",
    },
  ];

  return (
    <PageShell>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="page-center">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                EATS2SEATS — Workforce Analytics & Ops Automation
              </h1>
              <p className="text-slate-700 mt-3 mx-auto md:mx-0 max-w-2xl md:max-w-3xl leading-relaxed">
                Built a staffing intelligence toolkit for large sporting events:
                predicted no‑show risk, optimized scheduling, and automated
                payroll. Result: lower last‑minute churn, fewer coverage gaps,
                and faster back‑office ops.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-end">
              <span className="inline-flex items-center rounded-full px-2.5 py-1 text-md font-medium bg-slate-900 text-white">
                Data Science
              </span>
              <span className="inline-flex items-center rounded-full px-2.5 py-1 text-md font-medium bg-slate-300 text-slate-700">
                Ops Automation
              </span>
              <span className="inline-flex items-center rounded-full px-2.5 py-1 text-md font-medium border border-slate-500 text-slate-700">
                Business Analysis
              </span>
            </div>
          </div>

          {/* KPIs */}
          <div className="mt-7 grid grid-cols-2 md:grid-cols-4 gap-4">
            {KPIS.map((x, i) => (
              <Card key={i}>
                <CardBody>
                  <div className="text-2xl font-semibold text-center md:text-left">
                    {x.kpi}
                  </div>
                  <div className="text-[13px] text-slate-600 mt-0.5 text-center md:text-left">
                    {x.label}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="page-center">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 justify-items-center md:justify-items-stretch">
          <TabButton value="overview">Overview</TabButton>
          <TabButton value="model">Model</TabButton>
          <TabButton value="ops">Ops & Automation</TabButton>
          <TabButton value="impact">Impact</TabButton>
          <TabButton value="skills">Skills</TabButton>
          <TabButton value="artifacts">Artifacts</TabButton>
        </div>
      </div>

      {/* OVERVIEW */}
      {tab === "overview" && (
        <div className="page-center mt-8 grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader
              title="Challenge"
              icon={<Users className="h-5 w-5" />}
            />
            <CardBody>
              <ul className="list-disc pl-5 space-y-2.5 text-[15px] leading-relaxed text-slate-800">
                <li>High no‑show variability by shift, role, and venue.</li>
                <li>Manual scheduling created last‑minute coverage gaps.</li>
                <li>
                  Payroll reconciliation was time‑consuming and error‑prone.
                </li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Role" icon={<Brain className="h-5 w-5" />} />
            <CardBody>
              <ul className="list-disc pl-5 space-y-2.5 text-[15px] leading-relaxed text-slate-800">
                <li>
                  Built a RandomForest model to predict no‑show probability.
                </li>
                <li>
                  Automated payroll ETL (shift → hours → payouts) with Python.
                </li>
                <li>Designed dashboards for staffing vs. demand planning.</li>
              </ul>
            </CardBody>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader
              title="No‑Show Rate — Before vs. After"
              icon={<GitCompare className="h-5 w-5" />}
            />
            <CardBody>
              {trendError && (
                <div className="text-sm text-red-600">
                  Failed to load /e2s/no_show_trend.json
                </div>
              )}
              {trendLoading && (
                <div className="text-sm text-slate-500">Loading trend…</div>
              )}
              {noShowTrend && noShowTrend.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={noShowTrend}>
                      <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                      <YAxis
                        tickFormatter={(v) =>
                          `${Math.round((v as number) * 100)}%`
                        }
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        formatter={(v: number) => `${Math.round(v * 100)}%`}
                      />
                      <Bar dataKey="rate">
                        {noShowTrend.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-sm text-slate-500">
                  Provide <code>/public/e2s/no_show_trend.json</code> as
                  <pre className="mt-1 bg-slate-50 p-2 rounded border overflow-x-auto">
                    {`[
  { "label": "Before ML (Q2)", "rate": 0.23 },
  { "label": "After ML (Q3)", "rate": 0.18 },
  { "label": "After Ops (Q4)", "rate": 0.12 }
]`}
                  </pre>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}

      {/* MODEL */}
      {tab === "model" && (
        <div className="page-center mt-8 grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader
              title="Top Predictors (Feature Importance)"
              icon={<ChartBarBig className="h-5 w-5" />}
            />
            <CardBody>
              {fiError && (
                <div className="text-sm text-red-600">
                  Failed to load /e2s/feature_importance.json
                </div>
              )}
              {fiLoading && (
                <div className="text-sm text-slate-500">
                  Loading feature importances…
                </div>
              )}
              {featureImportances && featureImportances.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={featureImportances}>
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis
                        tickFormatter={(v) =>
                          `${Math.round((v as number) * 100)}%`
                        }
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        formatter={(v: number) => `${Math.round(v * 100)}%`}
                      />
                      <Bar dataKey="value">
                        {featureImportances.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-sm text-slate-500">
                  Put <code>feature_importance.json</code> into{" "}
                  <code>public/e2s/</code>.
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Staffing vs Demand (Example)"
              icon={<Cpu className="h-5 w-5" />}
            />
            <CardBody>
              {planError && (
                <div className="text-sm text-red-600">
                  Failed to load /e2s/staffing_plan.json
                </div>
              )}
              {planLoading && (
                <div className="text-sm text-slate-500">
                  Loading staffing plan…
                </div>
              )}
              {staffingPlan && staffingPlan.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={staffingPlan}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="demand"
                        stroke="#0ea5e9"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="scheduled"
                        stroke="#22c55e"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-sm text-slate-500">
                  Put <code>staffing_plan.json</code> into{" "}
                  <code>public/e2s/</code>.
                </div>
              )}
            </CardBody>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader
              title="Validation & Quality"
              icon={<CheckCircle2 className="h-5 w-5" />}
            />
            <CardBody>
              <ul className="list-disc pl-5 space-y-2.5 text-[15px] leading-relaxed text-slate-800">
                <li>
                  Train/test split by event; cross‑validated on historical
                  events.
                </li>
                <li>
                  Monitored precision/recall at top‑risk deciles (alert
                  thresholds).
                </li>
                <li>
                  Back‑tested overstaffing vs. standby pools cost/benefit.
                </li>
              </ul>
            </CardBody>
          </Card>
        </div>
      )}

      {/* OPS & AUTOMATION */}
      {tab === "ops" && (
        <div className="page-center mt-8 grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader
              title="Pipeline"
              icon={<Settings className="h-5 w-5" />}
            />
            <CardBody>
              <ol className="list-decimal pl-5 space-y-2.5 text-[15px] leading-relaxed text-slate-800">
                <li>
                  Ingest shift & roster data (CSV/API) → validate schemas.
                </li>
                <li>
                  Feature engineering (lagged no‑shows, role, venue, weather).
                </li>
                <li>Model scoring to flag high‑risk shifts & staff.</li>
                <li>Scheduling assist: suggest swaps/standby staffing.</li>
                <li>
                  Timesheet → payroll ETL, tip allocation, exceptions report.
                </li>
              </ol>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Dashboards & Alerts"
              icon={<Rocket className="h-5 w-5" />}
            />
            <CardBody>
              <ul className="list-disc pl-5 space-y-2.5 text-[15px] leading-relaxed text-slate-800">
                <li>Event command center: live staffing vs. demand status.</li>
                <li>Risk heatmap by venue/time; SMS/Slack alerts for gaps.</li>
                <li>Finance view: payouts, tips, anomalies for approval.</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      )}

      {/* IMPACT */}
      {tab === "impact" && (
        <div className="page-center">
          <div className="mt-8 grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader
                title="Operational"
                icon={<Settings className="h-5 w-5" />}
              />
              <CardBody>
                <ul className="list-disc pl-5 space-y-2.5 text-[15px] leading-relaxed text-slate-800">
                  <li>
                    11% drop in no‑show rate (≈23% → ≈12%) across pilot events.
                  </li>
                  <li>
                    Coverage gaps cut on 10% (≈15% unfilled shifts → ≈5%).
                  </li>
                  <li>Check‑in wait down ~30% via better role assignment.</li>
                </ul>
              </CardBody>
            </Card>

            <Card>
              <CardHeader
                title="Financial"
                icon={<ChartBarBig className="h-5 w-5" />}
              />
              <CardBody>
                <ul className="list-disc pl-5 space-y-2.5 text-[15px] leading-relaxed text-slate-800">
                  <li>
                    ~160 payroll hours saved per 200‑staff event (200st * 10% =
                    20 staff covarage gap cut; 20st * 8h = 160h saved)
                  </li>
                  <li>
                    ~20% lower overtime/emergency staffing, driven by earlier
                    risk flags.
                  </li>
                  <li>
                    ~30% fewer payout corrections after ETL + tip allocation
                    automation.
                  </li>
                </ul>
              </CardBody>
            </Card>

            <Card>
              <CardHeader
                title="Experience"
                icon={<Users className="h-5 w-5" />}
              />
              <CardBody>
                <ul className="list-disc pl-5 space-y-2.5 text-[15px] leading-relaxed text-slate-800">
                  <li>
                    ~15% lift in staff retention across repeat events (fewer
                    dropouts).
                  </li>
                  <li>
                    Higher staff satisfaction (e.g., post‑event surveys trending
                    up).
                  </li>
                  <li>
                    Fewer service bottlenecks → smoother peak‑time attendee
                    experience.
                  </li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {/* SKILLS */}
      {tab === "skills" && (
        <div className="page-center">
          <div className="mt-8 grid md:grid-cols-3 gap-8">
            {[
              [
                "Data Science",
                [
                  "RandomForest classification",
                  "Cross‑validation, threshold tuning",
                  "Feature importance & drift checks",
                ],
              ],
              [
                "Analytics & Engineering",
                [
                  "Python (pandas, numpy, scikit‑learn)",
                  "ETL for payroll & tip allocation",
                  "API design & performance tuning",
                ],
              ],
              [
                "Business & Ops",
                [
                  "Capacity planning & staffing optimization",
                  "Stakeholder interviews at venues",
                  "KPI definition & dashboard design",
                ],
              ],
            ].map(([title, items], idx) => (
              <Card key={idx}>
                <CardHeader title={title as string} />
                <CardBody className="text-[15px] leading-relaxed text-slate-800">
                  <ul className="list-disc pl-5 space-y-1.5">
                    {(items as string[]).map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === "artifacts" && (
        <div className="page-center mt-8 grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <FileText className="h-5 w-5" /> Notebooks
                </span>
              }
            />
            <CardBody className="text-[15px] leading-relaxed text-slate-800">
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <a
                    href="/e2s/no-show_rate_model.ipynb"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    no-show_rate_model.ipynb
                  </a>{" "}
                  — modeling &amp; validation.
                </li>
                <li>
                  <a
                    href="/e2s/TipAllocation.ipynb"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    TipAllocation.ipynb
                  </a>{" "}
                  — payroll &amp; tips ETL.
                </li>
                <li>
                  <a
                    href="/e2s/Account_Finance_Model.ipynb"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Account Finance Model
                  </a>{" "}
                  — finance logic.
                </li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Model Artifacts" />
            <CardBody className="grid md:grid-cols-2 gap-4">
              <img
                src="/e2s/confusion.png"
                alt="Confusion Matrix"
                className="rounded-xl border "
              />
              <img
                src="/e2s/roc.png"
                alt="ROC Curve"
                className="rounded-xl border"
              />
              <img
                src="/e2s/payroll_funnel.png"
                alt="Payroll Funnel"
                className="rounded-xl border md:col-span-2"
              />
            </CardBody>
          </Card>
        </div>
      )}
    </PageShell>
  );
}
