import SectionHeading from "./SectionHeading";
import { FeaturedCard, GridCard } from "./ProjectCard";
import type { Project } from "@/types";

export default function Projects({ projects }: { projects: Project[] }) {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-20 md:py-28">
      <div className="page-center">
        <SectionHeading number="02." title="Projects" />

        {featured.map((p) => (
          <div key={p.title} className="mb-12">
            <FeaturedCard project={p} />
          </div>
        ))}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((p, i) => (
            <GridCard key={p.title} project={p} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}
