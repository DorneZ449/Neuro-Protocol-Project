import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';

  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'bg-danger-500 text-white hover:bg-danger-600 focus:ring-danger-500 shadow-sm',
    success: 'bg-success-500 text-white hover:bg-success-600 focus:ring-success-500 shadow-sm',
    ghost: 'text-app hover:bg-surface focus:ring-primary',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
  };

  return (
    <motion.button
      whileHover={{ 
        scale: disabled || loading ? 1 : 1.03, 
        y: disabled || loading ? 0 : -2 
      }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      transition={{ 
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Загрузка...</span>
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </motion.button>
  );
};
