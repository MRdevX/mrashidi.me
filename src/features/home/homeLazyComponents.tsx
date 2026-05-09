"use client";

import { lazy } from "react";

export const LazyContributionGraph = lazy(() =>
  import("@/components/ui/ContributionGraph").then((m) => ({
    default: m.ContributionGraph,
  }))
);

export const LazyTerminal = lazy(() =>
  import("@/components/terminal/Terminal").then((m) => ({
    default: m.Terminal,
  }))
);

export const LazyLoaderComponent = lazy(() =>
  import("@/components/ui").then((m) => ({
    default: m.LazyLoader,
  }))
);

export const LazyTechStackGrid = lazy(() =>
  import("@/components/ui").then((m) => ({
    default: m.TechStackGrid,
  }))
);
