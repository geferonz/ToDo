import React from 'react';
import './button.css';

export interface ButtonProps {
  id?: string,
  className?: string,
  title?: string,
  type: "button" | "submit",
  children: string | React.ReactNode,
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

function Button({id, className, title, type, children, onClick}: ButtonProps) {
  return (
    <button type={type} id={id} className={`button ${className}`} onClick={onClick} title={title}>{children}</button>
  );
}

export default Button;
