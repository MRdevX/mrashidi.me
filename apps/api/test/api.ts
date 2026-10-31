import { exports } from "cloudflare:workers";

const CONTENT_TOKEN = "test-token";

export const api = (path: string, init?: RequestInit) => exports.default.fetch(`https://api.test${path}`, init);

export const authedApi = (path: string) => api(path, { headers: { Authorization: `Bearer ${CONTENT_TOKEN}` } });
