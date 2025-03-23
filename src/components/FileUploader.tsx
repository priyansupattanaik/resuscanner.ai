
import React, { useState, useRef } from 'react';
import { Upload, FileUp, Check, AlertCircle } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";

interface FileUploaderProps {
  onFileChange: (file: File | null) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const handleFileChange = (selectedFile: File | null) => {
    setError(null);
    
    if (!selectedFile) {
      setFile(null);
      onFileChange(null);
      return;
    }
    
    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }
    
    setFile(selectedFile);
    onFileChange(selectedFile);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    handleFileChange(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files?.[0] || null;
    handleFileChange(droppedFile);
  };

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  return (
    <div 
      className={`glass-card ${isMobile ? 'p-4' : 'p-8'} rounded-xl transition-all duration-300 animate-fade-in ${
        isDragging ? 'border-primary border-2 shadow-lg shadow-primary/20' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={inputRef}
        accept=".pdf"
        onChange={handleInputChange}
        className="hidden"
      />
      
      <div className="flex flex-col items-center justify-center text-center">
        {file ? (
          <div className="space-y-2 md:space-y-3">
            <div className={`${isMobile ? 'h-10 w-10' : 'h-12 w-12'} rounded-full bg-primary/20 flex items-center justify-center mx-auto`}>
              <Check className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-primary`} />
            </div>
            <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-medium break-all px-2`}>{file.name}</h3>
            <p className="text-muted-foreground text-xs md:text-sm">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <button
              onClick={triggerFileInput}
              className="mt-2 md:mt-4 text-xs md:text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Change file
            </button>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            <div className={`${isMobile ? 'h-12 w-12' : 'h-16 w-16'} rounded-full bg-muted flex items-center justify-center mx-auto animate-pulse-glow`}>
              <Upload className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-primary`} />
            </div>
            <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-medium`}>Upload your resume</h3>
            <p className="text-muted-foreground max-w-sm text-xs md:text-sm">
              {isMobile ? 'Tap to select a PDF resume' : 'Drag and drop your PDF resume here or click to browse'}
            </p>
            {error && (
              <div className="flex items-center justify-center text-destructive gap-1 text-xs md:text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            <button
              onClick={triggerFileInput}
              className="px-3 py-1.5 md:px-4 md:py-2 rounded-md bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-colors flex items-center gap-2 mx-auto text-xs md:text-sm"
            >
              <FileUp className="h-3 w-3 md:h-4 md:w-4" />
              <span>Browse files</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
