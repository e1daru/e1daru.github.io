import { Link } from "react-router-dom";
import { ExternalLink, Github, FolderOpen, ArrowUpRight } from "lucide-react";
import TechTag from "./TechTag";
import FadeIn from "./FadeIn";
import type { Project } from "@/types";

function FeaturedCard({ project }: { project: Project }) {
  return (
    <FadeIn>
      <div className="group relative bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-cyan-400/30 transition-all duration-300">
        <div className="aspect-video overflow-hidden bg-gradient-to-br from-cyan-900/30 to-zinc-900">
          {project.img && (
            <img
              src={project.img}
              alt={project.alt ?? project.title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              loading="lazy"
            />
          )}
        </div>
        <div className="p-6 md:p-8">
          <p className="font-mono text-cyan-400 text-sm mb-2">Featured Project</p>
          <h3 className="font-mono text-xl md:text-2xl font-bold text-zinc-100 mb-3">
            {project.path && !project.external ? (
              <Link to={project.path} className="text-zinc-100 hover:text-cyan-400 transition-colors">
                {project.title}
              </Link>
            ) : (
              project.title
            )}
          </h3>
          <p className="text-zinc-400 text-base leading-relaxed mb-5 max-w-2xl">
            {project.desc}
          </p>
          {project.tags && (
            <div className="flex flex-wrap gap-2 mb-5">
              {project.tags.map((t) => (
                <TechTag key={t} label={t} />
              ))}
            </div>
          )}
          <div className="flex items-center gap-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 hover:text-cyan-400 transition-colors"
                aria-label="GitHub repo"
              >
                <Github size={20} />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 hover:text-cyan-400 transition-colors"
                aria-label="Live site"
              >
                <ExternalLink size={20} />
              </a>
            )}
            {project.path && !project.external && (
              <Link
                to={project.path}
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-mono flex items-center gap-1"
              >
                Read more <ArrowUpRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

function GridCard({ project, delay }: { project: Project; delay: number }) {
  const content = (
    <div className="group flex flex-col h-full bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <FolderOpen size={28} className="text-cyan-400" />
        <ArrowUpRight
          size={18}
          className="text-zinc-500 group-hover:text-cyan-400 transition-colors"
        />
      </div>
      <h3 className="font-mono text-base md:text-lg font-medium text-zinc-100 mb-2 group-hover:text-cyan-400 transition-colors leading-snug">
        {project.title}
      </h3>
      <p className="text-sm text-zinc-400 leading-relaxed mb-4 flex-1 line-clamp-3">
        {project.desc}
      </p>
      {project.tags && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-auto">
          {project.tags.slice(0, 4).map((t) => (
            <span key={t} className="text-xs font-mono text-zinc-500">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  if (project.external) {
    return (
      <FadeIn delay={delay}>
        <a href={project.path} target="_blank" rel="noreferrer">
          {content}
        </a>
      </FadeIn>
    );
  }

  return (
    <FadeIn delay={delay}>
      <Link to={project.path}>{content}</Link>
    </FadeIn>
  );
}

export { FeaturedCard, GridCard };
