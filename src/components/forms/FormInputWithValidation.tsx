import { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";
import { FieldError, UseFormReturn, Path } from "react-hook-form";
import { CyberpunkInput, CyberpunkTextarea } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useThemeConfig } from "@/hooks/useThemeConfig";

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
  icon?: ReactNode;
}

export function FormInputWithValidation<T extends Record<string, unknown>>({
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
  icon,
}: FormInputWithValidationProps<T>) {
  const { getTextColor } = useThemeConfig();

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
      <label htmlFor={fieldId} className={`block mb-2 text-sm font-medium ${getTextColor("primary")}`}>
        {label} {required && <span className="text-orange-500">*</span>}
      </label>
      {multiline ? (
        <div className="relative">
          {icon && (
            <div className={`absolute left-3 top-3 ${getTextColor("secondary")} pointer-events-none z-10`}>{icon}</div>
          )}
          <CyberpunkTextarea
            {...register(name)}
            {...textareaProps}
            error={!!error}
            className={cn(className, icon && "pl-10")}
          />
        </div>
      ) : (
        <CyberpunkInput {...register(name)} {...inputProps} error={!!error} icon={icon} className={className} />
      )}
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-500 animate-in fade-in duration-200">
          {error.message}
        </p>
      )}
    </div>
  );
}
