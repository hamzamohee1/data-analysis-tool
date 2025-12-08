import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatisticsPanel from "./StatisticsPanel";
import VisualizationPanel from "./VisualizationPanel";
import DataCleaningPanel from "./DataCleaningPanel";
import DataPreview from "./DataPreview";

interface DashboardProps {
  file: File | null;
  fileData: any;
  onReset: () => void;
}

/**
 * Dashboard Component
 * Main analysis interface with tabs for statistics, visualizations, and data cleaning
 */
export default function Dashboard({ file, fileData, onReset }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("preview");

  const numericColumns = useMemo(() => {
    if (!fileData?.column_info) return [];
    return Object.entries(fileData.column_info)
      .filter(([_, info]: [string, any]) => info.type === "numeric")
      .map(([col]) => col);
  }, [fileData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* File Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="p-6 bg-gradient-to-r from-slate-800 to-slate-800/50 border border-slate-700/50 rounded-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-slate-400 text-sm">File Name</p>
            <p className="text-white font-semibold truncate">
              {fileData?.filename}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Total Rows</p>
            <p className="text-white font-semibold">
              {fileData?.shape?.rows?.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Total Columns</p>
            <p className="text-white font-semibold">
              {fileData?.shape?.columns}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Numeric Columns</p>
            <p className="text-white font-semibold">{numericColumns.length}</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
            <TabsTrigger value="cleaning">Data Cleaning</TabsTrigger>
          </TabsList>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-4">
            <DataPreview fileData={fileData} />
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics" className="space-y-4">
            <StatisticsPanel
              file={file}
              columns={fileData?.columns}
              numericColumns={numericColumns}
            />
          </TabsContent>

          {/* Visualizations Tab */}
          <TabsContent value="visualizations" className="space-y-4">
            <VisualizationPanel
              file={file}
              columns={fileData?.columns}
              numericColumns={numericColumns}
            />
          </TabsContent>

          {/* Data Cleaning Tab */}
          <TabsContent value="cleaning" className="space-y-4">
            <DataCleaningPanel file={file} columns={fileData?.columns} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
