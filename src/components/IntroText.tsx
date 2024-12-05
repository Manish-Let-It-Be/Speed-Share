import React, { useEffect, useState } from 'react';

export function IntroText() {
  const [visible, setVisible] = useState(false);
  const text = "Lightning-fast file sharing with end-to-end encryption";

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div className="text-center mb-8">
      <p className={`text-lg sm:text-xl text-primary/80 transition-all duration-1000 
                    ${visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
        {text}
      </p>
    </div>
  );
}