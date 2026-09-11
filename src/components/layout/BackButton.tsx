import { Link } from "react-router-dom";
export default function BackButton({ to, label }: { to: string; label: string }) { return <Link to={to} className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-cyan-300">← {label}</Link>; }
