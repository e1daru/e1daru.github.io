import { Link } from "react-router-dom";
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
  Legend,
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

const jumpTo = (id: string) => (e: React.MouseEvent) => {
  e.preventDefault();

  const el = document.getElementById(id);
  if (!el) return;

  // account for sticky header height (TOC bar)
  const header = document.querySelector(
    'nav[aria-label="On this page"]'
  ) as HTMLElement | null;
  const headerH = header?.offsetHeight ?? 0;

  const rect = el.getBoundingClientRect();
  const scrollTop = window.scrollY;
  let targetY = rect.top + scrollTop - (window.innerHeight - rect.height) / 2;

  // nudge down so the sticky header doesn't overlap the center
  targetY = Math.max(0, targetY - headerH / 2);

  window.scrollTo({ top: targetY, behavior: "smooth" });

  // keep route intact, just record section in the URL
  try {
    const url = new URL(window.location.href);
    url.searchParams.set("section", id);
    window.history.replaceState(null, "", url.toString());
  } catch {}
};

const renderPieLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  name,
}: any) => {
  const RAD = Math.PI / 180;
  const r = outerRadius + 22; // place label outside the arc
  const x = cx + r * Math.cos(-midAngle * RAD);
  const y = cy + r * Math.sin(-midAngle * RAD);
  const pct = Math.round(percent * 100);

  // Big, bold text with a white halo (stroke) for contrast on any background
  return (
    <text
      x={x}
      y={y}
      textAnchor={x >= cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={16} // ← bigger
      fontWeight={700} // ← bolder
      fill="#0f172a" // ← slate-900 (high contrast)
      stroke="#ffffff" // ← white halo
      strokeWidth={4} // ← halo thickness
      paintOrder="stroke" // render stroke under fill
      strokeLinejoin="round"
    >
      {name} — {pct}%
    </text>
  );
};

// ---------- Page ----------
export default function IntrepidBuildPage() {
  const TOC = [
    { id: "overview", label: "Overview" },
    { id: "research", label: "Research" },
    { id: "analysis", label: "Analysis" },
    { id: "recs", label: "Recommendations" },
    { id: "impact", label: "Impact" },
    { id: "skills", label: "Skills & Tools" },
    { id: "slides", label: "Slides" },
  ];

  return (
    <PageShell>
      {/* Header / Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="page-center">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Analytics for the Missing Middle — Intrepid Build
              </h1>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ===== Project Story (inserted here, right after hero/KPIs) ===== */}
      <section id="story" className="page-center mt-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Project Story
        </h2>

        <div className="mt-6 space-y-6">
          {/* Hook — what this project achieved in one line */}
          <p className="text-slate-800 text-[26px] leading-relaxed">
            Turned messy housing data into decisive marketing analysis for
            Intrepid Build* construction company — informing affordable-home
            prototype design and cutting costs by 17% — as part of a plan to
            deliver attainable housing (~$6M revenue target) in Chatham County,
            NC.
          </p>

          {/* Plain-English bridge for readers with 0 context */}
          <p className="text-slate-700 text-[18px] leading-relaxed">
            * <span className="font-medium">Intrepid Build</span> is a small
            construction company exploring{" "}
            <span className="font-medium">
              steel-framed single-family homes (SFH)
            </span>{" "}
            for middle-income buyers. The county has a shortage of reasonably
            priced homes, so we used data to decide <em>what to build</em>,{" "}
            <em>for whom</em>, <em>at what price</em>, and{" "}
            <em>how to go to market</em> without taking on risky up-front
            factory costs.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Context */}
            <Card>
              <CardHeader
                title="Context — the problem we faced"
                icon={<Target className="h-5 w-5" />}
              />
              <CardBody className="pt-4 text-[20px] leading-relaxed text-slate-800">
                <p>
                  Local home prices outpaced incomes. Many essential workers
                  (teachers, nurses, plant employees) could not afford to buy.
                  The client considered steel-framed homes because they build
                  faster, are durable, and can be cost-efficient.
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-2.5">
                  <li>
                    <span className="font-medium">Goal:</span> design a product
                    and go-to-market that middle-income buyers can actually
                    afford.
                  </li>
                  <li>
                    <span className="font-medium">Constraint:</span> avoid a
                    premature, high-risk factory purchase (big up-front cost).
                  </li>
                </ul>
              </CardBody>
            </Card>

            {/* My Role */}
            <Card>
              <CardHeader
                title="My Role — what I owned"
                icon={<Sparkles className="h-5 w-5" />}
              />
              <CardBody className="pt-4 text-[20px] leading-relaxed text-slate-800">
                <ul className="list-disc pl-5 mt-3 space-y-3">
                  <li>
                    <span className="font-medium">
                      Group customers by data.
                    </span>{" "}
                    I cleaned and standardized the Qualtrics data in Python and
                    prepared features (one-hot encoding, scaling). I used
                    <span className="font-medium"> k-means clustering</span> to
                    find natural groups and chose the right number with elbow
                    and silhouette checks.
                  </li>
                  <li>
                    <span className="font-medium">
                      Show what each group can afford.
                    </span>{" "}
                    For each cluster, I mapped income to a monthly budget (~30%
                    of income using AMI). I set price bands and
                    willingness-to-pay ranges, then tied them to unit economics
                    so prices also work for the business.
                  </li>
                  <li>
                    <span className="font-medium">
                      Tie it to the 4Ps (marketing mix).
                    </span>
                    <span className="font-medium"> Product:</span> SFH size, key
                    features, and options.
                    <span className="font-medium"> Price:</span> persona-based
                    targets and practical corridors.
                    <span className="font-medium"> Place:</span> partner-led
                    channels (Habitat, lenders).
                    <span className="font-medium"> Promotion:</span> A/B tests
                    of “attainable” vs “affordable.”
                  </li>
                </ul>
              </CardBody>
            </Card>

            {/* Key Decisions */}
            <Card>
              <CardHeader
                title="Key Decisions — what the data said"
                icon={<Users className="h-5 w-5" />}
              />
              <CardBody className="pt-4 text-[20px] leading-relaxed text-slate-800">
                <ul className="list-disc pl-5 space-y-3">
                  <li>
                    <span className="font-medium">
                      Prioritize Single-Family Homes
                    </span>{" "}
                    (1,500–2,000 sq ft; 2–3 BR).
                    <div className="text-slate-600 text-[16px] mt-2">
                      Why: survey preference and budget fit were strongest for
                      SFH.
                    </div>
                  </li>
                  <li>
                    <span className="font-medium">Partner-led rollout</span>{" "}
                    (e.g., Habitat for Humanity) instead of buying a factory
                    now.
                    <div className="text-slate-600 text-[16px] mt-2">
                      Why: partners speed permitting/financing and reduce
                      up-front capital risk.
                    </div>
                  </li>
                  <li>
                    <span className="font-medium">
                      Refine the prototype &amp; cost targets
                    </span>{" "}
                    to hit affordability.
                    <div className="text-slate-600 text-[16px] mt-2">
                      How: value-engineering, bill-of-materials clarity, and
                      better vendor assumptions.
                    </div>
                  </li>
                </ul>
              </CardBody>
            </Card>
          </div>

          {/* Impact */}
          <Card>
            <CardHeader
              title="Impact — what changed because of this work"
              icon={<CheckCircle className="h-5 w-5" />}
            />
            <CardBody>
              <ul className="list-disc pl-5 space-y-3 text-[20px] leading-relaxed text-slate-800">
                <li>
                  <span className="font-medium">
                    ~17% prototype cost reduction
                  </span>{" "}
                  → clearer path to sustainable margins.
                  <div className="text-slate-600 text-[16px] mt-1">
                    We pinpointed design/cost drivers and removed waste without
                    hurting quality.
                  </div>
                </li>
                <li>
                  <span className="font-medium">
                    Roadmap for ~22 attainable homes by 2028 (~$6M revenue)
                  </span>
                  .
                  <div className="text-slate-600 text-[16px] mt-1">
                    A practical plan: product, price points, and a partner
                    channel to reach buyers.
                  </div>
                </li>
                <li>
                  <span className="font-medium">
                    De-risked a $5.8M factory decision
                  </span>{" "}
                  with demand and unit-economics proof.
                  <div className="text-slate-600 text-[16px] mt-1">
                    Recommendation: validate via partnerships first; revisit
                    factory when volume is proven.
                  </div>
                </li>
              </ul>
            </CardBody>
          </Card>

          {/* KPIs — clarified labels for non-experts */}
          <div className="mt-7 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                kpi: "$6M",
                label: "Planned revenue by 2028 (approx.)",
              },
              {
                kpi: "17%",
                label: "Prototype cost reduction from redesign",
              },
              {
                kpi: "70 units",
                label: "Estimated factory breakeven (5-year horizon)",
              },
              {
                kpi: "3 personas",
                label: "Buyer segments from survey + focus group",
              },
            ].map((x, i) => (
              <Card key={i}>
                <CardBody>
                  <div className="text-2xl font-semibold text-center md:text-left">
                    {x.kpi}
                  </div>
                  <div className="text-[20px] text-slate-600 mt-0.5 text-center md:text-left">
                    {x.label}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Plain-English definitions (optional but helpful) */}
          <details className="rounded-2xl border border-slate-200 bg-white/60 p-4">
            <summary className="cursor-pointer font-medium text-slate-900">
              What do these terms mean?
            </summary>
            <div className="mt-3 grid md:grid-cols-2 gap-4 text-[16px] leading-relaxed text-slate-700">
              <div>
                <p>
                  <span className="font-semibold">Attainable housing:</span>{" "}
                  Homes priced so middle-income households can realistically buy
                  (not luxury, not deeply subsidized).
                </p>
                <p className="mt-2">
                  <span className="font-semibold">
                    SFH (Single-Family Home):
                  </span>{" "}
                  A standalone house (typically 2–3 bedrooms here).
                </p>
                <p className="mt-2">
                  <span className="font-semibold">
                    AMI (Area Median Income):
                  </span>{" "}
                  The midpoint income for a region; we align payments so housing
                  costs ≈ 30% of income.
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">
                    P&amp;L / Unit economics:
                  </span>{" "}
                  A line-by-line view of costs (materials, labor, overhead) and
                  price to ensure profit per home.
                </p>
                <p className="mt-2">
                  <span className="font-semibold">
                    CapEx (Capital Expenditure):
                  </span>{" "}
                  Big up-front spend (like buying a factory). We chose to delay
                  this until demand is proven.
                </p>
                <p className="mt-2">
                  <span className="font-semibold">Persona:</span> A data-driven
                  profile of a typical buyer (budget, needs, motivations) to
                  guide product and messaging.
                </p>
              </div>
            </div>
          </details>
        </div>
      </section>

      {/* ===== Research ===== */}
      <section id="research" className="page-center mt-12">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Research
        </h2>
        <div className="mt-6 grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardHeader title="Study Design" />
            <CardBody className="space-y-5 text-[20px] leading-relaxed text-slate-800">
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
            <CardBody className="space-y-2.5 text-[20px] leading-relaxed text-slate-800">
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
      </section>

      {/* ===== Analysis ===== */}
      <section id="analysis" className="page-center mt-12">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Analysis
        </h2>
        <div className="mt-6 grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader title="Segmentation & Personas" />
            <CardBody>
              <ul className="list-disc pl-5 space-y-2.5 text-[20px] leading-relaxed text-slate-800">
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
              <ul className="list-disc pl-5 space-y-2.5 text-[20px] leading-relaxed text-slate-800">
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
            <CardBody className="grid md:grid-cols-3 gap-5 text-[20px] leading-relaxed text-slate-800">
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
      </section>

      {/* ===== Recommendations ===== */}
      <section id="recs" className="page-center mt-12">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Recommendations
        </h2>
        <div className="mt-6 grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader title="Go-to-Market" />
            <CardBody>
              <ul className="list-disc pl-5 space-y-2.5 text-[20px] leading-relaxed text-slate-800">
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
              <ul className="list-disc pl-5 space-y-2.5 text-[20px] leading-relaxed text-slate-800">
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
            <CardBody className="grid md:grid-cols-4 gap-5 text-[20px] leading-relaxed">
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
      </section>

      {/* ===== Impact ===== */}
      <section id="impact" className="page-center mt-12">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Impact
        </h2>
        <div className="mt-6 grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader title="Business Outcomes" />
            <CardBody>
              <ul className="list-disc pl-5 space-y-2.5 text-[20px] leading-relaxed text-slate-800">
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
              <ul className="list-disc pl-5 space-y-2.5 text-[20px] leading-relaxed text-slate-800">
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
              <ul className="list-disc pl-5 space-y-2.5 text-[20px] leading-relaxed text-slate-800">
                <li>
                  Lead → tour → application conversion; insurer approvals.
                </li>
                <li>
                  Cost delta to $150k target; cycle time from order to handover.
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
            <CardBody className="space-y-2.5 text-[20px] leading-relaxed">
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
      </section>

      {/* ===== Skills & Deliverables ===== */}
      <section id="skills" className="page-center mt-12">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Skills &amp; Tools
        </h2>
        <div className="mt-6 grid md:grid-cols-3 gap-8">
          {Object.entries(skills).map(([k, v]) => (
            <Card key={k}>
              <CardHeader title={k} />
              <CardBody className="text-[20px] leading-relaxed text-slate-800">
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
          <CardBody className="grid md:grid-cols-2 gap-5 text-[20px] leading-relaxed text-slate-800">
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
      </section>

      {/* ===== Slides ===== */}
      <section id="slides" className="page-center mt-12">
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
          </div>
        </div>

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
        <div className="text-[20px] text-slate-700 leading-relaxed">
          Want more details? I can share anonymized data tables and code
          snippets (pandas cleaning, weighting functions) on request.
        </div>
        <div className="flex gap-2">
          <Link
            to="/"
            className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800"
          >
            See My Other Projects :)
          </Link>

          <a
            href="#"
            onClick={jumpTo("overview")}
            className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium border border-slate-300 text-slate-800 hover:bg-slate-50"
          >
            Back to top
          </a>
        </div>
      </div>
    </PageShell>
  );
}
