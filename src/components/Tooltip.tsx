import React, { useState } from 'react';

interface TooltipProps {
  content?: string;
  children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!content) return <>{children}</>;

  return (
    <div className="relative inline-block"
         onMouseEnter={() => setShowTooltip(true)}
         onMouseLeave={() => setShowTooltip(false)}>
      {children}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 
                      text-sm bg-dark-lighter text-primary rounded-lg shadow-lg 
                      border border-primary/20 whitespace-nowrap z-50">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 
                        border-4 border-transparent border-t-dark-lighter"></div>
        </div>
      )}
    </div>
  );
}