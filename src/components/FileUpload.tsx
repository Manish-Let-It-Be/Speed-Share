import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  disabled?: boolean;
}

export function FileUpload({ onFileSelect, disabled }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!disabled) {
      onFileSelect(acceptedFiles);
    }
  }, [onFileSelect, disabled]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`p-12 border-2 border-dashed rounded-lg transition-colors
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-primary/30 hover:border-primary'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center text-primary/80">
        <Upload className="w-16 h-16 mb-4" />
        <p className="text-center text-lg">
          {disabled ? 'Upload in progress...' :
            isDragActive ? 'Drop the files here...' :
            'Drag & drop files here, or click to select files'}
        </p>
      </div>
    </div>
  );
}