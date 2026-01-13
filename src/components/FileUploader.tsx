import React, { useCallback, useState } from "react";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onFileChange: (file: File | null) => void;
}

const FileUploader = ({ onFileChange }: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isHovering, setIsHovering] = useState(false);

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
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm animate-scale-in">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FileText className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">
              {file.name}
            </p>
            <p className="text-xs text-slate-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            onClick={removeFile}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {/* Success Indicator */}
        <div className="absolute top-2 right-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-fade-in" />
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={cn(
        "group relative cursor-pointer rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 transition-all duration-300 ease-out",
        "hover:border-blue-300 hover:bg-blue-50/30",
        isDragActive && "border-blue-500 bg-blue-50/50 scale-[0.99]"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-3 text-center">
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-100 transition-transform duration-300",
            (isHovering || isDragActive) && "scale-110 -translate-y-1"
          )}
        >
          <Upload
            className={cn(
              "h-6 w-6 text-slate-400 transition-colors",
              (isHovering || isDragActive) && "text-blue-500"
            )}
          />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700">
            {isDragActive ? "Drop to upload" : "Upload Resume"}
          </p>
          <p className="text-xs text-slate-500">PDF up to 10MB</p>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
