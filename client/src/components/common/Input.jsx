const Input = ({ label, error, required = false, className = '', ...props }) => {
  return (
    <div className="form-group">
      {label && <label className="label"> {label} {required && <span className="text-red-500">*</span>} </label>}
      <input className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`} {...props} />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;