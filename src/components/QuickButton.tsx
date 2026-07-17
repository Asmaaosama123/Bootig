import React, { useState, useCallback, ReactNode, MouseEvent } from 'react';

interface QuickButtonProps {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  cooldown?: number; // ms
  type?: 'button' | 'submit' | 'reset';
  title?: string;
}

const QuickButton: React.FC<QuickButtonProps> = ({
  onClick,
  children,
  className = '',
  disabled = false,
  cooldown = 150, // small cooldown for snappy feel
  type = 'button',
  title,
}) => {
  const [cooling, setCooling] = useState(false);

  const handle = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    if (disabled || cooling) return;
    setCooling(true);
    try {
      onClick?.(e);
    } finally {
      window.setTimeout(() => setCooling(false), cooldown);
    }
  }, [onClick, disabled, cooling, cooldown]);

  return (
    <button
      type={type}
      onMouseDown={handle}
      onClick={(e) => e.preventDefault()}
      disabled={disabled || cooling}
      title={title}
      className={`${className} transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:pointer-events-none`}
    >
      {children}
    </button>
  );
};

export default QuickButton;
