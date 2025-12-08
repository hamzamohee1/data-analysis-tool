import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface PlotlyChartProps {
  data: any;
}

/**
 * PlotlyChart Component
 * Renders Plotly visualizations in a React component
 */
export default function PlotlyChart({ data }: PlotlyChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current && data) {
      // Dynamically load Plotly if not already loaded
      if (!(window as any).Plotly) {
        const script = document.createElement("script");
        script.src = "https://cdn.plot.ly/plotly-latest.min.js";
        script.async = true;
        script.onload = () => {
          renderChart();
        };
        document.head.appendChild(script);
      } else {
        renderChart();
      }
    }

    function renderChart() {
      if (chartRef.current && (window as any).Plotly) {
        const layout = {
          ...data.layout,
          paper_bgcolor: "rgba(15, 23, 42, 0.5)",
          plot_bgcolor: "rgba(30, 41, 59, 0.5)",
          font: {
            color: "#cbd5e1",
            family: "system-ui, -apple-system, sans-serif",
          },
          margin: { l: 60, r: 40, t: 60, b: 60 },
        };

        (window as any).Plotly.newPlot(
          chartRef.current,
          data.data,
          layout,
          { responsive: true, displayModeBar: true }
        );
      }
    }
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 overflow-hidden"
    >
      <div
        ref={chartRef}
        style={{ width: "100%", height: "500px" }}
        className="rounded-lg"
      />
    </motion.div>
  );
}
