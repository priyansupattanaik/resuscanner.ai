import React, { useCallback, useState } from "react";
import { UploadCloud, FileText, X, Check } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface FileUploaderProps {
  onFileChange: (file: File | null) => void;
}

const FileUploader = ({ onFileChange }: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        if (selectedFile.type !== "application/pdf") {
          toast({
            variant: "destructive",
            title: "Invalid file type",
            description: "Please upload a PDF document.",
          });
          return;
        }
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
    // Compact View when file is selected
    return (
      <div className="w-full p-4 bg-blue-50/50 border border-blue-200 rounded-xl flex items-center justify-between animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">
              {file.name}
            </p>
            <p className="text-xs text-slate-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={removeFile}
          className="text-slate-400 hover:text-red-500 hover:bg-red-50"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  // Drag & Drop View
  return (
    <div
      {...getRootProps()}
      className={`
        relative overflow-hidden rounded-xl border-2 border-dashed p-8 transition-all duration-300 cursor-pointer text-center group
        ${
          isDragActive
            ? "border-blue-500 bg-blue-50/50 scale-[0.99]"
            : "border-slate-200 hover:border-blue-400 hover:bg-slate-50/50"
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-3">
        <div
          className={`
          p-3 rounded-full transition-colors duration-300
          ${
            isDragActive
              ? "bg-blue-100 text-blue-600"
              : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-500"
          }
        `}
        >
          <UploadCloud className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-900">
            {isDragActive
              ? "Drop resume here"
              : "Click to upload or drag and drop"}
          </p>
          <p className="text-xs text-slate-500 mt-1">PDF only (Max 5MB)</p>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
