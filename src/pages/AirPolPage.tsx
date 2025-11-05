import React from "react";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import NavBar from "@/components/NavBar";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  BarChart,
  Bar,
  LabelList,
} from "recharts";

// Import actual data from analysis
import monthlyData from "@/data/monthly_pm25.json";
import hourlyData from "@/data/hourly_variation.json";
import seasonalDataRaw from "@/data/seasonal_pm25.json";
import forecastDataRaw from "@/data/forecast_7day.json";
import forecastMeta from "@/data/forecast_7day_meta.json";

// KPI data (updated based on actual data: mean 21 µg/m³, 53.5% over WHO limit)
const kpi = [
  {
    label: "WHO Limit Exceeded",
    value: "2.1×",
    sub: "average PM2.5",
    icon: "⚠️",
  },
  { label: "Over Limit", value: "53.5%", sub: "of the time", icon: "⏰" },
  {
    label: "Population Affected",
    value: "1M+",
    sub: "Bishkek residents",
    icon: "👥",
  },
];

// Chart helpers
const chartMargin = { top: 24, right: 28, bottom: 44, left: 28 };
const axisTick = { fontSize: 12 } as const;
const legendStyle = { fontSize: 12 } as const;

// Use actual data from analysis
const dailyPM25Data = monthlyData;
const hourlyVariation = hourlyData;
const seasonalData = seasonalDataRaw;
// Align forecast labels to local calendar dates using meta week_start/end.
// Some datasets encode only day-of-week; we reconstruct YYYY-MM-DD labels that
// match the first entry's day name to avoid UTC/local mismatches on the chart.
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function addDaysISO(isoDate: string, days: number): string {
  // Avoid timezone issues by operating on date parts and returning an ISO date string
  const [y, m, d] = isoDate.split("-").map(Number);
  // Create UTC date to prevent local TZ shifts
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

function formatLabel(isoDate: string): string {
  // Render short, locale-neutral label like "Jan 16"
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${monthNames[dt.getUTCMonth()]} ${String(dt.getUTCDate()).padStart(
    2,
    "0"
  )}`;
}

function dayNameFromISO(isoDate: string): (typeof dayNames)[number] {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dayNames[dt.getUTCDay()];
}

// Build aligned labels: shift week_start forward until its weekday matches the
// first element's day field, then emit 7 consecutive dates as labels.
let forecastData = forecastDataRaw as Array<{
  day: string;
  actual: number;
  predicted: number;
  label?: string;
  date?: string;
}>;
try {
  const metaStart = forecastMeta?.week_start as string | undefined;
  if (metaStart && Array.isArray(forecastData) && forecastData.length === 7) {
    const firstDayName = (forecastData[0]?.day || "").slice(
      0,
      3
    ) as (typeof dayNames)[number];
    // Compute offset from metaStart to firstDayName (0..6)
    let offset = 0;
    if (firstDayName && dayNames.includes(firstDayName as any)) {
      const startName = dayNameFromISO(metaStart);
      const startIdx = dayNames.indexOf(startName);
      const firstIdx = dayNames.indexOf(firstDayName);
      offset = (firstIdx - startIdx + 7) % 7;
    }

    const labels: string[] = [];
    for (let i = 0; i < 7; i++) {
      labels.push(addDaysISO(metaStart, offset + i));
    }

    // Attach stable date/label per row to ensure predicted and actual share the same x
    forecastData = forecastData.map((row, i) => ({
      ...row,
      date: labels[i],
      label: formatLabel(labels[i]),
    }));
  } else {
    // Fallback: keep existing day labels
    forecastData = forecastData.map((row) => ({ ...row, label: row.day }));
  }
} catch {
  // On any unexpected meta/parse issues, fall back to existing day label
  forecastData = forecastData.map((row) => ({ ...row, label: row.day }));
}

// Sources of pollution (based on research)
const pollutionSources = [
  { source: "Heating (Coal)", pct: 42 },
  { source: "Traffic", pct: 28 },
  { source: "Industry", pct: 18 },
  { source: "Other", pct: 12 },
];

export default function AirPolPage() {
  return (
    <PageShell>
      {/* Nav */}
      <div className="page-center page-center-tight">
        <NavBar />
      </div>

      {/* Hero Image */}
      <section className="mt-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="page-center"
        >
          <div className="relative overflow-hidden rounded-2xl ring-1 ring-slate-200 shadow-md">
            {/* If the photo isn't present at /airpol-hero.jpg, fall back to the SVG */}
            <img
              src="/airpol-hero.jpg"
              alt="Winter smog layer over Bishkek beneath the Tian Shan mountains"
              className="w-full h-[240px] md:h-[660px] object-cover"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                if (img.src.endsWith("/airpol-hero.jpg"))
                  img.src = "/airpol.svg";
              }}
            />
          </div>
        </motion.div>
      </section>

      {/* Hero */}
      <section className="mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl bg-gradient-to-br from-slate-50 to-white shadow-lg ring-1 ring-slate-200 p-8 md:p-14"
        >
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight text-center">
            Bishkek Under the Dome: Data Behind the Smog
          </h1>

          {/* Intro text */}
          <div className="mt-10">
            <div className="max-w-4xl mx-auto">
              <p className="text-slate-700 text-lg md:text-xl leading-8">
                Every winter morning in Bishkek, residents wake up to a gray
                blanket of smog that obscures the Tian Shan mountains. Analyzing
                nearly 40,000 hours of air quality data from PurpleAir sensors
                (2020-2025), this project reveals that{" "}
                <strong>
                  Bishkek exceeds WHO safe limits 53.5% of the time
                </strong>
                , with winter months averaging{" "}
                <strong>4× the safe limit</strong>. Using advanced analytics, I
                uncover the patterns behind Bishkek's air crisis and offer
                data-driven insights for protection and policy.
              </p>

              {/* Smoking equivalence */}
              <p className="mt-4 text-slate-700 text-lg md:text-xl leading-8">
                To put the numbers in human terms, the citywide mean of about
                <strong> 21 µg/m³</strong> PM2.5 is roughly equivalent to
                smoking
                <strong> ~1 cigarette per day</strong>, based on the Berkeley
                Earth conversion (≈22 µg/m³ ≈ 1 cigarette/day).
                <a
                  className="text-sky-700 underline ml-2"
                  href="https://berkeleyearth.org/archive/air-pollution-and-cigarettes/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Source
                </a>
              </p>

              {/* Quote */}
              <blockquote className="mt-8 pl-6 border-l-4 border-sky-500 italic text-slate-600 text-lg">
                "In winter, you can taste the coal in the air. We keep windows
                shut all day, but the smog still seeps in."
                <footer className="mt-2 text-sm text-slate-500 not-italic">
                  — Bishkek resident, winter 2024
                </footer>
              </blockquote>

              {/* Buttons */}
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <a
                  href="https://github.com/e1daru/e1daru.github.io"
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
          </div>

          {/* KPIs */}
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

      {/* The Data Speaks */}
      <section className="page-center mt-16 grid gap-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="h-96">
            <h3 className="text-center font-semibold mb-4">
              Monthly PM2.5 Levels with WHO Safe Limit
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyPM25Data} margin={chartMargin}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={axisTick} />
                <YAxis
                  tick={axisTick}
                  label={{
                    value: "PM2.5 (µg/m³)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend wrapperStyle={legendStyle} />
                <ReferenceLine
                  y={10}
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                  label={{
                    value: "WHO Limit (10 µg/m³)",
                    position: "right",
                    fill: "#ef4444",
                    fontSize: 11,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="pm25"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  name="PM2.5 Level"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              The Data Speaks
            </h2>
            <p className="mt-3 text-slate-700 text-lg">
              Using PurpleAir sensors and local monitoring stations, I tracked
              PM2.5 concentrations across Bishkek from 2020-2025. The data
              reveals a clear pattern:{" "}
              <strong>
                winter months (December-February) average 43.5 µg/m³—over 4× the
                WHO safe limit
              </strong>
              , with January peaking at 51.1 µg/m³, while summer drops to a
              healthy 9.2 µg/m³.
            </p>
            <p className="mt-3 text-slate-700 text-lg">
              This seasonal swing isn't random—it's driven by coal heating in
              poorly-ventilated homes, temperature inversions that trap
              pollution near ground level, and stagnant winter air. The red line
              shows WHO's safe limit of 10 µg/m³; during peak winter months,
              Bishkek consistently exceeds this by 4-5 times.
            </p>
            <p className="mt-3 text-slate-600 text-sm">
              Note: Hours and dates are shown in{" "}
              <strong>local time (Asia/Bishkek, UTC+6)</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* When the Air Turns Dangerous */}
      <section className="page-center mt-16 grid gap-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              When the Air Turns Dangerous
            </h2>
            <p className="mt-3 text-slate-700 text-lg">
              The all-year average shows a clear diurnal cycle: pollution is
              <strong>
                {" "}
                lowest in late morning (around 9–11 AM at ~12–13 µg/m³)
              </strong>
              and{" "}
              <strong>
                highest in the late evening (around 10–11 PM at ~32 µg/m³)
              </strong>
              . This reflects a combination of evening heating, traffic, and
              weak dispersion.
            </p>
            <p className="mt-3 text-slate-700 text-lg">
              Unlike many cities where <em>morning rush hour</em> dominates PM
              peaks, Bishkek’s worst hours arrive late in the day. Planning
              exercise and school commutes in the cleaner{" "}
              <strong>morning window</strong> and limiting exposure in the
              <strong> late evening</strong> can meaningfully reduce dose.
            </p>
          </div>
          <div className="h-96">
            <h3 className="text-center font-semibold mb-4">
              Diurnal Cycle: Hourly PM2.5 Variation
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyVariation} margin={chartMargin}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={axisTick} />
                <YAxis
                  tick={axisTick}
                  label={{
                    value: "PM2.5 (µg/m³)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend wrapperStyle={legendStyle} />
                <Line
                  type="monotone"
                  dataKey="pm25"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  name="PM2.5 Level"
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Seasonal Comparison */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="h-80">
            <h3 className="text-center font-semibold mb-4">
              Seasonal PM2.5 Averages
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={seasonalData} margin={chartMargin}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="season" tick={axisTick} />
                <YAxis
                  tick={axisTick}
                  label={{
                    value: "PM2.5 (µg/m³)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend wrapperStyle={legendStyle} />
                <Bar dataKey="pm25" fill="#8b5cf6" radius={[6, 6, 0, 0]}>
                  <LabelList
                    dataKey="pm25"
                    position="top"
                    formatter={(label: React.ReactNode) => `${label} µg/m³`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              The Seasonal Crisis
            </h2>
            <p className="mt-3 text-slate-700 text-lg">
              The data shows a dramatic 5× seasonal variation: winter pollution
              averages
              <strong>43.5 µg/m³ (Unhealthy for Sensitive Groups)</strong>,
              while summer drops to a healthy <strong>9.2 µg/m³ (Good)</strong>.
              This reflects the city's heavy dependence on coal heating—when
              temperatures drop, thousands of homes and businesses burn coal and
              wood, releasing massive amounts of particulate matter.
            </p>
            <p className="mt-3 text-slate-700 text-lg">
              Fall (19.2 µg/m³) and Spring (13.2 µg/m³) serve as transition
              periods, with fall showing pollution climbing as heating season
              begins, and spring bringing relief as heating tapers off. This
              clear seasonal pattern has major implications for health
              interventions and policy timing—winters demand aggressive action.
            </p>
          </div>
        </div>
      </section>

      {/* Sources of the Smog */}
      <section className="page-center mt-16 grid gap-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Sources of the Smog
            </h2>
            <p className="mt-3 text-slate-700 text-lg">
              According to research from the World Bank and local environmental
              agencies,
              <strong>
                {" "}
                residential heating accounts for ~42% of Bishkek's pollution
              </strong>
              , with coal-burning stoves in homes and small boiler houses being
              the primary culprits. Vehicle emissions contribute another 28%,
              particularly from older diesel vehicles and poorly maintained
              engines.
            </p>
            <p className="mt-3 text-slate-700 text-lg">
              Industrial sources (18%) include the city's aging thermal power
              plants and manufacturing facilities. The remaining 12% comes from
              construction dust, agricultural burning, and other sources.
              Addressing the heating sector—through cleaner fuel transitions,
              building insulation, and district heating modernization—offers the
              biggest potential impact.
            </p>
            <p className="mt-4 text-sm text-slate-600">
              <strong>Sources:</strong> World Bank Kyrgyzstan Air Quality Report
              (2021), UNEP Bishkek Pollution Study (2019)
            </p>
          </div>
          <div className="h-80">
            <h3 className="text-center font-semibold mb-4">
              Pollution Source Breakdown
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pollutionSources} margin={chartMargin}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" tick={axisTick} />
                <YAxis
                  tick={axisTick}
                  label={{
                    value: "Contribution (%)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend wrapperStyle={legendStyle} />
                <Bar dataKey="pct" fill="#22c55e" radius={[6, 6, 0, 0]}>
                  <LabelList
                    dataKey="pct"
                    position="top"
                    formatter={(label: React.ReactNode) => `${label}%`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Predicting the Next Smog Event */}
      <section className="page-center mt-16 grid gap-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="h-96">
            <h3 className="text-center font-semibold mb-4">
              {forecastMeta.title}
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData} margin={chartMargin}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={axisTick} />
                <YAxis
                  tick={axisTick}
                  label={{
                    value: "PM2.5 (µg/m³)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend wrapperStyle={legendStyle} />
                <ReferenceLine
                  y={10}
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                  label={{
                    value: "WHO Limit (10 µg/m³)",
                    position: "right",
                    fill: "#ef4444",
                    fontSize: 11,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  name="Actual PM2.5"
                  dot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Predicted PM2.5"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Predicting the Next Smog Event
            </h2>
            <p className="mt-3 text-slate-700 text-lg">
              The chart reveals the severity of Bishkek's worst winter week on
              record (January 16–22, 2023), when PM2.5 levels averaged{" "}
              <strong>
                {forecastMeta.avg_pm25} µg/m³—over 15× the WHO safe limit
              </strong>
              . On {forecastMeta.peak_day}, pollution spiked to a catastrophic{" "}
              <strong>{forecastMeta.peak_pm25} µg/m³</strong>, equivalent to
              breathing the air of{" "}
              <strong>~12 cigarettes in a single day</strong>. This is not a
              dystopian future scenario—this actually happened.
            </p>
            <p className="mt-3 text-slate-700 text-lg">
              Using historical patterns, weather data, and time-series analysis,
              predictive models can forecast such pollution spikes several days
              ahead. An early warning system powered by these predictions could
              help <strong>vulnerable populations</strong> (children, elderly,
              those with respiratory conditions) avoid outdoor exposure, allow
              schools to cancel recess or close entirely, enable hospitals to
              prepare for respiratory admissions, and give health officials time
              to issue emergency alerts before severe episodes hit.
            </p>
          </div>
        </div>
      </section>

      {/* Health & Economic Impact */}
      <section className="page-center mt-16 grid gap-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Health & Economic Impact
            </h2>
            <p className="mt-3 text-slate-700 text-lg">
              Research links elevated PM2.5 to increased respiratory infections,
              cardiovascular disease, and premature mortality. A 2019 study
              estimated that{" "}
              <strong>
                air pollution contributes to over 1,500 premature deaths
                annually in Kyrgyzstan
              </strong>
              , with Bishkek bearing a disproportionate burden.
            </p>
            <p className="mt-3 text-slate-700 text-lg">
              Children and elderly are most vulnerable. Hospital admissions for
              respiratory issues spike in winter months, straining the
              healthcare system. The economic cost—including lost productivity,
              healthcare expenses, and reduced quality of life—is estimated at{" "}
              <strong>$200-300 million annually</strong> for Kyrgyzstan.
            </p>
            <p className="mt-4 text-sm text-slate-600">
              <strong>Sources:</strong> WHO Ambient Air Pollution Database,
              Lancet Commission on Pollution and Health (2020)
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-red-50 to-white p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              By the Numbers
            </h3>
            <div className="space-y-5">
              <div>
                <div className="text-3xl font-bold text-red-600">1,500+</div>
                <div className="text-sm text-slate-600">
                  Premature deaths annually
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">$200-300M</div>
                <div className="text-sm text-slate-600">
                  Annual economic cost
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">3-5×</div>
                <div className="text-sm text-slate-600">
                  Higher respiratory illness rates in winter
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hope in the Haze */}
      <section className="page-center mt-16 grid gap-12">
        <div className="rounded-2xl bg-gradient-to-br from-green-50 to-white border border-green-100 p-8 md:p-12 shadow-sm">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">
            Hope in the Haze
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Policy-Level Solutions
              </h3>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">•</span>
                  <span>
                    <strong>Transition to clean heating:</strong> Subsidize
                    electric heating, natural gas expansion, and modern district
                    heating systems
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">•</span>
                  <span>
                    <strong>Vehicle emission standards:</strong> Enforce Euro
                    5/6 standards and promote electric public transport
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">•</span>
                  <span>
                    <strong>Building insulation programs:</strong> Reduce
                    heating demand through retrofits
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">•</span>
                  <span>
                    <strong>Real-time monitoring network:</strong> Expand air
                    quality sensors and public alerts
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Individual Actions
              </h3>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>
                    <strong>Indoor air filtration:</strong> Use HEPA filters at
                    home, especially in children's bedrooms
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>
                    <strong>Time outdoor activities:</strong> Avoid early
                    morning and evening peaks; check air quality forecasts
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>
                    <strong>N95 masks during high pollution:</strong> Protect
                    vulnerable family members
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-sky-600 font-bold">•</span>
                  <span>
                    <strong>Support clean energy:</strong> Advocate for policy
                    change and choose cleaner alternatives when possible
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-lg italic text-slate-700 max-w-2xl mx-auto">
              "Data can't clean the air—but it can clear our minds."
            </p>
            <p className="mt-4 text-slate-600">
              Armed with insights, communities can demand action, families can
              protect themselves, and policymakers can prioritize evidence-based
              interventions.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="page-center mt-20 mb-24">
        <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-white border border-sky-100 p-8 shadow-sm text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            📊 Explore the Analysis
          </h2>
          <p className="mt-4 text-lg text-slate-700 max-w-3xl mx-auto">
            This project combines environmental science, time-series
            forecasting, and public health analytics to shine a light on
            Bishkek's air crisis. Dive into the full analysis to see the data
            pipeline, modeling approach, and detailed findings.
          </p>
          <div className="mt-6 flex justify-center gap-4 flex-wrap">
            <a
              href="https://github.com/e1daru/e1daru.github.io/tree/main/public/AirPol/first_analysis.ipynb"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border-2 border-sky-400 px-5 py-2 text-sky-700 hover:bg-sky-50 font-semibold shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 transition"
            >
              View Analysis Notebook
            </a>
            <a
              href="/"
              className="rounded-xl border-2 border-slate-300 px-5 py-2 text-slate-700 hover:bg-slate-50 font-semibold shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 transition"
            >
              Back to Portfolio
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
