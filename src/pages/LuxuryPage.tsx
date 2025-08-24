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
  Legend,
  Cell,
} from "recharts";
import {
  Gem,
  ChartBarBig,
  Brain,
  Scale,
  ShieldCheck,
  FileText,
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
type Pillar =
  | "Quality"
  | "Reputation"
  | "Service"
  | "Social"
  | "Ethics"
  | "Sustainability";

type KPI = { kpi: string; label: string };
type CountRow = { label: string; count: number };
type LabelMetric = {
  label: string;
  precision: number;
  recall: number;
  f1: number;
  support?: number;
};
type BrandRow = { brand: string } & Record<Pillar, number>;
type TimelineRow = { month: string } & Record<Pillar, number>;

// ---------- Visual theme ----------
const COLORS = [
  "#0ea5e9",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
]; // 6 pillars

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
export default function LuxuryPage() {
  const { tab, TabButton } = useTabs("overview");

  // Live data from /public/luxury/*.json
  const {
    data: KPIS,
    loading: kLoading,
    error: kError,
  } = useJSON<KPI[]>("/luxury/kpis.json");
  const {
    data: labelDist,
    loading: ldLoading,
    error: ldError,
  } = useJSON<CountRow[]>("/luxury/label_distribution.json");
  const {
    data: byLabel,
    loading: mlLoading,
    error: mlError,
  } = useJSON<LabelMetric[]>("/luxury/metrics_by_label.json");
  const {
    data: brandPillar,
    loading: bpLoading,
    error: bpError,
  } = useJSON<BrandRow[]>("/luxury/brand_pillar.json");
  const {
    data: timeline,
    loading: tlLoading,
    error: tlError,
  } = useJSON<TimelineRow[]>("/luxury/pillar_timeline.json");

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
                Luxury Brand Perception Classifier
              </h1>
              <p className="text-slate-700 mt-3 mx-auto md:mx-0 max-w-2xl md:max-w-3xl leading-relaxed">
                TikTok-first multi‑label NLP that classifies comments about
                luxury houses into six perception pillars (quality, reputation,
                service, social impact, ethics, sustainability) to track brand
                health and competitive position in near real‑time.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-end">
              <span className="inline-flex items-center rounded-full px-2.5 py-1 text-md font-medium bg-slate-900 text-white">
                NLP
              </span>
              <span className="inline-flex items-center rounded-full px-2.5 py-1 text-md font-medium bg-slate-300 text-slate-700">
                Multi‑Label
              </span>
              <span className="inline-flex items-center rounded-full px-2.5 py-1 text-md font-medium border border-slate-500 text-slate-700">
                Business Analysis
              </span>
            </div>
          </div>

          {/* KPIs (from presentation) */}
          <div className="mt-7 grid grid-cols-2 md:grid-cols-4 gap-4">
            {kError && (
              <Card>
                <CardBody>
                  <div className="text-sm text-red-600">
                    Failed to load /luxury/kpis.json
                  </div>
                </CardBody>
              </Card>
            )}
            {kLoading && (
              <Card>
                <CardBody>
                  <div className="text-sm text-slate-500">Loading KPIs…</div>
                </CardBody>
              </Card>
            )}
            {KPIS && KPIS.length > 0 ? (
              KPIS.map((x, i) => (
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
              ))
            ) : !kLoading && !kError ? (
              <Card className="md:col-span-4">
                <CardBody>
                  <div className="text-sm text-slate-500">
                    Provide <code>/public/luxury/kpis.json</code> like:
                    <pre className="mt-1 bg-slate-50 p-2 rounded border overflow-x-auto">{`[
  { "kpi": "21,136", "label": "TikTok comments analyzed" },
  { "kpi": "2,300+", "label": "Videos scraped (Apify)" },
  { "kpi": "23", "label": "Luxury brands tracked" },
  { "kpi": "~$443/mo", "label": "Model + scraping run cost" }
]`}</pre>
                  </div>
                </CardBody>
              </Card>
            ) : null}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="page-center">
        <div className="grid grid-cols-2 md:grid-cols-7 gap-3 justify-items-center md:justify-items-stretch">
          <TabButton value="overview">Overview</TabButton>
          <TabButton value="data">Data & Labels</TabButton>
          <TabButton value="model">Model</TabButton>
          <TabButton value="results">Results</TabButton>
          <TabButton value="impact">Impact</TabButton>
          <TabButton value="ethics">Ethics</TabButton>
          <TabButton value="artifacts">Artifacts</TabButton>
        </div>
      </div>

      {/* OVERVIEW */}
      {tab === "overview" && (
        <div className="page-center mt-8 grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader title="Problem" icon={<Gem className="h-5 w-5" />} />
            <CardBody>
              <ul className="list-disc pl-5 space-y-2.5 text-[15px] leading-relaxed text-slate-800">
                <li>
                  Perception shifts quickly; traditional research ($15k–$50k,
                  6–7 weeks) lags and dates fast.
                </li>
                <li>
                  Luxury leaders need label‑level signals by brand and over time
                  to act before trends harden.
                </li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Solution" icon={<Brain className="h-5 w-5" />} />
            <CardBody>
              <ul className="list-disc pl-5 space-y-2.5 text-[15px] leading-relaxed text-slate-800">
                <li>
                  TikTok‑first pipeline: Apify scrapers → cleaning → multi‑label
                  classifier → brand/pillar scores.
                </li>
                <li>
                  RoBERTa (go_emotions) backbone; outputs pillar probabilities +
                  tone for strategist‑ready insights.
                </li>
              </ul>
            </CardBody>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader
              title="Label Distribution (example)"
              icon={<ChartBarBig className="h-5 w-5" />}
            />
            <CardBody>
              {ldError && (
                <div className="text-sm text-red-600">
                  Failed to load /luxury/label_distribution.json
                </div>
              )}
              {ldLoading && (
                <div className="text-sm text-slate-500">
                  Loading distribution…
                </div>
              )}
              {labelDist && labelDist.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={labelDist}>
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11 }}
                        interval={0}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="count">
                        {labelDist.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-sm text-slate-500">
                  Provide <code>/public/luxury/label_distribution.json</code>{" "}
                  (counts by pillar).
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}

      {/* DATA & LABELS */}
      {tab === "data" && (
        <div className="page-center mt-8 grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader
              title="Sources & Collection"
              icon={<Users className="h-5 w-5" />}
            />
            <CardBody>
              <ul className="list-disc pl-5 space-y-2.5 text-[15px] leading-relaxed text-slate-800">
                <li>
                  Apify TikTok Data Extractor + Comments Scraper:{" "}
                  <b>21,136 comments</b> from <b>2,300+ videos</b>.
                </li>
                <li>
                  Brands covered: <b>23 luxury houses</b> (from Chanel & Gucci
                  to niche labels like The Row).
                </li>
                <li>
                  Preprocessing: cleaning, tokenization, dedup, language
                  filters.
                </li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Pillars (Labels)"
              icon={<Scale className="h-5 w-5" />}
            />
            <CardBody>
              <ul className="list-disc pl-5 space-y-1.5 text-[15px] leading-relaxed text-slate-800">
                <li>Product Quality</li>
                <li>Brand Reputation & Heritage</li>
                <li>Customer Service</li>
                <li>Social Impact</li>
                <li>Ethical Practices</li>
                <li>Sustainability</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      )}

      {/* MODEL */}
      {tab === "model" && (
        <div className="page-center mt-8 grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader
              title="Training Setup"
              icon={<ChartBarBig className="h-5 w-5" />}
            />
            <CardBody>
              <ul className="list-disc pl-5 space-y-2 text-[15px] leading-relaxed text-slate-800">
                <li>
                  Backbone: <code>SamLowe/roberta-base-go_emotions</code>{" "}
                  (emotion pretrain) → fine‑tuned for pillars.
                </li>
                <li>
                  Loss: Binary Cross‑Entropy (multi‑label);{" "}
                  <code>epochs=5</code>, <code>batch=32</code>,{" "}
                  <code>lr=2e-5</code>.
                </li>
                <li>
                  Outputs: overall perception + tone + per‑pillar probabilities.
                </li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Per‑Label Metrics (F1)"
              icon={<ChartBarBig className="h-5 w-5" />}
            />
            <CardBody>
              {mlError && (
                <div className="text-sm text-red-600">
                  Failed to load /luxury/metrics_by_label.json
                </div>
              )}
              {mlLoading && (
                <div className="text-sm text-slate-500">Loading metrics…</div>
              )}
              {byLabel && byLabel.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={byLabel} layout="vertical">
                      <XAxis
                        type="number"
                        domain={[0, 1]}
                        tickFormatter={(v) =>
                          `${Math.round((v as number) * 100)}%`
                        }
                      />
                      <YAxis type="category" dataKey="label" width={180} />
                      <Tooltip
                        formatter={(v: number) => `${Math.round(v * 100)}%`}
                      />
                      <Bar dataKey="f1">
                        {byLabel.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-sm text-slate-500">
                  Provide <code>/public/luxury/metrics_by_label.json</code> or
                  add a note with headline metric (e.g., precision ≈ 0.78 on
                  first audit).
                </div>
              )}
            </CardBody>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader
              title="Brand × Pillar Share"
              icon={<ChartBarBig className="h-5 w-5" />}
            />
            <CardBody>
              {bpError && (
                <div className="text-sm text-red-600">
                  Failed to load /luxury/brand_pillar.json
                </div>
              )}
              {bpLoading && (
                <div className="text-sm text-slate-500">
                  Loading comparison…
                </div>
              )}
              {brandPillar && brandPillar.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={brandPillar}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="brand" tick={{ fontSize: 12 }} />
                      <YAxis
                        tickFormatter={(v) =>
                          `${Math.round((v as number) * 100)}%`
                        }
                      />
                      <Tooltip
                        formatter={(v: number) => `${Math.round(v * 100)}%`}
                      />
                      <Legend />
                      {Object.keys(brandPillar[0])
                        .filter((k) => k !== "brand")
                        .map((pillar, i) => (
                          <Bar
                            key={pillar}
                            dataKey={pillar}
                            stackId="a"
                            fill={COLORS[i % COLORS.length]}
                          />
                        ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-sm text-slate-500">
                  Provide <code>/public/luxury/brand_pillar.json</code> with
                  shares per pillar (0–1).
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}

      {/* RESULTS */}
      {tab === "results" && (
        <div className="page-center mt-8 grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader
              title="Confusion Matrix (first 100 comments)"
              icon={<ChartBarBig className="h-5 w-5" />}
            />
            <CardBody>
              <img
                src="/luxury/confusion.png"
                alt="Confusion matrix across 6 labels"
                className="rounded-xl border w-full"
              />
              <div className="text-[13px] text-slate-600 mt-2">
                Slide sample notes: TP=40, FP=38, FN=15, TN=7.
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader
              title="ROC / PR Curves (illustrative)"
              icon={<ChartBarBig className="h-5 w-5" />}
            />
            <CardBody>
              <img
                src="/luxury/roc.png"
                alt="ROC and precision‑recall curves by label"
                className="rounded-xl border w-full"
              />
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
                icon={<ShieldCheck className="h-5 w-5" />}
              />
              <CardBody>
                <ul className="list-disc pl-5 space-y-2.5 text-[15px] leading-relaxed text-slate-800">
                  <li>
                    Refresh insights in ~1–2 hours (scrape + model) vs 6–7 weeks
                    for traditional studies.
                  </li>
                  <li>
                    TikTok focus captures trend velocity; easily extendable to
                    Twitter/Instagram.
                  </li>
                  <li>
                    Compare brands and detect rising issues at the pillar level.
                  </li>
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
                    Traditional research: <b>$15k–$50k</b> one‑off projects.
                  </li>
                  <li>
                    Pipeline run cost: about <b>$443/month</b> (Apify actors +
                    API runs) at daily cadence.
                  </li>
                  <li>
                    Reallocate budget from lagging surveys to continuous
                    monitoring.
                  </li>
                </ul>
              </CardBody>
            </Card>

            <Card>
              <CardHeader
                title="Risks & Mitigations"
                icon={<Gem className="h-5 w-5" />}
              />
              <CardBody>
                <ul className="list-disc pl-5 space-y-2.5 text-[15px] leading-relaxed text-slate-800">
                  <li>
                    <b>Limited data source</b> (TikTok): expand to more
                    platforms for coverage.
                  </li>
                  <li>
                    <b>Lack of topical detail</b>: link exemplar comments to
                    dashboards for drill‑downs.
                  </li>
                  <li>
                    <b>Low precision reported</b> in early cut (≈0.78): iterate
                    on model/thresholds and labeling QA.
                  </li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {/* ETHICS */}
      {tab === "ethics" && (
        <div className="page-center mt-8 grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader
              title="Data Ethics & Bias"
              icon={<ShieldCheck className="h-5 w-5" />}
            />
            <CardBody>
              <ul className="list-disc pl-5 space-y-2 text-[15px] leading-relaxed text-slate-800">
                <li>
                  Public data only; respect platform TOS; remove PII; aggregate
                  for reporting.
                </li>
                <li>
                  Bias checks: class balance, domain drift monitoring, threshold
                  calibration.
                </li>
                <li>
                  Document known limitations (sarcasm, language coverage, bot
                  activity).
                </li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Quality Controls"
              icon={<ShieldCheck className="h-5 w-5" />}
            />
            <CardBody>
              <ul className="list-disc pl-5 space-y-2 text-[15px] leading-relaxed text-slate-800">
                <li>
                  Time‑based train/val/test to avoid leakage around events.
                </li>
                <li>
                  Inter‑annotator agreement (Krippendorff's α) planned;
                  adjudication for tough cases.
                </li>
                <li>
                  Continuous evaluation with label‑wise precision/recall and
                  supports.
                </li>
              </ul>
            </CardBody>
          </Card>
        </div>
      )}

      {/* ARTIFACTS */}
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
                    href="/luxury/cleaning_data_labeling.ipynb"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    cleaning_data_labeling.ipynb
                  </a>{" "}
                  — data prep & labeling.
                </li>
                <li>
                  <a
                    href="/luxury/brand_perception.ipynb"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    brand_perception.ipynb
                  </a>{" "}
                  — modeling & evaluation.
                </li>
                <li>
                  <a
                    href="/luxury/amiri.ipynb"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    amiri.ipynb
                  </a>{" "}
                  — brand deep‑dive.
                </li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Model Artifacts" />
            <CardBody className="grid md:grid-cols-2 gap-4">
              <img
                src="/luxury/confusion.png"
                alt="Confusion Matrix"
                className="rounded-xl border"
              />
              <img
                src="/luxury/roc.png"
                alt="ROC Curve"
                className="rounded-xl border"
              />
            </CardBody>
          </Card>
        </div>
      )}

      {/* Presentation Slides always at bottom */}
      <section className="page-center mt-12" id="slides">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Presentation Slides
          </h2>
          <div className="flex gap-2">
            <a
              href="/luxury/488-Spring2024-MajorClassProjectP2_Section001-TeamD.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-xl px-3 py-2 text-sm font-medium border border-slate-300 text-slate-800 hover:bg-slate-50"
            >
              Open in new tab
            </a>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <iframe
            title="Luxury Brand Classifier — Final Slides"
            src="/luxury/488-Spring2024-MajorClassProjectP2_Section001-TeamD.pdf#view=FitH"
            className="w-full h-[75vh]"
          />
        </div>
        <p className="text-[13px] text-slate-600 mt-2">
          If your browser blocks embedded PDFs, use “Open in new tab.”
        </p>
      </section>
    </PageShell>
  );
}
