import { Github, Linkedin, Mail, FileText } from "lucide-react";
import FadeIn from "./FadeIn";

export default function Hero() {
  return (
    <section id="hero" className="min-h-[85vh] flex items-center pt-20">
      <div className="page-center">
        <FadeIn>
          <p className="font-mono text-cyan-400 text-base mb-4">
            Hi, my name is
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-100 tracking-tight leading-tight mb-4">
            Eldar Utiushev
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-zinc-400 leading-tight mb-8">
            Full-Stack Developer & Business Analyst
          </h2>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p className="text-base md:text-lg text-zinc-400 max-w-2xl leading-relaxed mb-10">
            I build data-driven solutions and software products that solve
            meaningful problems. Dual degree in Business Administration and
            Computer Science at UNC Chapel Hill with consulting and analytics
            experiences.
          </p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/e1daru"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-cyan-400 transition-colors"
              aria-label="GitHub"
            >
              <Github size={22} />
            </a>
            <a
              href="https://www.linkedin.com/in/eldaru"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-cyan-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={22} />
            </a>
            <a
              href="mailto:eldaru33@gmail.com"
              className="text-zinc-400 hover:text-cyan-400 transition-colors"
              aria-label="Email"
            >
              <Mail size={22} />
            </a>
            <a
              href="/Eldar_Utiushev_Resume_2026.pdf"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-cyan-400 transition-colors"
              aria-label="Resume"
            >
              <FileText size={22} />
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
