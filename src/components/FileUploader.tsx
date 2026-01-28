import React, { useCallback, useState } from "react";
import { Upload, FileText, X, CheckSquare } from "lucide-react";
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
    [onFileChange],
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
      <div className="relative border-2 border-black bg-secondary text-white p-6 neo-shadow animate-slide-in">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-white bg-white/10">
            <FileText className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-base font-bold font-mono">
              {file.name}
            </p>
            <p className="text-xs font-mono opacity-80 mt-1">
              {(file.size / 1024 / 1024).toFixed(2)} MB • READY_TO_SCAN
            </p>
          </div>
          <button
            onClick={removeFile}
            className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-white hover:bg-white hover:text-secondary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Decorative corner */}
        <div className="absolute top-0 right-0 p-1">
          <div className="w-2 h-2 bg-white" />
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "group relative cursor-pointer border-2 border-dashed border-slate-300 bg-slate-50 p-10 transition-all duration-200",
        "hover:border-black hover:bg-white hover:neo-shadow-sm",
        isDragActive && "border-primary bg-primary/5 border-solid neo-shadow",
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div
          className={cn(
            "flex h-16 w-16 items-center justify-center border-2 border-slate-300 bg-white transition-all duration-200",
            "group-hover:border-black group-hover:bg-primary group-hover:text-white group-hover:scale-110",
            isDragActive && "border-primary bg-primary text-white scale-110",
          )}
        >
          <Upload className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-bold text-slate-900 uppercase tracking-tight">
            {isDragActive ? "Drop PDF Here" : "Upload PDF Resume"}
          </p>
          <p className="text-xs font-mono text-slate-500">MAX SIZE: 10MB</p>
        </div>
      </div>

      {/* Technical markers */}
      <div className="absolute top-2 left-2 w-2 h-2 border-l border-t border-black opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-2 right-2 w-2 h-2 border-r border-t border-black opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-l border-b border-black opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-r border-b border-black opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default FileUploader;
