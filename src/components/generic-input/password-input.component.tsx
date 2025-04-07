import { FiEye, FiEyeOff } from "react-icons/fi";
import React, { useState } from "react";

interface PasswordInputProps {
  label: string;
  value: string;
  id?:string
  onChange: (value: string) => void;
  error?: string; // Optional prop for error message
}

const PasswordInput: React.FC<PasswordInputProps> = ({ label, value, onChange, error, id="" }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Custom password visibility toggle
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Disable default browser password visibility toggle
  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  return (
    <div>
      <label htmlFor="password" className="block text-xs font-bold text-dark/80">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          value={value}
          required
          onChange={(e) => onChange(e.target.value)}
          placeholder={`${label.toLowerCase()}`}
          className={`mt-1 block w-full px-3 py-[0.6rem] rounded-lg bg-black/5 text-black text-sm font-semibold placeholder:text-black/60 sm:text-sm ${
            error ? "border-red-500" : "border-black/20"
          }`}
        />
        <button
          type="button"
          onMouseDown={handleMouseDown}
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          {showPassword ? (
            <FiEyeOff className="h-5 w-5 text-gray-400" />
          ) : (
            <FiEye className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default PasswordInput;