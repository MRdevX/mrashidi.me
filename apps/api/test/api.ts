import { exports } from "cloudflare:workers";

export const api = (path: string, init?: RequestInit) => exports.default.fetch(`https://api.test${path}`, init);
