export const validCommands = [
  "help",
  "about",
  "skills",
  "projects",
  "experience",
  "achievements",
  "contact",
  "blog",
  "view-source",
  "clear",
] as const;

export const invalidCommands = ["invalid", "random", "test", "xyz", "help me", "help-command", "help123"] as const;
