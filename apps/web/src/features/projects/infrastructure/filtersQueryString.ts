import { DEFAULT_FILTERS, PROJECT_TYPE_FILTERS, type ProjectFilters } from "../domain/filters";
import { PROJECT_SORTS } from "../domain/sort";

const oneOf = <T extends string>(options: readonly T[], value: string | null, fallback: T): T =>
  options.includes(value as T) ? (value as T) : fallback;

export const parseFilters = (search: string): ProjectFilters => {
  const params = new URLSearchParams(search);
  const stacks = (params.get("stack") ?? "")
    .split(",")
    .map((tech) => tech.trim())
    .filter(Boolean);

  return {
    query: params.get("q") ?? "",
    type: oneOf(PROJECT_TYPE_FILTERS, params.get("type"), DEFAULT_FILTERS.type),
    openSourceOnly: params.get("oss") === "1",
    stacks: [...new Set(stacks)],
    sort: oneOf(PROJECT_SORTS, params.get("sort"), DEFAULT_FILTERS.sort),
  };
};

export const serializeFilters = ({ query, type, openSourceOnly, stacks, sort }: ProjectFilters): string => {
  const entries: [string, string | false][] = [
    ["q", query.trim() !== "" && query],
    ["type", type !== DEFAULT_FILTERS.type && type],
    ["oss", openSourceOnly && "1"],
    ["stack", stacks.length > 0 && stacks.join(",")],
    ["sort", sort !== DEFAULT_FILTERS.sort && sort],
  ];
  const params = new URLSearchParams(entries.filter((entry): entry is [string, string] => Boolean(entry[1])));
  const search = params.toString();
  return search ? `?${search}` : "";
};
