export interface Bindings {
  DB: D1Database;
  CONTENT_API_TOKEN: string;
  GH_API_TOKEN: string;
}

export interface HonoEnv {
  Bindings: Bindings;
}
