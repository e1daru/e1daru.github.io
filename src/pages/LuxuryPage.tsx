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

// ---------- Visual theme ----------
const COLORS = [
  "#0ea5e9",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

const chartMargin = { top: 24, right: 28, bottom: 44, left: 28 };
const axisTick = { fontSize: 12, fill: '#a1a1aa' } as const;
const legendStyle = { fontSize: 12 } as const;

// ---------- Page ----------
export default function LuxuryPage() {
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
            Luxury Brand Perception Classifier
          </h1>

          <div className="mt-10 grid md:grid-cols-12 gap-12 items-start">
            {/* Left: intro text */}
            <div className="md:col-span-7">
              <p className="text-zinc-300 text-lg md:text-xl leading-8 max-w-prose">
                TikTok-first multi-label NLP pipeline that classifies comments
                about luxury houses into six perception pillars —{" "}
                <strong>
                  quality, reputation, service, social impact, ethics,
                  sustainability
                </strong>{" "}
                — to track brand health and competitive position in near
                real-time. Using a fine-tuned{" "}
                <strong>RoBERTa (go_emotions)</strong> backbone, the system
                outputs per-pillar probabilities and tone for strategist-ready
                insights, replacing traditional research cycles that cost{" "}
                <strong>$15k–$50k</strong> and take <strong>6–7 weeks</strong>.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-cyan-400/20 text-white">
                  NLP
                </span>
                <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-zinc-700 text-zinc-300">
                  Multi-Label
                </span>
                <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border border-zinc-600 text-zinc-300">
                  Business Analysis
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <a
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-zinc-700 bg-zinc-900 px-6 py-3 text-base font-medium text-zinc-100 shadow-sm hover:bg-zinc-800 hover:border-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 transition"
                >
                  Home
                </a>
              </div>
            </div>

            {/* Right: pillar overview */}
            <div className="md:col-span-5">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-zinc-100 mb-3">
                  Six Perception Pillars
                </h3>
                <ul className="space-y-2 text-zinc-300 text-[15px]">
                  {[
                    "Product Quality",
                    "Brand Reputation & Heritage",
                    "Customer Service",
                    "Social Impact",
                    "Ethical Practices",
                    "Sustainability",
                  ].map((name, i) => (
                    <li key={name} className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ background: COLORS[i] }}
                      />
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-4 gap-8">
            {kError && (
              <div className="text-sm text-red-600">Failed to load KPIs</div>
            )}
            {kLoading && (
              <div className="text-sm text-zinc-500">Loading KPIs...</div>
            )}
            {KPIS &&
              KPIS.map((x, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm"
                >
                  <div className="text-4xl font-extrabold text-zinc-100">
                    {x.kpi}
                  </div>
                  <div className="text-sm uppercase tracking-wide text-zinc-500 mt-1 text-center">
                    {x.label}
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      </section>

      {/* Problem & Solution */}
      <section className="page-center mt-16 grid gap-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">The Problem</h2>
            <p className="mt-3 text-zinc-300 text-lg">
              Perception shifts quickly; traditional research costs{" "}
              <strong>$15k–$50k</strong> and takes <strong>6–7 weeks</strong>,
              lagging behind fast-moving consumer sentiment. Luxury leaders need
              label-level signals by brand and over time to act before trends
              harden.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">The Solution</h2>
            <p className="mt-3 text-zinc-300 text-lg">
              A TikTok-first pipeline: <strong>Apify scrapers</strong> feed into
              a cleaning stage, then into a multi-label classifier that outputs
              brand/pillar scores. The <strong>RoBERTa (go_emotions)</strong>{" "}
              backbone provides pillar probabilities and tone for
              strategist-ready insights — refreshed in{" "}
              <strong>~1–2 hours</strong> instead of weeks.
            </p>
          </div>
        </div>
      </section>

      {/* Data & Collection */}
      <section className="page-center mt-16 grid gap-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="h-80">
            <h3 className="text-center font-semibold mb-2">
              Label Distribution (comments by pillar)
            </h3>
            {ldError && (
              <div className="text-sm text-red-600">
                Failed to load label distribution
              </div>
            )}
            {ldLoading && (
              <div className="text-sm text-zinc-500">
                Loading distribution...
              </div>
            )}
            {labelDist && labelDist.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={labelDist} margin={chartMargin}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="label" tick={axisTick} interval={0} />
                  <YAxis tick={axisTick} />
                  <Tooltip contentStyle={{ background: '#111118', border: '1px solid #27272a', color: '#e4e4e7' }} />
                  <Legend wrapperStyle={legendStyle} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {labelDist.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                    <LabelList dataKey="count" position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">
              Sources & Collection
            </h2>
            <p className="mt-3 text-zinc-300 text-lg">
              Using Apify TikTok Data Extractor and Comments Scraper, I
              collected <strong>21,136 comments</strong> from{" "}
              <strong>2,300+ videos</strong> across{" "}
              <strong>23 luxury houses</strong> — from Chanel and Gucci to niche
              labels like The Row. After cleaning, tokenization, dedup, and
              language filtering, each comment was labeled across six perception
              pillars.
            </p>
          </div>
        </div>
      </section>

      {/* Model & Per-Label Metrics */}
      <section className="page-center mt-16 grid gap-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="h-80">
            <h3 className="text-center font-semibold mb-2">
              Per-Label F1 Scores
            </h3>
            {mlError && (
              <div className="text-sm text-red-600">
                Failed to load metrics
              </div>
            )}
            {mlLoading && (
              <div className="text-sm text-zinc-500">Loading metrics...</div>
            )}
            {byLabel && byLabel.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={byLabel}
                  layout="vertical"
                  margin={{ left: 20, right: 80, top: 40, bottom: 20 }}
                  barCategoryGap={14}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis
                    type="number"
                    domain={[0, 1]}
                    tickFormatter={(v) => `${Math.round(v * 100)}%`}
                    interval={0}
                    tick={axisTick}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={200}
                    tick={axisTick}
                  />
                  <Tooltip
                    formatter={(v: number) => `${Math.round(v * 100)}%`}
                    contentStyle={{ background: '#111118', border: '1px solid #27272a', color: '#e4e4e7' }}
                  />
                  <Legend wrapperStyle={legendStyle} />
                  <Bar dataKey="f1" fill="#0ea5e9" radius={[6, 6, 6, 6]}>
                    {byLabel.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                    <LabelList
                      dataKey="f1"
                      position="right"
                      offset={8}
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
              Training & Evaluation
            </h2>
            <p className="mt-3 text-zinc-300 text-lg">
              The backbone is{" "}
              <strong>SamLowe/roberta-base-go_emotions</strong> (emotion
              pretrained), fine-tuned for our six pillars with Binary
              Cross-Entropy loss. Training ran for <strong>5 epochs</strong>,{" "}
              <strong>batch size 32</strong>, <strong>lr=2e-5</strong>. The model
              outputs overall perception, tone, and per-pillar probabilities.
            </p>
            <p className="mt-3 text-zinc-300 text-lg">
              Time-based train/val/test splits avoid leakage around events.
              Continuous evaluation tracks label-wise precision, recall, and F1
              scores.
            </p>
          </div>
        </div>

        {/* Brand x Pillar */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="h-80">
            <h3 className="text-center font-semibold mb-2">
              Brand x Pillar Share
            </h3>
            {bpError && (
              <div className="text-sm text-red-600">
                Failed to load brand/pillar data
              </div>
            )}
            {bpLoading && (
              <div className="text-sm text-zinc-500">
                Loading comparison...
              </div>
            )}
            {brandPillar && brandPillar.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={brandPillar} margin={chartMargin}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="brand" tick={axisTick} />
                  <YAxis
                    tickFormatter={(v) => `${Math.round(v * 100)}%`}
                    tick={axisTick}
                  />
                  <Tooltip
                    formatter={(v: number) => `${Math.round(v * 100)}%`}
                    contentStyle={{ background: '#111118', border: '1px solid #27272a', color: '#e4e4e7' }}
                  />
                  <Legend wrapperStyle={legendStyle} />
                  {brandPillar.length > 0 &&
                    Object.keys(brandPillar[0])
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
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">
              Competitive Brand Comparison
            </h2>
            <p className="mt-3 text-zinc-300 text-lg">
              The stacked chart reveals how each brand's comment volume
              distributes across the six pillars. Strategists can spot which
              brands dominate on quality perception versus those drawing
              conversation around ethics or sustainability — and detect rising
              issues at the pillar level.
            </p>
          </div>
        </div>
      </section>

      {/* Results — Confusion Matrix & ROC */}
      <section className="page-center mt-16 grid gap-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <img
              src="/luxury/confusion.png"
              alt="Confusion matrix across 6 labels"
              className="w-full rounded-2xl shadow-md ring-1 ring-zinc-800 object-cover"
            />
            <div className="text-[13px] text-zinc-400 mt-2 text-center">
              Sample notes: TP=40, FP=38, FN=15, TN=7.
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">
              Confusion Matrix
            </h2>
            <p className="mt-3 text-zinc-300 text-lg">
              The confusion matrix over the first 100 comments shows the
              classifier's performance across all six labels. Early precision
              reached <strong>~0.78</strong> — a solid starting point with clear
              room to iterate on thresholds and labeling QA.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <img
              src="/luxury/roc.png"
              alt="ROC and precision-recall curves by label"
              className="w-full rounded-2xl shadow-md ring-1 ring-zinc-800 object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">
              ROC & PR Curves
            </h2>
            <p className="mt-3 text-zinc-300 text-lg">
              ROC and precision-recall curves by label illustrate the trade-offs
              for each pillar. These guide threshold calibration — balancing
              coverage against precision depending on the strategic use case.
            </p>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="page-center mt-16 grid gap-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">Operational</h2>
            <p className="mt-3 text-zinc-300 text-lg">
              Refresh insights in <strong>~1–2 hours</strong> (scrape + model)
              vs 6–7 weeks for traditional studies. TikTok focus captures trend
              velocity; easily extendable to Twitter/Instagram. Compare brands
              and detect rising issues at the pillar level.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">Financial</h2>
            <p className="mt-3 text-zinc-300 text-lg">
              Traditional research: <strong>$15k–$50k</strong> one-off. Pipeline
              run cost: about <strong>$443/month</strong> (Apify + API) at daily
              cadence. Reallocate budget from lagging surveys to continuous
              monitoring.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">
              Risks & Mitigations
            </h2>
            <p className="mt-3 text-zinc-300 text-lg">
              <strong>Limited data source</strong> (TikTok only): expand to more
              platforms. <strong>Low early precision (~0.78)</strong>: iterate on
              model/thresholds and labeling QA.{" "}
              <strong>Lack of topical detail</strong>: link exemplar comments to
              dashboards.
            </p>
          </div>
        </div>
      </section>

      {/* Ethics */}
      <section className="page-center mt-16 grid gap-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">
              Data Ethics & Bias
            </h2>
            <p className="mt-3 text-zinc-300 text-lg">
              Public data only; respect platform TOS; remove PII; aggregate for
              reporting. Bias checks include class balance, domain drift
              monitoring, and threshold calibration. Known limitations —
              sarcasm, language coverage, bot activity — are documented.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">
              Quality Controls
            </h2>
            <p className="mt-3 text-zinc-300 text-lg">
              Time-based train/val/test to avoid leakage around events.
              Inter-annotator agreement (Krippendorff's alpha) planned with
              adjudication for tough cases. Continuous evaluation with
              label-wise precision/recall and supports.
            </p>
          </div>
        </div>
      </section>

      {/* Notebooks & Artifacts */}
      <section className="page-center mt-16 grid gap-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">
              Notebooks & Artifacts
            </h2>
            <ul className="mt-3 space-y-2 text-zinc-300 text-lg">
              <li>
                <a
                  href="/luxury/cleaning_data_labeling.ipynb"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-700 hover:underline"
                >
                  cleaning_data_labeling.ipynb
                </a>{" "}
                — data prep & labeling
              </li>
              <li>
                <a
                  href="/luxury/brand_perception.ipynb"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-700 hover:underline"
                >
                  brand_perception.ipynb
                </a>{" "}
                — modeling & evaluation
              </li>
              <li>
                <a
                  href="/luxury/amiri.ipynb"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-700 hover:underline"
                >
                  amiri.ipynb
                </a>{" "}
                — brand deep-dive
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/luxury/confusion.png"
              alt="Confusion Matrix"
              className="rounded-2xl border shadow-sm"
            />
            <img
              src="/luxury/roc.png"
              alt="ROC Curve"
              className="rounded-2xl border shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* PDF Viewer */}
      <section className="page-center mt-16">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-xl font-semibold text-zinc-100">
            Presentation Slides (scrollable)
          </h2>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
          <a
            href="/luxury/488-Spring2024-MajorClassProjectP2_Section001-TeamD.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sky-700 hover:underline"
          >
            Open in new tab
          </a>
          <span className="text-zinc-500">&bull;</span>
          <a
            href="/"
            className="inline-flex items-center gap-1 text-sky-700 hover:underline"
          >
            Home
          </a>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 shadow-sm">
          <div className="p-2">
            <object
              data="/luxury/488-Spring2024-MajorClassProjectP2_Section001-TeamD.pdf#page=1&zoom=110"
              type="application/pdf"
              className="w-full"
              style={{ height: "80vh" }}
            >
              <embed
                src="/luxury/488-Spring2024-MajorClassProjectP2_Section001-TeamD.pdf#page=1&zoom=110"
                type="application/pdf"
              />
            </object>
          </div>
        </div>
      </section>

      {/* Result */}
      <section className="page-center mt-20 mb-24">
        <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-white border border-violet-100 p-8 shadow-sm text-center">
          <h2 className="text-3xl font-bold text-zinc-100">The Result</h2>
          <p className="mt-4 text-lg text-zinc-300 max-w-3xl mx-auto">
            A near real-time perception intelligence system that replaces
            $15k–$50k traditional research with a{" "}
            <strong>~$443/month</strong> pipeline. Classifying{" "}
            <strong>21,136 TikTok comments</strong> across{" "}
            <strong>23 luxury brands</strong> into six perception pillars,
            strategists can now track brand health, detect shifts, and compare
            competitive positioning — refreshed in hours, not weeks.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <a
              href="/luxury/488-Spring2024-MajorClassProjectP2_Section001-TeamD.pdf"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border-2 border-sky-400 px-5 py-2 text-sky-700 hover:bg-sky-50 font-semibold shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 transition"
            >
              View Slides
            </a>
            <a
              href="/luxury/brand_perception.ipynb"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border-2 border-sky-400 px-5 py-2 text-sky-700 hover:bg-sky-50 font-semibold shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 transition"
            >
              View Notebook
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </Layout>
  );
}
