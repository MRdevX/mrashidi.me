import { useState, useCallback, ChangeEvent, FormEvent } from "react";

interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  submitStatus: { type: "success" | "error" | null; message: string };
}

interface UseFormOptions<T> {
  initialData: T;
  validate: (data: T) => Partial<Record<keyof T, string>>;
  onSubmit: (data: T) => Promise<boolean>;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useForm<T extends Record<string, any>>({
  initialData,
  validate,
  onSubmit,
  onSuccess,
  onError,
}: UseFormOptions<T>) {
  const [state, setState] = useState<FormState<T>>({
    data: initialData,
    errors: {},
    isSubmitting: false,
    submitStatus: { type: null, message: "" },
  });

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      data: { ...prev.data, [name]: value },
      errors: { ...prev.errors, [name]: undefined },
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      setState((prev) => ({
        ...prev,
        submitStatus: { type: null, message: "" },
      }));

      const validationErrors = validate(state.data);
      if (Object.keys(validationErrors).length > 0) {
        setState((prev) => ({
          ...prev,
          errors: validationErrors,
        }));
        return;
      }

      setState((prev) => ({ ...prev, isSubmitting: true }));

      try {
        const success = await onSubmit(state.data);

        if (success) {
          setState((prev) => ({
            ...prev,
            data: initialData,
            submitStatus: {
              type: "success",
              message: "Form submitted successfully!",
            },
          }));
          onSuccess?.();
        } else {
          setState((prev) => ({
            ...prev,
            submitStatus: {
              type: "error",
              message: "Failed to submit form. Please try again.",
            },
          }));
          onError?.("Submission failed");
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          submitStatus: {
            type: "error",
            message: "Something went wrong. Please try again later.",
          },
        }));
        onError?.(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setState((prev) => ({ ...prev, isSubmitting: false }));
      }
    },
    [state.data, validate, onSubmit, onSuccess, onError, initialData]
  );

  const reset = useCallback(() => {
    setState({
      data: initialData,
      errors: {},
      isSubmitting: false,
      submitStatus: { type: null, message: "" },
    });
  }, [initialData]);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [field]: error },
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setState((prev) => ({ ...prev, errors: {} }));
  }, []);

  return {
    ...state,
    handleChange,
    handleSubmit,
    reset,
    setFieldError,
    clearErrors,
  };
}
