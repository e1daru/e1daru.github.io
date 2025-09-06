export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="page-center">
      <div className="mx-auto w-full">{children}</div>
    </main>
  );
}
