import React from 'react';

const Card = ({ children, title, className = '' }) => {
  return (
    <div
      className={`bg-card/50 backdrop-blur-glass border border-border rounded-xl shadow-glow ${className}`}
    >
      {title && (
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default Card;
