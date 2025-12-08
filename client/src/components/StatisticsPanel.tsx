import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatisticsPanelProps {
  file: File | null;
  columns: string[];
  numericColumns: string[];
}

/**
 * StatisticsPanel Component
 * Displays statistical analysis for selected column
 */
export default function StatisticsPanel({
  file,
  columns,
  numericColumns,
}: StatisticsPanelProps) {
  const [selectedColumn, setSelectedColumn] = useState<string>(
    numericColumns[0] || ""
  );
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = async (column: string) => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("column", column);

      const response = await fetch("http://localhost:8000/api/statistics", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch statistics");
      }

      const data = await response.json();
      setStatistics(data.statistics?.[column]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleColumnChange = (column: string) => {
    setSelectedColumn(column);
    fetchStatistics(column);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Column Selector */}
      <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl">
        <label className="block text-sm font-semibold text-slate-300 mb-3">
          Select Column for Analysis
        </label>
        <Select value={selectedColumn} onValueChange={handleColumnChange}>
          <SelectTrigger className="w-full bg-slate-700/50 border-slate-600">
            <SelectValue placeholder="Select a column" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {numericColumns.map((col) => (
              <SelectItem key={col} value={col}>
                {col}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Statistics Display */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-12 bg-slate-800/50 border border-slate-700/50 rounded-xl flex items-center justify-center"
        >
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          <span className="ml-3 text-slate-300">Calculating statistics...</span>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400">{error}</p>
        </motion.div>
      )}

      {statistics && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Basic Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Mean", value: statistics.mean },
              { label: "Median", value: statistics.median },
              { label: "Std Dev", value: statistics.std_dev },
              { label: "Variance", value: statistics.variance },
              { label: "Min", value: statistics.min },
              { label: "Max", value: statistics.max },
              { label: "Q1", value: statistics.q1 },
              { label: "Q3", value: statistics.q3 },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg"
              >
                <p className="text-slate-400 text-sm">{stat.label}</p>
                <p className="text-white font-bold text-lg">
                  {typeof stat.value === "number"
                    ? stat.value.toFixed(2)
                    : stat.value}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Distribution Analysis */}
          <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-4">
              Distribution Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Skewness</p>
                <p className="text-white font-semibold">
                  {statistics.skewness?.toFixed(3)}
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  {Math.abs(statistics.skewness) < 0.5
                    ? "Fairly symmetric"
                    : statistics.skewness > 0
                      ? "Right-skewed"
                      : "Left-skewed"}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Kurtosis</p>
                <p className="text-white font-semibold">
                  {statistics.kurtosis?.toFixed(3)}
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  {Math.abs(statistics.kurtosis) < 3
                    ? "Mesokurtic"
                    : statistics.kurtosis > 3
                      ? "Leptokurtic"
                      : "Platykurtic"}
                </p>
              </div>
            </div>
          </div>

          {/* Normality Test */}
          {statistics.normality_test && (
            <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4">
                Normality Test ({statistics.normality_test.test})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Test Statistic</p>
                  <p className="text-white font-semibold">
                    {statistics.normality_test.statistic?.toFixed(4)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">P-Value</p>
                  <p className="text-white font-semibold">
                    {statistics.normality_test.p_value?.toFixed(4)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Result</p>
                  <p
                    className={`font-semibold ${
                      statistics.normality_test.is_normal
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {statistics.normality_test.is_normal
                      ? "Normally Distributed"
                      : "Not Normally Distributed"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
