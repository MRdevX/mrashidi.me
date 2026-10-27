import app from "#app";
import type { Bindings } from "#bindings";

export default {
  fetch: app.fetch,
} satisfies ExportedHandler<Bindings>;
