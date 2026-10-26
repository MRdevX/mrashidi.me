import type { D1Migration } from "@cloudflare/vitest-pool-workers";
import type { Bindings } from "#bindings";

declare global {
  namespace Cloudflare {
    interface GlobalProps {
      mainModule: typeof import("../src/index.ts");
    }
    interface Env extends Bindings {
      TEST_MIGRATIONS: D1Migration[];
    }
  }
}
