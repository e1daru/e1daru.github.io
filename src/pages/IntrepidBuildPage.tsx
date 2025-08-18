import React from "react";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import {
  Target,
  Sparkles,
  Users,
  BarChart as BarChartIcon,
  LineChart,
  CheckCircle,
  FileText,
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
} from "recharts";

// ---------- Types ----------
type Slice = { name: string; value: number };
type Factor = { factor: string; score: number };
type Persona = { title: string; bullets: string[] };
type Deliverable = { title: string; desc: string };

// ---------- Data (unchanged) ----------
const familiarityData: Slice[] = [
  { name: "Very familiar", value: 11 },
  { name: "Somewhat familiar", value: 30 },
  { name: "Not familiar", value: 59 },
];

const housingTypePrefProject: Slice[] = [
  { name: "Single Family", value: 62 },
  { name: "Townhouse", value: 17 },
  { name: "Multi Family", value: 12 },
  { name: "Condo", value: 9 },
];

const housingTypePrefUS: Slice[] = [
  { name: "Single Family", value: 75 },
  { name: "Townhouse", value: 15 },
  { name: "Condo", value: 6 },
  { name: "Multi Family", value: 4 },
];

const topDecisionFactors: Factor[] = [
  { factor: "Price", score: 92 },
  { factor: "Location", score: 88 },
  { factor: "Size", score: 74 },
  { factor: "Eco-friendliness", score: 61 },
  { factor: "Customization", score: 57 },
  { factor: "Amenities", score: 49 },
];

const personaCards: Persona[] = [
  {
    title: "The Traditionalist Teacher",
    bullets: [
      "55–64, college educated, ~$50k median income",
      "Budget: ~$2,000/mo; values durability & livability",
      "Prefers SFH; cautious about aesthetics & resale",
    ],
  },
  {
    title: "The Young Professionals",
    bullets: [
      "25–44, diverse backgrounds, income $80k+",
      "Budget: $1,000–$2,000/mo; open to steel-framed",
      "Motivated by design flexibility & speed to build",
    ],
  },
  {
    title: "The Practical Saver",
    bullets: [
      "25–54, many earning $150k+ (household)",
      "Budget: $1,500–$2,500/mo; equity-minded",
      "Skeptical of ‘industrial’ look; wants proof & comps",
    ],
  },
];

const skills: Record<string, string[]> = {
  "Marketing Research (Technical)": [
    "Qualtrics survey architecture (42 Qs; Likert, ranking, multi-select)",
    "Sampling & de-biasing (network vs. external ~68%)",
    "Python: pandas/numpy for cleaning, normalization, recoding",
    "Segmentation: cross-tabs by AMI, WTP, housing type",
    "Weighted ranking & index scoring for factor importance",
    "Thematic coding for focus group notes",
    "A/B message testing (‘affordable’ vs ‘attainable’)",
  ],
  "Analytics & Finance": [
    "Excel P&L modeling (materials, labor, land, OH)",
    "ROI & breakeven for capex (70 units / 5 yrs sensitivity)",
    "Scenario analysis (cost-to-$150k target; ~20% margin)",
    "Insurance impact analysis (steel vs stick-build risk)",
  ],
  "Consulting & BA": [
    "Stakeholder mapping & interview guide design",
    "Focus group facilitation & synthesis",
    "Competitive benchmarking & positioning",
    "Go-to-market playbook & language frameworks",
  ],
};

const deliverables: Deliverable[] = [
  {
    title: "Market Research Survey & Analysis (Qualtrics)",
    desc: "42 questions, 87 responses. Demographics, preferences, claims testing.",
  },
  {
    title: "Focus Group – Guide & Debrief",
    desc: "Leaders + realtors. Insights on aesthetics, resale, financing.",
  },
  {
    title: "Buyer Personas (3) & Targeting Matrix",
    desc: "Profiles mapped to AMI bands, budget, motivators, objections.",
  },
  {
    title: "Financial Model – SFH P&L & Capex Feasibility",
    desc: "Cost stack, unit economics, capex ROI, sensitivity scenarios.",
  },
  {
    title: "Final Strategy Deck",
    desc: "SFH-first, Habitat partnership, language & education.",
  },
];

const COLORS = ["#0ea5e9", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

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

export default function IntrepidBuildPage() {
  const { tab, TabButton } = useTabs("overview");

  return (
    <PageShell>
      {/* Header / Hero */}
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
                STAR Consulting Project — Intrepid Build
              </h1>
              <p className="text-slate-700 mt-3 mx-auto md:mx-0 max-w-2xl md:max-w-3xl leading-relaxed">
                Affordable housing strategy for Chatham County, NC. I led market
                research design, data analysis, and financial modeling to
                de-risk go-to-market and capital decisions for modular
                steel-framed homes.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-end">
              <span className="inline-flex items-center rounded-full px-2.5 py-1 text-md font-medium bg-slate-900 text-white">
                Consulting
              </span>
              <span className="inline-flex items-center rounded-full px-2.5 py-1 text-md font-medium bg-slate-300 text-slate-700">
                Data Analytics
              </span>
              <span className="inline-flex items-center rounded-full px-2.5 py-1 text-md font-medium border border-slate-500 text-slate-700">
                Business Analysis
              </span>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { kpi: "$6M", label: "5-yr revenue vision" },
              { kpi: "20%", label: "Target unit margin (Habitat)" },
              { kpi: "70 units", label: "Factory breakeven (5 yrs)" },
              { kpi: "87", label: "Survey responses analyzed" },
            ].map((x, i) => (
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
          <TabButton value="research">Research</TabButton>
          <TabButton value="analysis">Analysis</TabButton>
          <TabButton value="recs">Recs</TabButton>
          <TabButton value="impact">Impact</TabButton>
          <TabButton value="skills">Skills &amp; Tools</TabButton>
        </div>
      </div>

      {/* CONTENT */}
      {tab === "overview" && (
        <div className="page-center mt-8 grid md:grid-cols-2 gap-8">
          {/* ... content unchanged, just wrapped in page-center for centering ... */}
          <Card>
            <CardHeader
              title="Challenge"
              icon={<Target className="h-5 w-5" />}
            />
            <CardBody>
              <ul className="list-disc pl-5 space-y-2.5 text-[15px] leading-relaxed text-slate-800">
                <li>
                  Housing gap of affordable units; 78% of sales above $400k.
                </li>
                <li>
                  Low familiarity with steel-framed homes; stigma around
                  “affordable.”
                </li>
                <li>
                  Client considering a $5.8M factory without proven demand.
                </li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Role" icon={<Sparkles className="h-5 w-5" />} />
            <CardBody>
              <ul className="list-disc pl-5 space-y-2.5 text-[15px] leading-relaxed text-slate-800">
                <li>
                  Designed Qualtrics survey (42 Qs) &amp; focus group; built
                  data pipeline.
                </li>
                <li>
                  Performed segmentation, ranking analysis, and message testing.
                </li>
                <li>
                  Built SFH P&amp;L, breakeven &amp; sensitivity models to guide
                  capex.
                </li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Personas" icon={<Users className="h-5 w-5" />} />
            <CardBody className="grid gap-3 text-[15px] leading-relaxed text-slate-800">
              {personaCards.map((p) => (
                <div key={p.title} className="p-4 rounded-xl border bg-white">
                  <div className="font-medium text-slate-900 mb-1.5">
                    {p.title}
                  </div>
                  <ul className="list-disc pl-5 space-y-1.5">
                    {p.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Familiarity"
              icon={<BarChartIcon className="h-5 w-5" />}
            />
            <CardBody>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      dataKey="value"
                      data={familiarityData}
                      innerRadius={45}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {familiarityData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-[13px] text-slate-600 mt-2">
                Steel-framed home familiarity in survey respondents.
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Preference"
              icon={<LineChart className="h-5 w-5" />}
            />
            <CardBody>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={housingTypePrefProject}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value">
                      {housingTypePrefProject.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-[13px] text-slate-600 mt-2">
                Project survey: Single-family most preferred (62%).
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {tab === "research" && (
        <div className="page-center mt-8 grid lg:grid-cols-3 gap-8">
          {/* ... unchanged content wrapped in page-center ... */}
          <Card className="lg:col-span-2">
            <CardHeader title="Study Design" />
            <CardBody className="space-y-5 text-[15px] leading-relaxed text-slate-800">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="p-4 rounded-xl border">
                  <div className="font-medium">Survey Architecture</div>
                  <ul className="list-disc pl-5 mt-2 space-y-1.5">
                    <li>
                      42 questions across Demographics, Preferences, Awareness,
                      Claims.
                    </li>
                    <li>
                      Likert, drag-rank, multi-select; attention checks &amp;
                      definitions upfront.
                    </li>
                    <li>
                      Sampling plan: community channels + partners; ~68%
                      external.
                    </li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl border">
                  <div className="font-medium">Focus Group</div>
                  <ul className="list-disc pl-5 mt-2 space-y-1.5">
                    <li>6 participants: mayor, realtor, residents, staff.</li>
                    <li>
                      Themes: aesthetics, resale value, financing/insurance,
                      codes.
                    </li>
                    <li>
                      Outcome: need for model home &amp; education to address
                      stigma.
                    </li>
                  </ul>
                </div>
              </div>

              <hr className="border-slate-200" />

              <div className="font-medium">
                Top Decision Factors (Weighted Ranking)
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topDecisionFactors}>
                    <XAxis dataKey="factor" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="score">
                      {topDecisionFactors.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-[13px] text-slate-600">
                Method: normalized ranks → weighted index (0–100).
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Message Testing (A/B)" />
            <CardBody className="space-y-2.5 text-[15px] leading-relaxed text-slate-800">
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Compared descriptors: “affordable” vs “attainable.”</li>
                <li>
                  “Attainable” increased positive sentiment &amp; click-intent.
                </li>
                <li>
                  Resonant value props: durability, energy efficiency, design
                  flexibility.
                </li>
              </ul>
              <div className="mt-4 p-3 rounded-xl bg-slate-100">
                Proposed name:{" "}
                <span className="font-semibold">
                  High-End Steel-Framed Attainable Housing
                </span>{" "}
                — Flexible Design. Value Driven. Effective Construction.
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {tab === "analysis" && (
        <div className="page-center mt-8 grid md:grid-cols-2 gap-8">
          {/* ... unchanged content wrapped in page-center ... */}
          <Card>
            <CardHeader title="Segmentation & Personas" />
            <CardBody>
              <ul className="list-disc pl-5 space-y-2.5 text-[15px] leading-relaxed text-slate-800">
                <li>
                  Cross-tabs by AMI bands (80–120%), WTP, and housing type.
                </li>
                <li>
                  Persona-aligned specs: 1,500–2,000 sq ft; 2–3 BR; flexible
                  layouts.
                </li>
                <li>Education-focused messaging for unfamiliar segments.</li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Competitive Benchmarks" />
            <CardBody>
              <ul className="list-disc pl-5 space-y-2.5 text-[15px] leading-relaxed text-slate-800">
                <li>
                  Local NC modular builders: variety of plans, strong education
                  content.
                </li>
                <li>
                  Greystar: factory play; emphasizes speed, sustainability,
                  attainable price.
                </li>
                <li>
                  Client differentiator:{" "}
                  <span className="font-medium">steel value prop</span> + cost
                  transparency.
                </li>
              </ul>
            </CardBody>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader title="Financial Modeling Highlights" />
            <CardBody className="grid md:grid-cols-3 gap-5 text-[15px] leading-relaxed text-slate-800">
              {[
                { k: "Unit Econ (SFH)", v: "Target $150k build → ~20% margin" },
                { k: "Capex Breakeven", v: "~70 units / 5 yrs (factory)" },
                { k: "Risk", v: "Unproven demand; defer factory; pilot first" },
              ].map((x, i) => (
                <div key={i} className="p-4 rounded-xl border">
                  <div className="font-medium">{x.k}</div>
                  <div className="text-slate-600">{x.v}</div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      )}

      {tab === "recs" && (
        <div className="page-center mt-8 grid md:grid-cols-2 gap-8">
          {/* ... unchanged content wrapped in page-center ... */}
          <Card>
            <CardHeader title="Go-to-Market" />
            <CardBody>
              <ul className="list-disc pl-5 space-y-2.5 text-[15px] leading-relaxed text-slate-800">
                <li>
                  Launch with SFH: 1,520 sq ft, 2–3 BR; flexible design SKUs.
                </li>
                <li>
                  Lead with “attainable” language; avoid “container/modular.”
                </li>
                <li>
                  Build a model home; create myth-busting education assets.
                </li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Partnerships & Channel" />
            <CardBody>
              <ul className="list-disc pl-5 space-y-2.5 text-[15px] leading-relaxed text-slate-800">
                <li>
                  Partner with Habitat for Humanity to lower cost &amp; expand
                  reach.
                </li>
                <li>
                  Work with insurers &amp; lenders to standardize underwriting
                  for steel.
                </li>
                <li>
                  Explore corporate workforce housing (e.g., OEMs entering
                  county).
                </li>
              </ul>
            </CardBody>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader title="Execution Plan (This Year)" />
            <CardBody className="grid md:grid-cols-4 gap-5 text-[15px] leading-relaxed">
              {[
                "Finalize SFH blueprint",
                "Complete BOM & cost validation",
                "Host community focus sessions",
                "Publish education microsite",
              ].map((task, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border flex items-start gap-2 text-slate-800"
                >
                  <CheckCircle className="h-4 w-4 mt-0.5" />
                  <span>{task}</span>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      )}

      {tab === "impact" && (
        <div className="page-center">
          <div className="mt-8 grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader title="Business Outcomes" />
              <CardBody>
                <ul className="list-disc pl-5 space-y-2.5 text-[15px] leading-relaxed text-slate-800">
                  <li>
                    Shifted strategy from capex to validation via pilot builds.
                  </li>
                  <li>Persona-driven messaging adopted for outreach.</li>
                  <li>Cost roadmap to $150k/unit with partner leverage.</li>
                </ul>
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Community Impact" />
              <CardBody>
                <ul className="list-disc pl-5 space-y-2.5 text-[15px] leading-relaxed text-slate-800">
                  <li>
                    Addresses “Missing Middle” (80–120% AMI) homeownership gap.
                  </li>
                  <li>
                    Education plan to reduce stigma &amp; increase adoption.
                  </li>
                </ul>
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Metrics to Watch" />
              <CardBody>
                <ul className="list-disc pl-5 space-y-2.5 text-[15px] leading-relaxed text-slate-800">
                  <li>
                    Lead → tour → application conversion; insurer approvals.
                  </li>
                  <li>
                    Cost delta to $150k target; cycle time from order to
                    handover.
                  </li>
                </ul>
              </CardBody>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <Card>
              <CardHeader title="Compare: Project vs US Preference" />
              <CardBody>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={housingTypePrefUS}>
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="value">
                        {housingTypePrefUS.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-[13px] text-slate-600 mt-2">
                  US baseline vs. local project survey → validates SFH-first.
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Callouts" />
              <CardBody className="space-y-2.5 text-[15px] leading-relaxed">
                <div className="p-3 rounded-xl bg-slate-100">
                  Model home + myth-busting assets are catalytic for adoption.
                </div>
                <div className="p-3 rounded-xl bg-slate-100">
                  Language shift to “attainable” improves sentiment and CTR.
                </div>
                <div className="p-3 rounded-xl bg-slate-100">
                  Steel’s insurance advantage strengthens the value story.
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {tab === "skills" && (
        <div className="page-center">
          <div className="mt-8 grid md:grid-cols-3 gap-8">
            {Object.entries(skills).map(([k, v]) => (
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

          <Card className="mt-8">
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <FileText className="h-5 w-5" /> Featured Deliverables
                </span>
              }
            />
            <CardBody className="grid md:grid-cols-2 gap-5 text-[15px] leading-relaxed text-slate-800">
              {deliverables.map((d, i) => (
                <div key={i} className="p-4 rounded-xl border">
                  <div className="font-medium">{d.title}</div>
                  <div className="text-slate-600">{d.desc}</div>
                </div>
              ))}
              <div className="md:col-span-2">
                <div className="p-4 rounded-xl bg-slate-100 text-[13px]">
                  Tip: Link these cards to your public files (survey PDF, focus
                  group deck, strategy deck, P&amp;L workbook) when deployed.
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
      {/* Presentation Slides */}
      <section className="page-center mt-12" id="slides">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Presentation Slides
          </h2>
          <div className="flex gap-2">
            <a
              href="/Intrepid_Star_Final.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-xl px-3 py-2 text-sm font-medium border border-slate-300 text-slate-800 hover:bg-slate-50"
            >
              Open in new tab
            </a>
            {/* no download attribute → no auto-download */}
          </div>
        </div>

        {/* Inline PDF viewer (no auto-download) */}
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <iframe
            title="Intrepid Build — Final Slides"
            src="/Intrepid_Star_Final.pdf#view=FitH"
            className="w-full h-[75vh]"
          />
        </div>
        <p className="text-[13px] text-slate-600 mt-2">
          If your browser blocks embedded PDFs, use “Open in new tab.”
        </p>
      </section>
      {/* CTA */}
      <div className="page-center mt-12 flex flex-wrap items-center justify-between gap-3">
        <div className="text-[15px] text-slate-700 leading-relaxed">
          Want more details? I can share anonymized data tables and code
          snippets (pandas cleaning, weighting functions) on request.
        </div>
        <div className="flex gap-2">
          <a
            href="#contact"
            className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800"
          >
            Get in touch
          </a>
          <a
            href="#projects"
            className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium border border-slate-300 text-slate-800 hover:bg-slate-50"
          >
            See more projects
          </a>
        </div>
      </div>
    </PageShell>
  );
}
