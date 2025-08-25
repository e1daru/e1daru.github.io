import React from "react";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import { ArrowUpRight, ArrowDownRight, Info } from "lucide-react";
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  FileText,
  TrendingUp,
  Users,
  ShoppingCart,
  Clock,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

// ---- Types for impact, interclick, and channel_switching files ----
type ImpactPromoWaste = {
  overall: {
    total_promo_spend: number;
    waste_spend_est: number;
    waste_pct_est: number;
  };
  by_promo: Array<{
    promo_type: string;
    promo_spend: number;
    orders_observed: number;
    orders_baseline: number;
    incremental_orders: number;
    cpi: number | null;
    waste_spend_est: number;
    waste_pct_est: number;
  }>;
};

type ImpactConversion = {
  outputs: {
    current_cr: number; // 0..1
    target_cr: number; // 0..1
    delta_percentage_points: number; // 0..1
    delta_relative: number | null; // fraction
  };
};

type ImpactTimeSaved = {
  outputs: { time_saved_hours_per_week: number };
};

type ImpactLatencyRepeat = {
  status?: string;
  example_threshold_days?: number;
  formula?: string;
};

type InterclickHistogramBin = {
  bin_start_sec: number;
  bin_end_sec: number;
  count: number;
};

type InterclickStats = {
  meta?: any;
  distributions: {
    ordered?: { summary?: any; histogram: InterclickHistogramBin[] };
    nonordered?: { summary?: any; histogram: InterclickHistogramBin[] };
  };
};

type ChannelPair = {
  from: string;
  to: string;
  session_share: number;
  conversion_rate: number;
};

type ChannelSwitching = {
  meta?: any;
  overall: {
    switch_rate: number; // fraction 0..1
    conversion_rate_switchers: number; // fraction 0..1
    conversion_rate_no_switch: number; // fraction 0..1
    lift: number; // e.g. 0.4 => +40%
  };
  by_channel_pair: ChannelPair[];
  by_segment?: any[];
};

// ---- Placeholder visuals (we keep these for non-impact sections) ----
const COLORS = ["#0ea5e9", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];
const channelShare = [
  { name: "App", value: 48 },
  { name: "WeChat", value: 22 },
  { name: "Mobile Web", value: 18 },
  { name: "PC Web", value: 10 },
  { name: "Other", value: 2 },
];
const promoEffect = [
  { promo: "Direct Discount", uplift: 100 },
  { promo: "Quantity", uplift: 65 },
  { promo: "Bundle", uplift: 40 },
  { promo: "Coupon", uplift: 25 },
];
const sessionFunnel = [
  { step: "Sessions", value: 100 },
  { step: "SKU Views", value: 62 },
  { step: "Add-to-Cart", value: 18 },
  { step: "Orders", value: 6 },
];

// ---- Utils ----
async function fetchJSON<T>(path: string): Promise<T | null> {
  try {
    const r = await fetch(path, { cache: "no-cache" });
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  }
}
const pct = (n?: number | null, digits = 1) =>
  n == null || Number.isNaN(n) ? "—" : `${(n * 100).toFixed(digits)}%`;
const num = (n?: number | null, digits = 0) =>
  n == null || Number.isNaN(n)
    ? "—"
    : Intl.NumberFormat().format(Number(n.toFixed(digits)));

function KpiTile({
  label,
  value,
  help,
  delta,
  footnote,
}: {
  label: string;
  value: React.ReactNode;
  help?: string;
  delta?: { dir: "up" | "down"; text: string } | null;
  footnote?: string | null;
}) {
  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="px-6 pb-5 pt-4">
        <div className="flex items-center justify-between gap-2">
          <div className="text-[13px] text-slate-600 flex items-center gap-1">
            <span>{label}</span>
            {help && (
              <span className="inline-flex" title={help}>
                <Info className="h-3.5 w-3.5 text-slate-400" />
              </span>
            )}
          </div>
          {delta && (
            <div
              className={`inline-flex items-center text-xs font-medium ${
                delta.dir === "up" ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {delta.dir === "up" ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              {delta.text}
            </div>
          )}
        </div>
        <div className="mt-1 text-2xl font-semibold text-slate-900">
          {value}
        </div>
        {footnote && (
          <div className="text-[12px] text-slate-500 mt-1">{footnote}</div>
        )}
      </div>
    </div>
  );
}

// ---- Small UI primitives ----
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

export default function ECommerceAnalyticsPage() {
  const { tab, TabButton } = useTabs("overview");

  // ---- Impact + Interclick + Channels state ----
  const [impactWaste, setImpactWaste] = React.useState<ImpactPromoWaste | null>(
    null
  );
  const [impactConv, setImpactConv] = React.useState<ImpactConversion | null>(
    null
  );
  const [impactTime, setImpactTime] = React.useState<ImpactTimeSaved | null>(
    null
  );
  const [impactLat, setImpactLat] = React.useState<ImpactLatencyRepeat | null>(
    null
  );
  const [interclick, setInterclick] = React.useState<InterclickStats | null>(
    null
  );
  const [channels, setChannels] = React.useState<ChannelSwitching | null>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const [inclk, iw, ic, it, il, ch] = await Promise.all([
        fetchJSON<InterclickStats>("/ecom/interclick_stats.json"),
        fetchJSON<ImpactPromoWaste>("/ecom/impact_promo_waste.json"),
        fetchJSON<ImpactConversion>("/ecom/impact_conversion_scenario.json"),
        fetchJSON<ImpactTimeSaved>("/ecom/impact_time_saved.json"),
        fetchJSON<ImpactLatencyRepeat>("/ecom/impact_latency_repeat.json"),
        fetchJSON<ChannelSwitching>("/ecom/channel_switching.json"),
      ]);
      if (!mounted) return;
      setInterclick(inclk);
      setImpactWaste(iw);
      setImpactConv(ic);
      setImpactTime(it);
      setImpactLat(il);
      setChannels(ch);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // ---- Derived: interclick bars (ordered vs nonordered) ----
  const interclickBars = React.useMemo(() => {
    const o = interclick?.distributions?.ordered?.histogram || [];
    const n = interclick?.distributions?.nonordered?.histogram || [];
    if (!o.length && !n.length)
      return [] as { bin: string; ordered: number; nonordered: number }[];
    const key = (b: InterclickHistogramBin) =>
      `${b.bin_start_sec}-${b.bin_end_sec}`;
    const mapFrom = (arr: InterclickHistogramBin[]) =>
      new Map(arr.map((b) => [key(b), b.count]));
    const mo = mapFrom(o),
      mn = mapFrom(n);
    const keys = Array.from(new Set([...mo.keys(), ...mn.keys()])).sort(
      (a, b) => Number(a.split("-")[0]) - Number(b.split("-")[0])
    );
    return keys.map((k) => ({
      bin: k.replace("-", "–"),
      ordered: mo.get(k) ?? 0,
      nonordered: mn.get(k) ?? 0,
    }));
  }, [interclick]);

  const interclickSummary = React.useMemo(() => {
    const o = interclick?.distributions?.ordered?.summary || {};
    const n = interclick?.distributions?.nonordered?.summary || {};
    return {
      o_median: o.median_seconds,
      o_p90: o.p90_seconds,
      o_mean: o.mean_seconds,
      n_median: n.median_seconds,
      n_p90: n.p90_seconds,
      n_mean: n.mean_seconds,
    } as Record<string, number | undefined>;
  }, [interclick]);

  // ---- Derived: channel pairs (session share % and CR %) ----
  const pairShare = React.useMemo(() => {
    const pairs = channels?.by_channel_pair || [];
    return pairs.map((p) => ({
      pair: `${p.from}→${p.to}`,
      session_share_pct: Math.round((p.session_share || 0) * 1000) / 10, // e.g., 12.3
    }));
  }, [channels]);

  const pairCR = React.useMemo(() => {
    const pairs = channels?.by_channel_pair || [];
    return pairs.map((p) => ({
      pair: `${p.from}→${p.to}`,
      cr_pct: Math.round((p.conversion_rate || 0) * 1000) / 10,
    }));
  }, [channels]);

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
                E‑Commerce Analytics — Behavioral + Promo Insights
              </h1>
              <p className="text-slate-700 mt-3 mx-auto md:mx-0 max-w-2xl md:max-w-3xl leading-relaxed">
                Turn clickstreams, pricing levers, and delivery speed into
                measurable lift—boosting conversion and cutting promo waste.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-end">
              <span className="inline-flex items-center rounded-full px-2.5 py-1 text-md font-medium bg-slate-900 text-white">
                Data Analytics
              </span>
              <span className="inline-flex items-center rounded-full px-2.5 py-1 text-md font-medium bg-slate-300 text-slate-700">
                Experimentation
              </span>
              <span className="inline-flex items-center rounded-full px-2.5 py-1 text-md font-medium border border-slate-500 text-slate-700">
                Business Analysis
              </span>
            </div>
          </div>

          {/* KPI header row (HARD-CODED, 3 tiles) */}
          {(() => {
            const kpis = [
              {
                label: "Conversion Rate",
                value: "3.4%",
                help: "Orders / sessions (current).",
                delta: { dir: "up" as const, text: "0.6pp" },
                footnote: "Scenario: +5pp switch → 3.7%",
              },
              {
                label: "Promo Waste %",
                value: "28.4%",
                help: "Estimated share of promo $ spent on non-incremental orders.",
                footnote: "$124k of $436k",
              },
              {
                label: "Median Inter-click",
                value: "37s (ord) / 54s (non)",
                help: "Median seconds between consecutive SKU views.",
                // Using 'up' (green) because faster is better; change to 'down' if you prefer red for “downwards”
                delta: { dir: "up" as const, text: "17s faster" },
              },
            ];

            return (
              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {kpis.map((k) => (
                  <KpiTile
                    key={k.label}
                    label={k.label}
                    value={k.value}
                    help={k.help}
                    delta={k.delta}
                    footnote={k.footnote ?? null}
                  />
                ))}
              </div>
            );
          })()}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="page-center">
        <div className="grid grid-cols-2 md:grid-cols-7 gap-3 justify-items-center md:justify-items-stretch">
          <TabButton value="overview">Overview</TabButton>
          <TabButton value="dataset">Dataset</TabButton>
          <TabButton value="eda">Exploratory</TabButton>
          <TabButton value="modeling">Modeling</TabButton>
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
              title="Goal"
              icon={<TrendingUp className="h-5 w-5" />}
            />
            <CardBody>
              <ul className="list-disc pl-5 space-y-2.5 text-[15px] leading-relaxed text-slate-800">
                <li>
                  Diagnose drop-offs along the browse → cart → order funnel.
                </li>
                <li>
                  Measure uplift of promotions and identify inefficiencies.
                </li>
                <li>Profile customer segments and channel behavior.</li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="My Role" icon={<Users className="h-5 w-5" />} />
            <CardBody>
              <ul className="list-disc pl-5 space-y-2.5 text-[15px] leading-relaxed text-slate-800">
                <li>Built sessionization & attribution logic in Python.</li>
                <li>Designed promo-effect measurement and baselines.</li>
                <li>Partnered with ops to align insights to levers.</li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Channel Mix"
              icon={<PieChartIcon className="h-5 w-5" />}
            />
            <CardBody>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      dataKey="value"
                      data={channelShare}
                      innerRadius={45}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {channelShare.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-[13px] text-slate-600 mt-2">
                Share of sessions by channel (placeholder).
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Promo Effect (Index)"
              icon={<BarChartIcon className="h-5 w-5" />}
            />
            <CardBody>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={promoEffect}>
                    <XAxis dataKey="promo" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="uplift">
                      {promoEffect.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-[13px] text-slate-600 mt-2">
                Relative order-rate uplift by promo type (placeholder).
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* DATASET */}
      {tab === "dataset" && (
        <div className="page-center mt-8 grid md:grid-cols-2 gap-8">
          <Card className="md:col-span-2">
            <CardHeader
              title="Tables & Keys"
              icon={<FileText className="h-5 w-5" />}
            />
            <CardBody className="text-[15px] leading-relaxed text-slate-800">
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>skus</strong> (SKU attributes, 1P/3P, brand)
                </li>
                <li>
                  <strong>users</strong> (demographics, PLUS, city level)
                </li>
                <li>
                  <strong>clicks</strong> (user → sku, timestamp, channel)
                </li>
                <li>
                  <strong>orders</strong> (prices, discounts, warehouse IDs)
                </li>
                <li>
                  <strong>delivery</strong> (ship-out, arrival timestamps)
                </li>
                <li>
                  <strong>inventory</strong> (daily availability by DC)
                </li>
                <li>
                  <strong>network</strong> (DC ↔ region mapping)
                </li>
              </ul>
              <div className="mt-3 p-3 rounded-xl bg-slate-100 text-[13px]">
                Primary joins: users.user_ID ↔ clicks.user_ID ↔ orders.user_ID;
                skus.sku_ID ↔ clicks.sku_ID ↔ orders.sku_ID. DC joins for
                logistics analyses.
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Sessionization Logic"
              icon={<Clock className="h-5 w-5" />}
            />
            <CardBody>
              <ol className="list-decimal pl-5 space-y-1.5 text-[15px] leading-relaxed text-slate-800">
                <li>Sort clicks by user and timestamp.</li>
                <li>
                  Start a new session when the gap ≥ <strong>1 hour</strong>{" "}
                  since the previous click.
                </li>
                <li>
                  Aggregate per-session metrics (duration, unique SKUs, channel
                  switches).
                </li>
              </ol>
              <div className="mt-3 p-3 rounded-xl bg-slate-100 text-[13px]">
                Export results to <code>/public/ecom/</code> JSONs to feed this
                page.
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Funnel (Sessions → Orders)"
              icon={<ShoppingCart className="h-5 w-5" />}
            />
            <CardBody>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sessionFunnel}>
                    <XAxis dataKey="step" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      dot
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="text-[13px] text-slate-600 mt-2">
                High-level conversion funnel (placeholder). Static PNG version
                available in Artifacts.
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* EDA */}
      {tab === "eda" && (
        <div className="page-center mt-8 grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader
              title="Inter‑click Times"
              icon={<LineChartIcon className="h-5 w-5" />}
            />
            <CardBody>
              {interclickBars.length ? (
                <>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={interclickBars}>
                        <XAxis dataKey="bin" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="ordered" stackId="a" fill="#0ea5e9" />
                        <Bar dataKey="nonordered" stackId="a" fill="#94a3b8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-[13px] text-slate-600 mt-2">
                    Ordered sessions have median{" "}
                    {interclickSummary.o_median ?? "—"}s vs{" "}
                    {interclickSummary.n_median ?? "—"}s; p90{" "}
                    {interclickSummary.o_p90 ?? "—"}s vs{" "}
                    {interclickSummary.n_p90 ?? "—"}s.
                  </div>
                </>
              ) : (
                <div className="p-3 rounded-xl bg-slate-100 text-[13px]">
                  Hooked to <code>/ecom/interclick_stats.json</code>. Add the
                  file to <code>public/ecom/</code> if you see no data.
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Channel Switching"
              icon={<PieChartIcon className="h-5 w-5" />}
            />
            <CardBody>
              {channels?.overall ? (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={pairShare}>
                          <XAxis
                            dataKey="pair"
                            interval={0}
                            tick={{ fontSize: 11 }}
                            angle={-90} // rotate labels
                            textAnchor="end" // align after rotation
                            height={110} // give space for tall labels
                            tickMargin={4}
                          />
                          <YAxis
                            tickFormatter={(v) => `${v}%`}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip formatter={(v) => `${v}%`} />
                          <Bar dataKey="session_share_pct" fill="#0ea5e9" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={pairCR}>
                          <XAxis
                            dataKey="pair"
                            interval={0}
                            tick={{ fontSize: 11 }}
                            angle={-90} // rotate labels
                            textAnchor="end" // align after rotation
                            height={110} // give space for tall labels
                            tickMargin={4}
                          />
                          <YAxis
                            tickFormatter={(v) => `${v}%`}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip formatter={(v) => `${v}%`} />
                          <Bar dataKey="cr_pct" fill="#22c55e" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="text-[13px] text-slate-600 mt-2">
                    Overall switch rate {pct(channels.overall.switch_rate)}; CR
                    switchers {pct(channels.overall.conversion_rate_switchers)}{" "}
                    vs no‑switch{" "}
                    {pct(channels.overall.conversion_rate_no_switch)} (lift{" "}
                    {(channels.overall.lift * 100).toFixed(1)}%).
                  </div>
                </>
              ) : (
                <div className="p-3 rounded-xl bg-slate-100 text-[13px]">
                  Hooked to <code>/ecom/channel_switching.json</code>. Add the
                  file to <code>public/ecom/</code> if you see no data.
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}

      {/* MODELING */}
      {tab === "modeling" && (
        <div className="page-center mt-8 grid md:grid-cols-2 gap-8">
          <Card className="md:col-span-2">
            <CardHeader title="Promo Uplift & Price Elasticity" />
            <CardBody>
              <ul className="list-disc pl-5 space-y-1.5 text-[15px] leading-relaxed text-slate-800">
                <li>
                  Baseline model: historical, channel, and user‑level controls.
                </li>
                <li>Estimate incremental effect of each promo type.</li>
                <li>
                  Compute cost per incremental order; flag negative ROI SKUs.
                </li>
              </ul>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Assortment & 1P/3P Mix" />
            <CardBody>
              <ul className="list-disc pl-5 space-y-1.5 text-[15px] leading-relaxed text-slate-800">
                <li>Compare conversion and delivery SLAs by ownership.</li>
                <li>Identify fast movers with stock‑outs by DC.</li>
              </ul>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Fulfillment Timeline" />
            <CardBody>
              <ul className="list-disc pl-5 space-y-1.5 text-[15px] leading-relaxed text-slate-800">
                <li>ship_out → station → delivered latency distributions.</li>
                <li>Impact on repeat purchase / returns.</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      )}

      {/* IMPACT (wired to uploaded JSONs) */}
      {tab === "impact" && (
        <div className="page-center mt-8 grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader title="Business Outcomes" />
            <CardBody>
              <ul className="list-disc pl-5 space-y-2.5 text-[15px] leading-relaxed text-slate-800">
                <li>Reduced promo spend with negative ROI SKUs.</li>
                <li>
                  Improved session → order conversion via channel insights.
                </li>
                <li>Faster deliveries on targeted DC-SKU pairs.</li>
              </ul>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Quantified Impact" />
            <CardBody>
              <ul className="list-disc pl-5 space-y-2 text-[15px] leading-relaxed text-slate-800">
                <li>
                  Promo waste:{" "}
                  <strong>
                    {impactWaste
                      ? `${impactWaste.overall.waste_pct_est}%`
                      : "—"}
                  </strong>
                  <div className="text-[12px] text-slate-500">
                    $
                    {impactWaste
                      ? num(impactWaste.overall.waste_spend_est)
                      : "—"}{" "}
                    of $
                    {impactWaste
                      ? num(impactWaste.overall.total_promo_spend)
                      : "—"}
                  </div>
                </li>
                <li>
                  Conversion (current → +5pp switch):{" "}
                  <strong>
                    {impactConv
                      ? `${(impactConv.outputs.current_cr * 100).toFixed(
                          1
                        )}% → ${(impactConv.outputs.target_cr * 100).toFixed(
                          1
                        )}%`
                      : "—"}
                  </strong>
                </li>
                <li>
                  Time saved:{" "}
                  <strong>
                    {impactTime
                      ? `${impactTime.outputs.time_saved_hours_per_week} hrs/week`
                      : "—"}
                  </strong>
                </li>
                <li>
                  Latency → Repeat:{" "}
                  <strong>{impactLat?.status ?? "pending"}</strong>
                </li>
              </ul>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Metrics to Watch" />
            <CardBody>
              <ul className="list-disc pl-5 space-y-2.5 text-[15px] leading-relaxed text-slate-800">
                <li>Cost per incremental order by promo type.</li>
                <li>Stock-out rate by DC; delivery promise hit-rate.</li>
                <li>Repurchase rate by days‑to‑deliver band.</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      )}

      {/* SKILLS */}
      {tab === "skills" && (
        <div className="page-center mt-8 grid md:grid-cols-3 gap-8">
          {[
            {
              k: "Data Engineering / Analytics",
              v: [
                "PySpark/pandas pipelines (partitioned joins; window fns)",
                "Sessionization; attribution; leakage checks",
                "Reproducible EDA & model notebooks",
              ],
            },
            {
              k: "Modeling & Experimentation",
              v: [
                "Promo uplift estimation; elasticity curves",
                "Funnel modeling; survival / hazard for latency",
                "A/B test design; CUPED baselines",
              ],
            },
            {
              k: "Business Analysis",
              v: [
                "Opportunity sizing; ROI frameworks",
                "Stakeholder mapping (Marketing, Ops, Supply)",
                "Exec storytelling; decision memos",
              ],
            },
          ].map(({ k, v }) => (
            <Card key={k}>
              <CardHeader title={k} />
              <CardBody className="text-[15px] leading-relaxed text-slate-800">
                <ul className="list-disc pl-5 space-y-1.5">
                  {v.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* ARTIFACTS (show uploaded PNGs) */}
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
            <CardBody className="grid gap-3 text-[15px] leading-relaxed text-slate-800">
              <a
                className="p-3 rounded-xl border hover:bg-slate-50"
                href="/ecom/notebooks/MSOM Research Challenge Draft_20190829.docx"
              >
                Research Paper
              </a>
              <a
                className="p-3 rounded-xl border hover:bg-slate-50"
                href="/ecom/notebooks/Notebook_Search_Patterns.ipynb"
              >
                Main Notebook
              </a>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Static Charts (PNGs)" />
            <CardBody>
              <div className="grid grid-cols-1 gap-4">
                <figure className="rounded-xl overflow-hidden border">
                  <img
                    src="/ecom/funnel.png"
                    alt="Conversion funnel chart"
                    className="w-full h-auto"
                  />
                  <figcaption className="text-[12px] text-slate-600 p-2">
                    Funnel (Sessions → Views → Cart → Orders)
                  </figcaption>
                </figure>
                <figure className="rounded-xl overflow-hidden border">
                  <img
                    src="/ecom/promo_uplift.png"
                    alt="Promo uplift bar chart"
                    className="w-full h-auto"
                  />
                  <figcaption className="text-[12px] text-slate-600 p-2">
                    Promo Effect (Index)
                  </figcaption>
                </figure>
                <figure className="rounded-xl overflow-hidden border">
                  <img
                    src="/ecom/latency_dist.png"
                    alt="Delivery latency distribution"
                    className="w-full h-auto"
                  />
                  <figcaption className="text-[12px] text-slate-600 p-2">
                    Delivery Latency Distribution
                  </figcaption>
                </figure>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* CTA */}
      <div className="page-center mt-12 flex flex-wrap items-center justify-between gap-3">
        <div className="text-[15px] text-slate-700 leading-relaxed">
          Want the full analysis or anonymized code snippets? I can share
          cleaned tables and helper functions on request.
        </div>
        <div className="flex gap-2">
          <a
            href="/profile"
            className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800"
          >
            Get in touch
          </a>
          <a
            href="/projects"
            className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium border border-slate-300 text-slate-800 hover:bg-slate-50"
          >
            See more projects
          </a>
        </div>
      </div>
    </PageShell>
  );
}
