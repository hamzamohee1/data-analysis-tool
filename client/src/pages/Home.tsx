import { useState } from "react";
import { useLocation } from "wouter";
import FileUpload from "@/components/FileUpload";
import Dashboard from "@/components/Dashboard";
import { motion } from "framer-motion";

/**
 * Home page - Main entry point for the Data Analysis Tool
 * Features: File upload, data preview, and navigation to analysis sections
 */
export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      setFileData(data);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUploadedFile(null);
    setFileData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b border-slate-700/50 bg-slate-800/40 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Data Analysis Tool
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Upload, visualize, and clean your datasets with ease
              </p>
            </div>
            {fileData && (
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Upload New File
              </button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {!fileData ? (
          <FileUpload onFileUpload={handleFileUpload} loading={loading} />
        ) : (
          <Dashboard
            file={uploadedFile}
            fileData={fileData}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}
