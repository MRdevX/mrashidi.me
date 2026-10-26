export class ContentNotFoundError extends Error {
  constructor(what: string) {
    super(`${what} not found`);
    this.name = "ContentNotFoundError";
  }
}
