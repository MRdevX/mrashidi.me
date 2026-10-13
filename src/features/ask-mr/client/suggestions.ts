const DEFAULT = [
  "What does Mahdi work on these days?",
  "What's his strongest tech stack?",
  "Tell me about a project he led",
  "Is he open to new opportunities?",
];

const BY_ROUTE: Record<string, string[]> = {
  "/projects": [
    "What's his most complex project?",
    "Which projects are open source?",
    "Show me his Kubernetes work",
    "What has he built with NestJS?",
  ],
  "/resume": [
    "Summarize his leadership experience",
    "What did he do at inno2fleet?",
    "Which industries has he worked in?",
    "Can I get his CV?",
  ],
  "/about": [
    "What languages does he speak?",
    "Where did he study?",
    "What's he proficient in?",
    "How does he like to work?",
  ],
  "/blog": ["What does he write about?", "Show me his latest posts", "What's his strongest tech stack?"],
  "/contact": ["How can I hire him?", "Is he open to freelance work?", "What's the best way to reach him?"],
};

export function starterQuestions(pathname: string | null): string[] {
  const route = pathname ? `/${pathname.split("/")[1] ?? ""}` : "/";
  return BY_ROUTE[route] ?? DEFAULT;
}
