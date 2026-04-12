export default function TechTag({ label }: { label: string }) {
  return (
    <span className="inline-block px-2.5 py-1 text-xs font-mono bg-cyan-400/10 text-cyan-300 rounded-full border border-cyan-400/20">
      {label}
    </span>
  );
}
