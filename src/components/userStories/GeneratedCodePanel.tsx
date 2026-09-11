import type { GeneratedCode } from "../../types/organization";
export default function GeneratedCodePanel({
  generated,
  pushing,
  onPush,
}: {
  generated: GeneratedCode;
  pushing: boolean;
  onPush: () => void;
}) {
  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-cyan-400/10 bg-slate-950">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">Generated code</p>
          <p className="text-[11px] text-slate-500">
            Files returned by the AI code-generation endpoint
          </p>
        </div>
        <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[10px] font-semibold text-cyan-300">
          AI OUTPUT
        </span>
      </div>
      <div className="space-y-4 p-4">
        {generated.files.map((file, i) => (
          <div
            key={`${file.filename}-${i}`}
            className="overflow-hidden rounded-xl border border-slate-800"
          >
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-3 py-2">
              <span className="text-xs font-semibold text-slate-300">
                {file.filename}
              </span>
              <span className="text-[10px] uppercase text-slate-500">
                {file.language}
              </span>
            </div>
            <pre className="max-h-80 overflow-auto p-4 text-xs leading-5 text-slate-300">
              <code>{file.code}</code>
            </pre>
          </div>
        ))}
        <button
          onClick={onPush}
          disabled={pushing}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
        >
          {pushing ? "Pushing to GitHub..." : "Push to GitHub"}
        </button>
      </div>
    </section>
  );
}
