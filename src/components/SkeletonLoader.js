import React from 'react';

const SkeletonLoader = ({ width, height, borderRadius, style, count = 1, inline = false }) => {
  const elements = [];
  
  for (let i = 0; i < count; i++) {
    elements.push(
      <div 
        key={i} 
        className="skeleton-loader"
        style={{
          width: width || '100%',
          height: height || '20px',
          borderRadius: borderRadius || '8px',
          display: inline ? 'inline-block' : 'block',
          marginBottom: inline ? '0' : '0.5rem',
          ...style
        }}
      />
    );
  }

  return <>{elements}</>;
};

export default SkeletonLoader;
