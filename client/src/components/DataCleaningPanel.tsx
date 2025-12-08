import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface DataCleaningPanelProps {
  file: File | null;
  columns: string[];
}

/**
 * DataCleaningPanel Component
 * Handles data cleaning operations including missing values, duplicates, and outliers
 */
export default function DataCleaningPanel({
  file,
  columns,
}: DataCleaningPanelProps) {
  const [missingInfo, setMissingInfo] = useState<any>(null);
  const [duplicateInfo, setDuplicateInfo] = useState<any>(null);
  const [outlierInfo, setOutlierInfo] = useState<any>(null);
  const [selectedColumn, setSelectedColumn] = useState<string>(columns[0] || "");
  const [outlierMethod, setOutlierMethod] = useState<string>("zscore");
  const [handleMissing, setHandleMissing] = useState<string>("drop");
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [removeOutliers, setRemoveOutliers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cleanedData, setCleanedData] = useState<any>(null);

  const detectMissing = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "http://localhost:8000/api/cleaning/detect-missing",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to detect missing values");
      const data = await response.json();
      setMissingInfo(data.missing_info);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const detectDuplicates = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "http://localhost:8000/api/cleaning/detect-duplicates",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to detect duplicates");
      const data = await response.json();
      setDuplicateInfo(data.duplicate_info);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const detectOutliers = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("column", selectedColumn);
      formData.append("method", outlierMethod);

      const response = await fetch(
        "http://localhost:8000/api/cleaning/detect-outliers",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to detect outliers");
      const data = await response.json();
      setOutlierInfo(data.outlier_info);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const cleanDataset = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("handle_missing", handleMissing);
      formData.append("remove_duplicates", String(removeDuplicates));
      formData.append("remove_outliers", String(removeOutliers));
      if (removeOutliers) {
        formData.append("outlier_column", selectedColumn);
        formData.append("outlier_method", outlierMethod);
      }

      const response = await fetch(
        "http://localhost:8000/api/cleaning/clean-dataset",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to clean dataset");
      const data = await response.json();
      setCleanedData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const downloadCleaned = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("handle_missing", handleMissing);
      formData.append("remove_duplicates", String(removeDuplicates));
      formData.append("remove_outliers", String(removeOutliers));
      if (removeOutliers) {
        formData.append("outlier_column", selectedColumn);
        formData.append("outlier_method", outlierMethod);
      }

      const response = await fetch(
        "http://localhost:8000/api/cleaning/download-cleaned",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to download cleaned data");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cleaned_data.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Detection Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={detectMissing}
          disabled={loading}
          className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:border-slate-600 transition-colors disabled:opacity-50 text-left"
        >
          <h3 className="font-semibold text-white mb-2">Detect Missing Values</h3>
          <p className="text-slate-400 text-sm">
            Identify and analyze missing data
          </p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={detectDuplicates}
          disabled={loading}
          className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:border-slate-600 transition-colors disabled:opacity-50 text-left"
        >
          <h3 className="font-semibold text-white mb-2">Detect Duplicates</h3>
          <p className="text-slate-400 text-sm">
            Find duplicate rows in your dataset
          </p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={detectOutliers}
          disabled={loading}
          className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:border-slate-600 transition-colors disabled:opacity-50 text-left"
        >
          <h3 className="font-semibold text-white mb-2">Detect Outliers</h3>
          <p className="text-slate-400 text-sm">
            Identify anomalous values in data
          </p>
        </motion.button>
      </div>

      {/* Detection Results */}
      {missingInfo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl"
        >
          <h3 className="font-semibold text-white mb-4">Missing Values Report</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-slate-400 text-sm">Total Missing</p>
              <p className="text-white font-bold text-lg">
                {missingInfo.total_missing}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Cells</p>
              <p className="text-white font-bold text-lg">
                {missingInfo.total_cells}
              </p>
            </div>
          </div>
          {Object.keys(missingInfo.columns_with_missing).length > 0 && (
            <div>
              <p className="text-slate-300 text-sm font-semibold mb-3">
                Columns with Missing Values:
              </p>
              <div className="space-y-2">
                {Object.entries(missingInfo.columns_with_missing).map(
                  ([col, info]: [string, any]) => (
                    <div
                      key={col}
                      className="p-3 bg-slate-700/30 rounded-lg flex justify-between"
                    >
                      <span className="text-slate-300">{col}</span>
                      <span className="text-slate-400">
                        {info.count} ({info.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {duplicateInfo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl"
        >
          <h3 className="font-semibold text-white mb-4">Duplicates Report</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-slate-400 text-sm">Total Duplicates</p>
              <p className="text-white font-bold text-lg">
                {duplicateInfo.total_duplicates}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Rows</p>
              <p className="text-white font-bold text-lg">
                {duplicateInfo.total_rows}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Percentage</p>
              <p className="text-white font-bold text-lg">
                {duplicateInfo.duplicate_percentage.toFixed(2)}%
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {outlierInfo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl"
        >
          <h3 className="font-semibold text-white mb-4">
            Outliers Report ({outlierInfo.method})
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-slate-400 text-sm">Total Outliers</p>
              <p className="text-white font-bold text-lg">
                {outlierInfo.total_outliers}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Percentage</p>
              <p className="text-white font-bold text-lg">
                {outlierInfo.outlier_percentage.toFixed(2)}%
              </p>
            </div>
            {outlierInfo.method === "IQR" && (
              <>
                <div>
                  <p className="text-slate-400 text-sm">Lower Bound</p>
                  <p className="text-white font-bold text-lg">
                    {outlierInfo.lower_bound?.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Upper Bound</p>
                  <p className="text-white font-bold text-lg">
                    {outlierInfo.upper_bound?.toFixed(2)}
                  </p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Cleaning Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl space-y-6"
      >
        <h3 className="font-semibold text-white text-lg">Cleaning Options</h3>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3">
            Handle Missing Values
          </label>
          <Select value={handleMissing} onValueChange={setHandleMissing}>
            <SelectTrigger className="bg-slate-700/50 border-slate-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="drop">Drop rows with missing values</SelectItem>
              <SelectItem value="mean">Fill with mean (numeric only)</SelectItem>
              <SelectItem value="median">Fill with median (numeric only)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            id="remove-duplicates"
            checked={removeDuplicates}
            onCheckedChange={(checked) =>
              setRemoveDuplicates(checked as boolean)
            }
          />
          <label htmlFor="remove-duplicates" className="text-slate-300 cursor-pointer">
            Remove duplicate rows
          </label>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Checkbox
              id="remove-outliers"
              checked={removeOutliers}
              onCheckedChange={(checked) => setRemoveOutliers(checked as boolean)}
            />
            <label htmlFor="remove-outliers" className="text-slate-300 cursor-pointer">
              Remove outliers
            </label>
          </div>

          {removeOutliers && (
            <div className="ml-6 space-y-3">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Column to analyze
                </label>
                <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {columns.map((col) => (
                      <SelectItem key={col} value={col}>
                        {col}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Detection method
                </label>
                <Select value={outlierMethod} onValueChange={setOutlierMethod}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="zscore">Z-Score (σ &gt; 3)</SelectItem>
                    <SelectItem value="iqr">IQR Method</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={cleanDataset}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              "Preview Cleaned Data"
            )}
          </button>

          {cleanedData && (
            <button
              onClick={downloadCleaned}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download CSV
            </button>
          )}
        </div>
      </motion.div>

      {/* Cleaned Data Preview */}
      {cleanedData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl"
        >
          <h3 className="font-semibold text-white mb-4">Cleaning Summary</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-slate-400 text-sm">Rows Before</p>
              <p className="text-white font-bold text-lg">
                {cleanedData.rows_before}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Rows After</p>
              <p className="text-white font-bold text-lg">
                {cleanedData.rows_after}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Rows Removed</p>
              <p className="text-red-400 font-bold text-lg">
                {cleanedData.rows_removed}
              </p>
            </div>
          </div>

          {/* Data Table */}
          {cleanedData.data && cleanedData.data.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    {Object.keys(cleanedData.data[0]).map((col) => (
                      <th
                        key={col}
                        className="px-4 py-3 text-left text-slate-300 font-semibold"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cleanedData.data.slice(0, 5).map((row: any, idx: number) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-700/50 hover:bg-slate-700/30"
                    >
                      {Object.values(row).map((val: any, colIdx: number) => (
                        <td key={colIdx} className="px-4 py-3 text-slate-300">
                          {val !== null && val !== undefined
                            ? String(val).substring(0, 30)
                            : "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {cleanedData.data.length > 5 && (
                <p className="text-slate-400 text-sm mt-2">
                  Showing 5 of {cleanedData.data.length} rows
                </p>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Error Message */}
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
    </motion.div>
  );
}
