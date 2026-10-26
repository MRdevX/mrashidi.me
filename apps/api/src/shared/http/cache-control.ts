import type { MiddlewareHandler } from "hono";

export function cacheControl(value: string): MiddlewareHandler {
  return async (c, next) => {
    await next();
    if (c.res.ok) {
      c.header("Cache-Control", value);
    }
  };
}
