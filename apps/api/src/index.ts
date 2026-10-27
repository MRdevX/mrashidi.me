import app from "#app";
import type { Bindings } from "#bindings";
import { refreshExternalSources } from "./scheduled.ts";

export default {
  fetch: app.fetch,
  scheduled: (controller, env) => refreshExternalSources(env, new Date(controller.scheduledTime)),
} satisfies ExportedHandler<Bindings>;
