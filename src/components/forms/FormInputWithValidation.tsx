import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { FieldError, UseFormReturn, Path } from "react-hook-form";

interface FormInputWithValidationProps<T extends Record<string, unknown>> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  className?: string;
}

export default function FormInputWithValidation<T extends Record<string, unknown>>({
  form,
  name,
  label,
  type = "text",
  placeholder,
  required = true,
  multiline = false,
  rows = 4,
  disabled = false,
  className = "",
}: FormInputWithValidationProps<T>) {
  const {
    register,
    formState: { errors },
  } = form;

  const error = errors[name] as FieldError | undefined;
  const fieldId = `field-${name}`;
  const errorId = `${fieldId}-error`;

  const commonProps = {
    id: fieldId,
    placeholder,
    disabled,
    required,
    className: `w-full p-3 bg-gray-900/50 border rounded-md focus:ring-2 focus:outline-none transition-colors ${
      error ? "border-red-500 focus:ring-red-500/50" : "border-gray-700 focus:ring-orange-500/50 focus:border-orange-500"
    } ${className}`,
    "aria-required": required,
    "aria-describedby": error ? errorId : undefined,
    "aria-invalid": error ? true : false,
  } as const;

  const inputProps: InputHTMLAttributes<HTMLInputElement> = {
    ...commonProps,
    type,
  };

  const textareaProps: TextareaHTMLAttributes<HTMLTextAreaElement> = {
    ...commonProps,
    rows,
  };

  return (
    <div>
      <label htmlFor={fieldId} className="block mb-2 text-sm font-medium text-gray-200">
        {label} {required && <span className="text-orange-500">*</span>}
      </label>
      {multiline ? <textarea {...register(name)} {...textareaProps} /> : <input {...register(name)} {...inputProps} />}
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-500 animate-in fade-in duration-200">
          {error.message}
        </p>
      )}
    </div>
  );
}
