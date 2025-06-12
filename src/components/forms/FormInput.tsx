import { ChangeEvent, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface FormInputProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
}

export default function FormInput({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required = true,
  multiline = false,
}: FormInputProps) {
  const commonProps = {
    id,
    name,
    value,
    onChange,
    placeholder,
    required,
    className: `w-full p-3 bg-gray-900/50 border rounded-md focus:ring-2 focus:outline-none ${
      error 
        ? "border-red-500 focus:ring-red-500/50" 
        : "border-gray-700 focus:ring-orange-500/50 focus:border-orange-500"
    }`,
    'aria-required': required,
    'aria-describedby': error ? `${id}-error` : undefined,
  } as const;

  const inputProps: InputHTMLAttributes<HTMLInputElement> = {
    ...commonProps,
    type,
    'aria-invalid': error ? true : false,
  };

  const textareaProps: TextareaHTMLAttributes<HTMLTextAreaElement> = {
    ...commonProps,
    rows: 4,
    'aria-invalid': error ? true : false,
  };

  return (
    <div>
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-200">
        {label} {required && <span className="text-orange-500">*</span>}
      </label>
      {multiline ? (
        <textarea {...textareaProps} />
      ) : (
        <input {...inputProps} />
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
} 