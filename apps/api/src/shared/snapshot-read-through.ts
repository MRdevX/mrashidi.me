export interface Timed<T> {
  data: T;
  fetchedAt: Date;
}

export type Background = (work: Promise<unknown>) => void;

export const SNAPSHOT_MAX_AGE_MS = 6 * 60 * 60 * 1000;

export interface ReadThroughOptions<T> {
  read: () => Promise<Timed<T> | null>;
  refresh: (now: Date) => Promise<T>;
  now: Date;
  background: Background;
}

export async function readThrough<T>({ read, refresh, now, background }: ReadThroughOptions<T>): Promise<T> {
  const snapshot = await read();
  if (!snapshot) {
    return refresh(now);
  }
  if (now.getTime() - snapshot.fetchedAt.getTime() >= SNAPSHOT_MAX_AGE_MS) {
    background(refresh(now).catch((error) => console.error(error)));
  }
  return snapshot.data;
}
