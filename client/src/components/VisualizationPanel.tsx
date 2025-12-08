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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlotlyChart from "./PlotlyChart";

interface VisualizationPanelProps {
  file: File | null;
  columns: string[];
  numericColumns: string[];
}

/**
 * VisualizationPanel Component
 * Creates interactive visualizations for data analysis
 */
export default function VisualizationPanel({
  file,
  columns,
  numericColumns,
}: VisualizationPanelProps) {
  const [selectedColumn, setSelectedColumn] = useState<string>(
    numericColumns[0] || ""
  );
  const [xColumn, setXColumn] = useState<string>(numericColumns[0] || "");
  const [yColumn, setYColumn] = useState<string>(numericColumns[1] || "");
  const [histogramData, setHistogramData] = useState<any>(null);
  const [boxplotData, setBoxplotData] = useState<any>(null);
  const [scatterData, setScatterData] = useState<any>(null);
  const [heatmapData, setHeatmapData] = useState<any>(null);
  const [normalDistData, setNormalDistData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVisualization = async (
    endpoint: string,
    params: Record<string, string>
  ) => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      Object.entries(params).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch visualization");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleHistogram = async () => {
    const data = await fetchVisualization("/api/visualizations/histogram", {
      column: selectedColumn,
      bins: "30",
    });
    if (data) setHistogramData(data);
  };

  const handleBoxplot = async () => {
    const data = await fetchVisualization("/api/visualizations/boxplot", {
      column: selectedColumn,
    });
    if (data) setBoxplotData(data);
  };

  const handleScatter = async () => {
    const data = await fetchVisualization("/api/visualizations/scatter", {
      x_column: xColumn,
      y_column: yColumn,
    });
    if (data) setScatterData(data);
  };

  const handleHeatmap = async () => {
    const data = await fetchVisualization("/api/visualizations/heatmap", {});
    if (data) setHeatmapData(data);
  };

  const handleNormalDist = async () => {
    const data = await fetchVisualization(
      "/api/visualizations/normal-distribution",
      {
        column: selectedColumn,
      }
    );
    if (data) setNormalDistData(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <Tabs defaultValue="histogram" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger value="histogram">Histogram</TabsTrigger>
          <TabsTrigger value="boxplot">Box Plot</TabsTrigger>
          <TabsTrigger value="scatter">Scatter</TabsTrigger>
          <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
          <TabsTrigger value="normal">Normal Dist</TabsTrigger>
        </TabsList>

        {/* Histogram */}
        <TabsContent value="histogram" className="space-y-4">
          <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Select Column
                </label>
                <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600">
                    <SelectValue />
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
              <button
                onClick={handleHistogram}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? "Loading..." : "Generate"}
              </button>
            </div>
            {histogramData && <PlotlyChart data={histogramData} />}
          </div>
        </TabsContent>

        {/* Box Plot */}
        <TabsContent value="boxplot" className="space-y-4">
          <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Select Column
                </label>
                <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600">
                    <SelectValue />
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
              <button
                onClick={handleBoxplot}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? "Loading..." : "Generate"}
              </button>
            </div>
            {boxplotData && <PlotlyChart data={boxplotData} />}
          </div>
        </TabsContent>

        {/* Scatter Plot */}
        <TabsContent value="scatter" className="space-y-4">
          <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  X-Axis Column
                </label>
                <Select value={xColumn} onValueChange={setXColumn}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600">
                    <SelectValue />
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
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Y-Axis Column
                </label>
                <Select value={yColumn} onValueChange={setYColumn}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600">
                    <SelectValue />
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
            </div>
            <button
              onClick={handleScatter}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 w-full"
            >
              {loading ? "Loading..." : "Generate Scatter Plot"}
            </button>
            {scatterData && <PlotlyChart data={scatterData} />}
          </div>
        </TabsContent>

        {/* Heatmap */}
        <TabsContent value="heatmap" className="space-y-4">
          <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl space-y-4">
            <button
              onClick={handleHeatmap}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 w-full"
            >
              {loading ? "Loading..." : "Generate Correlation Heatmap"}
            </button>
            {heatmapData && <PlotlyChart data={heatmapData} />}
          </div>
        </TabsContent>

        {/* Normal Distribution */}
        <TabsContent value="normal" className="space-y-4">
          <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Select Column
                </label>
                <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600">
                    <SelectValue />
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
              <button
                onClick={handleNormalDist}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? "Loading..." : "Generate"}
              </button>
            </div>
            {normalDistData && <PlotlyChart data={normalDistData} />}
          </div>
        </TabsContent>
      </Tabs>

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

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-12 bg-slate-800/50 border border-slate-700/50 rounded-xl flex items-center justify-center"
        >
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          <span className="ml-3 text-slate-300">Generating visualization...</span>
        </motion.div>
      )}
    </motion.div>
  );
}
