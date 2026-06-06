import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ 
  name, 
  size = 16, 
  className = "", 
  strokeWidth = 1.5 
}) => {
  // Dynamically resolve icon component from lucide-react export namespace
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number; style?: React.CSSProperties }>>)[name];
  if (!IconComponent) return null;
  
  return (
    <IconComponent 
      size={size} 
      className={className} 
      strokeWidth={strokeWidth} 
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    />
  );
};
