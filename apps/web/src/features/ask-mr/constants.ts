export const ASK_MR_NAME = "Ask MR";

/** Tool names shared by the server tool set, the system prompt and the UI card renderers. */
export const ASK_MR_TOOLS = {
  showProjects: "showProjects",
  contactHandoff: "contactHandoff",
  requestCv: "requestCv",
  getLatestPosts: "getLatestPosts",
  suggestFollowUps: "suggestFollowUps",
} as const;

export const ASK_MR_LIMITS = {
  maxMessageChars: 1000,
  /** Max prior messages sent to the model (older ones are dropped server-side). */
  maxHistoryMessages: 12,
  maxRequestMessages: 50,
  maxOutputTokens: 600,
  maxBlogPosts: 5,
  followUpCount: 3,
} as const;
