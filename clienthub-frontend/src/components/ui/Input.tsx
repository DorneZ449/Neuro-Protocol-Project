import React from 'react';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {label && (
        <label className="block text-sm font-medium text-app mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <motion.div 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {icon}
          </motion.div>
        )}
        <input
          className={`input ${icon ? 'pl-10' : ''} ${error ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="text-danger-600 text-sm mt-1.5 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </motion.p>
      )}
      {helperText && !error && (
        <p className="text-muted text-sm mt-1.5">{helperText}</p>
      )}
    </motion.div>
  );
};
