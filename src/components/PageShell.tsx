export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="page-center ">
      <div className="mx-auto w-full max-w-6xl md:max-w-7xl px-4 sm:px-8 lg:px-8 py-10 md:py-12">
        {children}
      </div>
    </main>
  );
}
