import { useState, useRef } from "react";
import { Upload, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  loading: boolean;
}

/**
 * FileUpload Component
 * Handles CSV and Excel file uploads with drag-and-drop support
 */
export default function FileUpload({ onFileUpload, loading }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ALLOWED_TYPES = [
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_TYPES.includes(file.type) && !file.name.endsWith(".csv")) {
      setError("Please upload a CSV or Excel file");
      return false;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError("File size must be less than 50MB");
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      onFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto"
    >
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 p-12 text-center cursor-pointer ${
          isDragging
            ? "border-blue-400 bg-blue-500/10"
            : "border-slate-600 bg-slate-800/30 hover:border-slate-500"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleInputChange}
          className="hidden"
          disabled={loading}
        />

        <motion.div
          animate={{ y: isDragging ? -5 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center"
        >
          <motion.div
            animate={{ scale: isDragging ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <Upload
              className={`w-16 h-16 mx-auto mb-4 ${
                isDragging ? "text-blue-400" : "text-slate-400"
              }`}
            />
          </motion.div>

          <h2 className="text-2xl font-bold text-white mb-2">
            Upload Your Dataset
          </h2>
          <p className="text-slate-400 mb-4">
            Drag and drop your CSV or Excel file here, or click to select
          </p>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading..." : "Select File"}
          </button>

          <p className="text-slate-500 text-sm mt-4">
            Maximum file size: 50MB • Supported formats: CSV, XLSX, XLS
          </p>
        </motion.div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400">{error}</p>
        </motion.div>
      )}

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          {
            title: "Statistical Analysis",
            description:
              "Calculate mean, median, variance, and normal distribution metrics",
            icon: "📊",
          },
          {
            title: "Interactive Visualizations",
            description:
              "Create histograms, box plots, scatter plots, and heatmaps",
            icon: "📈",
          },
          {
            title: "Data Cleaning",
            description:
              "Handle missing values, duplicates, and outliers with ease",
            icon: "🧹",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:border-slate-600 transition-colors"
          >
            <div className="text-3xl mb-3">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-slate-400 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
