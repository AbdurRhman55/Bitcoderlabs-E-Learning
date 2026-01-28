import { FaCheck, FaRocket, FaBookOpen } from "react-icons/fa";

export default function ProgressStatus({
  progress = 0,
  completed = 0,
  total = 0,
}) {
  const pct = Math.max(0, Math.min(100, Number(progress) || 0));
  const safeTotal = Math.max(0, Number(total) || 0);
  const safeCompleted = Math.max(0, Number(completed) || 0);

  return (
    <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
      {pct === 100 && (
        <>
          <FaCheck className="text-green-500" />
          <span>Completed</span>
          <span className="text-xs text-gray-500">
            • {safeCompleted}/{safeTotal} lessons
          </span>
        </>
      )}

      {pct > 0 && pct < 100 && (
        <>
          <FaRocket className="text-primary" />
          <span>In Progress</span>
          <span className="text-xs text-gray-500">
            • {safeCompleted}/{safeTotal} lessons
          </span>
        </>
      )}

      {pct === 0 && (
        <>
          <FaBookOpen className="text-gray-400" />
          <span>Ready to Start</span>
          <span className="text-xs text-gray-500">
            • {safeCompleted}/{safeTotal} lessons
          </span>
        </>
      )}
    </div>
  );
}
