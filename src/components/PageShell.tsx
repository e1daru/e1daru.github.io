export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="page-center ">
      <div className="mx-auto w-full max-w-5xl md:max-w-5xl px-4 sm:px-6 lg:px-6 py-5 md:py-6">
        {children}
      </div>
    </main>
  );
}
