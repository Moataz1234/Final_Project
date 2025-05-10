import React from 'react';

const ErrorMessage = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <div className="error-message">
      {error}
      <button type="button" onClick={onClose} aria-label="Close error">
        ×
      </button>
    </div>
  );
};

export default ErrorMessage;