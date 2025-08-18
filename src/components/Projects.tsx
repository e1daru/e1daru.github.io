import ProjectCard from "./ProjectCard";
import type { Project } from "@/types";

type Props = { projects?: Project[] };

export default function Projects({ projects = [] }: Props) {
  return (
    <>
      <h2>Featured Projects</h2>
      <div className="project-grid">
        {projects.map((p, idx) => (
          <ProjectCard key={idx} {...p} />
        ))}
      </div>
    </>
  );
}
