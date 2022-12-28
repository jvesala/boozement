import React from 'react';
import './Button.css';

interface ButtonProps {
  onClick: any;
  disabled: boolean;
  text: string;
}

export const Button: React.FC<ButtonProps> = ({ onClick, disabled, text }) => {
  return (
    <button
      className="Button"
      type="submit"
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};
