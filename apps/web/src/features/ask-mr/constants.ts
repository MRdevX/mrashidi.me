export const ASK_MR_NAME = "Ask MR";

export const ASK_MR_TOOLS = {
  showProjects: "showProjects",
  contactHandoff: "contactHandoff",
  requestCv: "requestCv",
  getLatestPosts: "getLatestPosts",
  suggestFollowUps: "suggestFollowUps",
} as const;

export const ASK_MR_LIMITS = {
  maxMessageChars: 1000,
  maxHistoryMessages: 12,
  maxRequestMessages: 50,
  maxOutputTokens: 600,
  maxBlogPosts: 5,
  followUpCount: 3,
} as const;
