import { z } from "zod";

export const AskMrKnowledgeSchema = z.object({
  roleNotes: z.array(z.object({ company: z.string().min(1), highlights: z.array(z.string()) })),
  hiddenRoles: z.array(z.string()),
  availability: z.string(),
  remote: z.string(),
  relocation: z.string(),
  workAuthorization: z.string(),
  preferredRoles: z.array(z.string()),
  interests: z.array(z.string()),
  workingStyle: z.array(z.string()),
  funFacts: z.array(z.string()),
  extraProjects: z.array(
    z.object({ title: z.string().min(1), year: z.string(), summary: z.string(), stack: z.array(z.string()) })
  ),
  extraSkills: z.array(z.string()),
  faq: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) })),
});

export type AskMrKnowledge = z.infer<typeof AskMrKnowledgeSchema>;
