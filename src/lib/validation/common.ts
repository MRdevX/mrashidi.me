/* eslint-disable @typescript-eslint/no-explicit-any */
export const validators = {
  required: (value: string, fieldName: string): string | undefined => {
    if (!value?.trim()) {
      return `${fieldName} is required`;
    }
    return undefined;
  },

  email: (value: string): string | undefined => {
    if (!value?.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    return undefined;
  },

  minLength: (value: string, minLength: number, fieldName: string): string | undefined => {
    if (value?.trim().length < minLength) {
      return `${fieldName} should be at least ${minLength} characters`;
    }
    return undefined;
  },

  maxLength: (value: string, maxLength: number, fieldName: string): string | undefined => {
    if (value?.trim().length > maxLength) {
      return `${fieldName} should be no more than ${maxLength} characters`;
    }
    return undefined;
  },

  url: (value: string, fieldName: string): string | undefined => {
    if (!value?.trim()) {
      return `${fieldName} is required`;
    }
    try {
      new URL(value);
      return undefined;
    } catch {
      return `Please enter a valid ${fieldName.toLowerCase()}`;
    }
  },
};

export const createValidator = <T extends Record<string, any>>(
  schema: Record<keyof T, Array<(value: any, fieldName: string) => string | undefined>>
) => {
  return (data: T): Partial<Record<keyof T, string>> => {
    const errors: Partial<Record<keyof T, string>> = {};

    Object.entries(schema).forEach(([field, validators]) => {
      const value = data[field as keyof T];
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1);

      for (const validator of validators) {
        const error = validator(value, fieldName);
        if (error) {
          errors[field as keyof T] = error;
          break;
        }
      }
    });

    return errors;
  };
};
