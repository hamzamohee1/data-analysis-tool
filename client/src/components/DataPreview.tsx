import { motion } from "framer-motion";

interface DataPreviewProps {
  fileData: any;
}

/**
 * DataPreview Component
 * Displays a preview of the uploaded dataset
 */
export default function DataPreview({ fileData }: DataPreviewProps) {
  if (!fileData?.preview || fileData.preview.length === 0) {
    return (
      <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl text-center text-slate-400">
        No data to preview
      </div>
    );
  }

  const columns = fileData.columns || [];
  const preview = fileData.preview || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-4"
    >
      <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              {columns.map((col: string) => (
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
            {preview.map((row: any, idx: number) => (
              <tr
                key={idx}
                className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
              >
                {columns.map((col: string) => (
                  <td key={`${idx}-${col}`} className="px-4 py-3 text-slate-300">
                    {row[col] !== null && row[col] !== undefined
                      ? String(row[col]).substring(0, 50)
                      : "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Column Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {columns.map((col: string) => {
          const info = fileData.column_info?.[col];
          return (
            <motion.div
              key={col}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg"
            >
              <h4 className="font-semibold text-white mb-2">{col}</h4>
              <div className="space-y-1 text-sm text-slate-400">
                <p>Type: <span className="text-slate-300">{info?.type}</span></p>
                <p>Non-null: <span className="text-slate-300">{info?.non_null_count}</span></p>
                <p>Unique: <span className="text-slate-300">{info?.unique_count}</span></p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
