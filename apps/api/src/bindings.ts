export interface Bindings {
  DB: D1Database;
  AI: Ai;
  CONTENT_API_TOKEN: string;
  CONTENT_API_READ_TOKEN?: string;
  GH_API_TOKEN: string;
  RESEND_API_TOKEN: string;
  MAIL_FROM: string;
  MAIL_TO: string;
}

export interface HonoEnv {
  Bindings: Bindings;
}
