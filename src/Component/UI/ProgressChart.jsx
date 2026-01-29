import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function ProgressChart({ items = [], height = 140 }) {
  const labels = items.map((it) => it.label);
  const dataValues = items.map((it) =>
    Math.max(0, Math.min(100, Number(it.value || 0))),
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Progress",
        data: dataValues,
        backgroundColor: items.map((_, i) => {
          // alternating subtle color palette
          const colors = [
            "rgba(59,174,233,0.95)",
            "rgba(99,102,241,0.95)",
            "rgba(16,185,129,0.95)",
            "rgba(234,179,8,0.95)",
          ];
          return colors[i % colors.length];
        }),
        borderRadius: 6,
        barThickness: 18,
        maxBarThickness: 28,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}%`,
        },
        padding: 8,
        cornerRadius: 6,
      },
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { color: "#6b7280", font: { size: 11 } },
      },
      y: {
        display: false,
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <div style={{ height: `${height}px` }} className="w-full">
      <Bar data={data} options={options} />
    </div>
  );
}
