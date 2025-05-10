import React from 'react';

const FormInput = ({ label, type = 'text', name, value, onChange, required = false, autoComplete }) => {
  return (
    <div className="input-group">
      <input
        type={type}
        name={name}
        className="input"
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        placeholder=" "
      />
      <span className="input-label">{label}</span>
    </div>
  );
};

export default FormInput;