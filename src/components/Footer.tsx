import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-12 mt-20">
      <div className="page-center text-center">
        <div className="flex justify-center gap-5 mb-6">
          <a
            href="https://github.com/e1daru"
            target="_blank"
            rel="noreferrer"
            className="text-zinc-500 hover:text-cyan-400 transition-colors"
          >
            <Github size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/eldaru"
            target="_blank"
            rel="noreferrer"
            className="text-zinc-500 hover:text-cyan-400 transition-colors"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="mailto:eldaru33@gmail.com"
            className="text-zinc-500 hover:text-cyan-400 transition-colors"
          >
            <Mail size={20} />
          </a>
        </div>
        <p className="text-zinc-500 text-sm font-mono">
          Built by Eldar Utiushev
        </p>
      </div>
    </footer>
  );
}
