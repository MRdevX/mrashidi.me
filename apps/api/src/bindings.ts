export interface Bindings {
  DB: D1Database;
  CONTENT_API_TOKEN: string;
  ALLOWED_ORIGINS: string;
}

export interface HonoEnv {
  Bindings: Bindings;
}
