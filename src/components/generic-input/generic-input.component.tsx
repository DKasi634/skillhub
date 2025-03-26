import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type: string;
  value: any;
  name:string,
  id?:string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
}

const GenericInput: React.FC<InputProps> = ({
  label,
  type,
  value,
  onChange,
  error,
  placeholder,
  id,
  name, ...rest
}) => {
  return (
    <div>
      <label className="block text-xs font-bold text-dark/80">{label}</label>
      <input
        type={type}
        value={value}
        id={id || name}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        {...rest}
        className={`mt-1 block w-full px-3 py-[0.6rem] rounded-lg bg-black/5 text-black text-sm font-semibold placeholder:text-gray-500 sm:text-sm ${
          error ? "border-red-500" : "border-black/20"
        }`}
      />
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
};

export default GenericInput;