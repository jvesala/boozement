import React from 'react';
import './Error.css';

interface ErrorProps {
  visible: boolean;
  text: string;
}

export const Error: React.FC<ErrorProps> = ({ visible, text }) => {
  return visible ? (
    <div className="Error">{text}</div>
  ) : (
    <div className="Error">&nbsp;</div>
  );
};
