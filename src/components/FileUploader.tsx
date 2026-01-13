import React, { useCallback, useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onFileChange: (file: File | null) => void;
}

const FileUploader = ({ onFileChange }: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        onFileChange(selectedFile);
      }
    },
    [onFileChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    multiple: false,
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    onFileChange(null);
  };

  if (file) {
    return (
      <div className="glass-card p-4 flex items-center justify-between group animate-in fade-in slide-in-from-bottom-2">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="font-medium text-slate-800 text-sm">{file.name}</p>
            <p className="text-xs text-slate-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
        <button
          onClick={removeFile}
          className="p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative group cursor-pointer overflow-hidden rounded-3xl border border-dashed border-slate-300 p-10 transition-all duration-500 hover:border-blue-400 hover:bg-blue-50/30",
        isDragActive && "border-blue-500 bg-blue-50/50 scale-[0.99]"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="h-16 w-16 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1">
          <Upload className="w-7 h-7 text-blue-600" />
        </div>
        <div className="space-y-1">
          <p className="text-base font-semibold text-slate-700">
            {isDragActive ? "Drop it here!" : "Upload Resume"}
          </p>
          <p className="text-sm text-slate-500">
            Drag & drop or click to browse (PDF)
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
