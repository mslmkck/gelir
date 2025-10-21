export const metadata = {
  title: "Offline | Modern Full-Stack App",
  description: "Offline shell that keeps the core experience available without a network connection.",
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-neutral-100 flex items-center justify-center px-6">
      <div className="max-w-xl w-full space-y-6 text-center">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-primary-500/20 flex items-center justify-center">
          <span className="text-3xl font-semibold text-primary-300" aria-hidden="true">
            ⚡
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">You&apos;re offline</h1>
        <p className="text-neutral-300 leading-relaxed">
          Don&apos;t worry—your last visited screens, dictionary data, and the game shell remain available. We&apos;ll
          automatically resync as soon as you reconnect.
        </p>
        <div className="space-y-3">
          <p className="text-sm text-neutral-400">Try the following while you&apos;re offline:</p>
          <ul className="text-left text-sm text-neutral-200 space-y-2 list-disc list-inside">
            <li>Review the cached dashboard.</li>
            <li>Look up terminology using the offline dictionary.</li>
            <li>Continue planning moves in the game shell.</li>
          </ul>
        </div>
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300"
        >
          Retry connection
        </a>
      </div>
    </div>
  );
}
