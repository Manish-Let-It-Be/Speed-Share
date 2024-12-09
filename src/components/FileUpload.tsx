import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

export function FileUpload({ onFileSelect, disabled }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (disabled) return;

    const validFiles = acceptedFiles.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`File "${file.name}" is too large. Maximum file size is 50MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      onFileSelect(validFiles);
    }
  }, [onFileSelect, disabled]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    disabled,
    maxSize: MAX_FILE_SIZE
  });

  return (
    <div className="space-y-4">
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
      <p className="text-sm text-primary/60 text-center">
        Maximum file size: 50MB
      </p>
    </div>
  );
}