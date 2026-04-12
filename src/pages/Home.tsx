import Layout from "@/components/Layout";
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import SectionHeading from "@/components/SectionHeading";
import TechTag from "@/components/TechTag";
import FadeIn from "@/components/FadeIn";
import Footer from "@/components/Footer";
import type { Project } from "@/types";

const skills = [
  "Python",
  "TypeScript",
  "React",
  "Next.js",
  "FastAPI",
  "Node.js",
  "PostgreSQL",
  "SQL",
  "Pandas",
  "Scikit-learn",
  "Docker",
  "Git",
];

export default function Home({ projects }: { projects: Project[] }) {
  return (
    <Layout>
      <NavBar />

      <Hero />

      {/* About */}
      <section id="about" className="py-20 md:py-28">
        <div className="page-center">
          <SectionHeading number="01." title="About Me" />

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 items-start">
            <FadeIn>
              <div className="space-y-4 text-zinc-400 text-base leading-relaxed">
                <p>
                  I'm a dual-degree student at{" "}
                  <span className="text-zinc-200">UNC Chapel Hill</span>{" "}
                  studying Business Administration and Computer Science. I
                  believe data and technology should empower people to solve
                  meaningful problems and create lasting impact.
                </p>
                <p>
                  By combining analytics, software engineering, and leadership,
                  I bridge the gap between ideas and execution — building
                  data-driven solutions, crafting software products, leading
                  teams at national events, advising on multi-million-dollar
                  projects, and co-founding initiatives that bring people
                  together.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="mx-auto md:mx-0">
                <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-lg overflow-hidden border-2 border-zinc-800 group">
                  <img
                    src="/Utiushev_Eldar_Photo.jpg"
                    alt="Eldar Utiushev"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-cyan-400/10 group-hover:bg-transparent transition-colors duration-500" />
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Skills */}
          <FadeIn delay={0.2}>
            <div className="mt-10 flex flex-wrap gap-2">
              {skills.map((s) => (
                <TechTag key={s} label={s} />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Projects */}
      <Projects projects={projects} />

      {/* Contact */}
      <section id="contact" className="py-20 md:py-28">
        <div className="page-center text-center max-w-xl mx-auto">
          <SectionHeading number="03." title="Get In Touch" />
          <FadeIn>
            <p className="text-zinc-400 text-base leading-relaxed mb-8">
              I'm always open to new opportunities, interesting projects, and
              conversations about data, technology, and building things that
              matter. Feel free to reach out.
            </p>
            <a
              href="mailto:eldaru33@gmail.com"
              className="inline-block font-mono text-sm text-cyan-400 border border-cyan-400/40 rounded-lg px-8 py-3 hover:bg-cyan-400/10 transition-colors"
            >
              Say Hello
            </a>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </Layout>
  );
}
