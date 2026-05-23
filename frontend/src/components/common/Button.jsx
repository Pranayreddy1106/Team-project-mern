export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const baseClasses = 'rounded-xl font-semibold transition';

  const variants = {
    primary: 'bg-primary hover:bg-purple-700 text-white',
    secondary: 'border border-border hover:border-primary text-white',
    dark: 'bg-dark border border-border hover:border-primary',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}