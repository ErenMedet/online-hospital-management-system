import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="app-shell-bg min-h-screen">
      <Navbar />
      <main className="mx-auto flex w-full max-w-[1500px] gap-6 px-4 pb-10 pt-6 md:px-6 md:pb-12 md:pt-8 xl:px-8">
        <div className="min-w-0 flex-1">{children}</div>
      </main>
      <footer className="px-4 pb-6 md:px-6 xl:px-8">
        <div className="app-panel mx-auto flex max-w-[1500px] flex-col gap-1 rounded-[28px] px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 MediCare Hospital Management System. Protected health information is handled under applicable privacy law.</p>
          <p className="text-xs text-slate-400">Patient, clinician, and operations workflows in one platform.</p>
        </div>
      </footer>
    </div>
  );
}
