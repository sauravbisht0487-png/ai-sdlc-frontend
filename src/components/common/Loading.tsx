export default function Loading({
  label = "Loading workspace...",
}: {
  label?: string;
}) {
  return (
    <div className="flex min-h-[45vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />
        <p className="text-sm text-slate-400">{label}</p>
      </div>
    </div>
  );
}
