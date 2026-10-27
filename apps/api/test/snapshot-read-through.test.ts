import { describe, expect, it, vi } from "vitest";
import { readThrough, SNAPSHOT_MAX_AGE_MS, type Timed } from "#shared/snapshot-read-through.ts";

const NOW = new Date("2026-03-04T05:00:00Z");
const ago = (ms: number) => new Date(NOW.getTime() - ms);

function setup(snapshot: Timed<string> | null, refresh = vi.fn(async () => "new")) {
  const queued: Promise<unknown>[] = [];
  const result = readThrough({
    read: async () => snapshot,
    refresh,
    now: NOW,
    background: (work) => queued.push(work),
  });
  return { result, refresh, queued };
}

describe("readThrough", () => {
  it("fetches inline when there is no snapshot", async () => {
    const { result, refresh, queued } = setup(null);

    await expect(result).resolves.toBe("new");
    expect(refresh).toHaveBeenCalledWith(NOW);
    expect(queued).toHaveLength(0);
  });

  it("serves a fresh snapshot without refreshing", async () => {
    const { result, refresh, queued } = setup({ data: "old", fetchedAt: ago(SNAPSHOT_MAX_AGE_MS - 1) });

    await expect(result).resolves.toBe("old");
    expect(refresh).not.toHaveBeenCalled();
    expect(queued).toHaveLength(0);
  });

  it("serves a stale snapshot at once and refreshes it in the background", async () => {
    const { result, refresh, queued } = setup({ data: "old", fetchedAt: ago(SNAPSHOT_MAX_AGE_MS) });

    await expect(result).resolves.toBe("old");
    expect(refresh).toHaveBeenCalledWith(NOW);
    expect(queued).toHaveLength(1);
  });

  it("logs a failed background refresh instead of rejecting", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const failing = vi.fn(async (): Promise<string> => {
      throw new Error("source down");
    });
    const { result, queued } = setup({ data: "old", fetchedAt: ago(SNAPSHOT_MAX_AGE_MS) }, failing);

    await expect(result).resolves.toBe("old");
    await expect(Promise.all(queued)).resolves.toBeDefined();
    expect(error).toHaveBeenCalledWith(expect.objectContaining({ message: "source down" }));
  });

  it("fails when there is no snapshot and the refresh fails", async () => {
    const { result } = setup(
      null,
      vi.fn(async (): Promise<string> => {
        throw new Error("source down");
      })
    );

    await expect(result).rejects.toThrow("source down");
  });
});
