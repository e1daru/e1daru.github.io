import { Link } from "react-router-dom";
import type { Project } from "@/types";

export default function ProjectCard({
  img,
  alt,
  title,
  desc,
  path,
  external,
}: Project) {
  const Img = img ? (
    <img
      src={img}
      alt={alt || title}
      className="w-full rounded-md bg-slate-200 aspect-[16/9] object-cover"
    />
  ) : (
    <div
      className="w-full rounded-md bg-slate-200 aspect-[16/9]"
      aria-label={alt || title}
    />
  );

  return (
    <div className="project-card">
      {external ? (
        <a
          href={path}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-md"
        >
          {Img}
        </a>
      ) : (
        <Link to={path} className="block rounded-md">
          {Img}
        </Link>
      )}
      <h3 className="mt-3 text-[1.1rem] font-semibold text-slate-900">
        {title}
      </h3>
      <p className="text-sm text-slate-600">{desc}</p>
    </div>
  );
}
