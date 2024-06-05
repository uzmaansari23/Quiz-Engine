import React from 'react';
import Button from './Button';

const InputField = (props) => {
  const {
    label,
    type,
    id,
    placeholder,
    value,
    onChange,
    options
  } = props;

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}:</label>
      {type === 'select' ? (
        <select
          className="form-select"
          id={id}
          value={value}
          onChange={onChange}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          className="form-control"
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
        />
      )}
    </div>
  );
};

export default InputField;
