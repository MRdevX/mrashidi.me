"use client";

import { useEffect, useState } from "react";
import type { ContributionsResponse } from "./contributionCalendar";

const CONTRIBUTIONS_URL = "/api/github/contributions";

export function useContributions() {
  const [data, setData] = useState<ContributionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(CONTRIBUTIONS_URL)
      .then((r) => {
        if (!r.ok) {
          throw new Error(`HTTP ${r.status}`);
        }
        return r.json() as Promise<ContributionsResponse>;
      })
      .then((d) => {
        if (alive) {
          setData(d);
          setLoading(false);
        }
      })
      .catch(() => {
        if (alive) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  return { data, loading, error };
}
