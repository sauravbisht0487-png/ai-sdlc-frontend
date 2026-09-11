import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AppNavbar() {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-xs font-black text-slate-950 shadow-lg shadow-cyan-500/20">AI</span>
          <span><span className="block text-sm font-bold tracking-tight text-white">AI-SDLC</span><span className="hidden text-[11px] text-slate-500 sm:block">Intelligent development workspace</span></span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block"><p className="text-sm font-medium text-slate-200">{user?.name}</p><p className="text-[11px] text-slate-500">Developer</p></div>
          <button onClick={logout} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300">Logout</button>
        </div>
      </div>
    </header>
  );
}
