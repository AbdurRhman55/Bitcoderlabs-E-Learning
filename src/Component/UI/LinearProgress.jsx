import React from "react";

export default function LinearProgress({
  percent = 0,
  label = "",
  smallLabel = "",
}) {
  const safe = Math.max(0, Math.min(100, Number(percent || 0)));
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-900">{label}</span>
          {smallLabel && (
            <span className="text-xs text-gray-400">{smallLabel}</span>
          )}
        </div>
        <div className="text-sm font-extrabold text-gray-900">{safe}%</div>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden border border-gray-50">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-dark shadow-[0_6px_18px_rgba(59,174,233,0.12)] transition-all duration-700"
          style={{ width: `${safe}%` }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={safe}
        />
      </div>
    </div>
  );
}
