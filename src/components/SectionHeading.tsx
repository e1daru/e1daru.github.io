import FadeIn from "./FadeIn";

type Props = {
  number: string;
  title: string;
};

export default function SectionHeading({ number, title }: Props) {
  return (
    <FadeIn>
      <div className="flex items-center gap-3 mb-10">
        <span className="font-mono text-cyan-400 text-base">{number}</span>
        <h2 className="font-mono text-2xl md:text-3xl font-bold text-zinc-100 tracking-tight">
          {title}
        </h2>
        <div className="flex-1 h-px bg-zinc-800 ml-4" />
      </div>
    </FadeIn>
  );
}
