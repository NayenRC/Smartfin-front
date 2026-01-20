import React from 'react';

const Input = ({
  label,
  type = 'text',
  id,
  value,
  onChange,
  placeholder,
  error,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default Input;
