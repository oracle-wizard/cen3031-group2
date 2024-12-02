import React from "react";
import { useNavigate } from "react-router-dom";

interface NavigateButtonProps {
  to: string; // Route to navigate to
  label: string; // Button text
  className?: string; // Optional additional CSS classes
}

const NavigateButton: React.FC<NavigateButtonProps> = ({ to, label, className = "" }) => {
  const navigate = useNavigate();

  if (location.pathname === '/dashboard') 
    return null;

  return (
    <button
      onClick={() => navigate(to)}
      className={`tw-bg-blue-500 tw-text-white tw-py-2 tw-px-4 tw-rounded tw-transition hover:tw-bg-blue-700 ${className}`}
    >
      {label}
    </button>
  );
};

export default NavigateButton;
