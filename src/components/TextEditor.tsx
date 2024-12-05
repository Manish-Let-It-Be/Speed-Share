import React from 'react';

interface TextEditorProps {
  value: string;
  onChange: (text: string) => void;
}

export function TextEditor({ value, onChange }: TextEditorProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-48 p-4 bg-dark-lighter border border-primary/20 rounded-lg 
                 text-primary placeholder-primary/40 focus:ring-2 focus:ring-primary focus:border-transparent
                 resize-none"
      placeholder="Enter your text here..."
    />
  );
}