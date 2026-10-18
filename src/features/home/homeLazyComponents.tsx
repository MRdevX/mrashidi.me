"use client";

import { lazy } from "react";

export const LazyContributionGraph = lazy(() =>
  import("./ContributionGraph").then((m) => ({
    default: m.ContributionGraph,
  }))
);

export const LazyTerminal = lazy(() =>
  import("./terminal/Terminal").then((m) => ({
    default: m.Terminal,
  }))
);

export const LazyLoaderComponent = lazy(() =>
  import("./LazyLoader").then((m) => ({
    default: m.LazyLoader,
  }))
);

export const LazyTechStackGrid = lazy(() =>
  import("./TechStackGrid").then((m) => ({
    default: m.TechStackGrid,
  }))
);
