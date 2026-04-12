export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-200 font-sans">
      {children}
    </div>
  );
}
