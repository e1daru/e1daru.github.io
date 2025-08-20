import NavBar from "@/components/NavBar";
import Profile from "@/components/Profile";
import Projects from "@/components/Projects";
import PageShell from "@/components/PageShell";
import type { Project } from "@/types";

export default function Home({ projects }: { projects: Project[] }) {
  return (
    <PageShell>
      {/* Top nav */}
      <div id="profile" className="mx-auto w-full mb-20 page-center">
        <NavBar />
      </div>

      {/* Hero/Profile */}
      <section className="page-center">
        <Profile />
      </section>

      {/* Divider */}
      <div className="page-center">
        <hr className="mt-10 mb-8 border-slate-200" />
      </div>

      {/* Featured Projects */}
      <section id="projects" className="projects page-center mt-8 ">
        <Projects projects={projects} />
      </section>
    </PageShell>
  );
}
