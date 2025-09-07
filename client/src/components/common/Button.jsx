const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    outline: 'btn-outline',
    danger: 'btn-danger'
  };

  return (
    <button className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;