const defaults = (name: string) => [
  `What does ${name} work on these days?`,
  "What's his strongest tech stack?",
  "Tell me about a project he led",
  "What kind of systems has he built?",
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
    "What was his most recent role?",
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
  "/contact": [
    "What does he specialise in?",
    "Which industries has he worked in?",
    "What's the best way to reach him?",
  ],
};

export function starterQuestions(pathname: string | null, name: string): string[] {
  const route = pathname ? `/${pathname.split("/")[1] ?? ""}` : "/";
  return BY_ROUTE[route] ?? defaults(name);
}
