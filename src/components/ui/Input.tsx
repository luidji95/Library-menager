import React from 'react'

type InputProps = {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  className?: string;
  required?: boolean;
}


const Input = ({
  type = "text",
  value,
  onChange,
  placeholder = "",
  className = "",
  required = false,
}: InputProps) => {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      required={required}
      className={`email-input password-input ${className}`}
    />
  );
};

export default Input