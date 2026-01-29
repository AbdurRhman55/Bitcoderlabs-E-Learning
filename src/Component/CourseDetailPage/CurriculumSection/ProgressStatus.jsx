import { FaCheck, FaRocket, FaBookOpen } from "react-icons/fa";

export default function ProgressStatus({
  progress = 0,
  completed = 0,
  total = 0,
}) {
  const pct = Math.max(0, Math.min(100, Number(progress) || 0));
  const safeTotal = Math.max(0, Number(total) || 0);
  const safeCompleted = Math.max(0, Number(completed) || 0);

  const status =
    pct === 100 ? "completed" : pct > 0 ? "in-progress" : "not-started";

  const containerClass = {
    completed: "bg-green-600 text-white",
    "in-progress": "bg-gradient-to-r from-primary to-primary-dark text-white",
    "not-started": "bg-white text-gray-700 border border-gray-200",
  }[status];

  const iconBg = {
    completed: "bg-white text-green-600",
    "in-progress": "bg-white text-primary",
    "not-started": "bg-gray-100 text-gray-500",
  }[status];

  const label =
    status === "completed"
      ? "Completed"
      : status === "in-progress"
        ? "In Progress"
        : "Ready to Start";

  return (
    <div
      role="status"
      aria-label={`${label} — ${pct}% — ${safeCompleted} of ${safeTotal} lessons`}
      className={`inline-flex items-center gap-3 text-sm font-medium px-3 py-1 rounded-full ${containerClass}`}
    >
      <span
        className={`flex items-center justify-center w-6 h-6 rounded-full ${iconBg}`}
      >
        {status === "completed" ? (
          <FaCheck className="w-3 h-3" />
        ) : status === "in-progress" ? (
          <FaRocket className="w-3 h-3" />
        ) : (
          <FaBookOpen className="w-3 h-3" />
        )}
      </span>

      <span className="leading-none">{label}</span>

      <span
        className={`text-xs ${status === "not-started" ? "text-gray-500" : "text-white/90"}`}
      >
        {`· ${pct}%`}
        {safeTotal > 0 ? ` · ${safeCompleted}/${safeTotal}` : ""}
      </span>
    </div>
  );
}
