export class ContentNotFoundError extends Error {
  constructor(what: string) {
    super(`${what} not found`);
    this.name = "ContentNotFoundError";
  }
}

export function orNotFound<T>(value: T | null, what: string): T {
  if (value === null) {
    throw new ContentNotFoundError(what);
  }
  return value;
}
