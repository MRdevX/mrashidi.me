import { z } from "zod";

const PRIVATE_DETAILS: readonly [RegExp, string][] = [
  [/\+\d[\d\s]{7,}/, "phone number"],
  [/@gmail\.com/i, "personal email"],
  [/blue card|visa|residence permit/i, "residence or visa status"],
  [/salary|€|\$\d/i, "compensation"],
];

export const AskMrKnowledgeSchema = z
  .object({
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
  })
  .superRefine((knowledge, ctx) => {
    const serialized = JSON.stringify(knowledge);
    for (const [pattern, label] of PRIVATE_DETAILS) {
      if (pattern.test(serialized)) {
        ctx.addIssue({ code: "custom", message: `Ask MR knowledge must not contain a ${label}` });
      }
    }
    if (knowledge.workAuthorization !== "") {
      ctx.addIssue({ code: "custom", path: ["workAuthorization"], message: "workAuthorization stays empty" });
    }
  });

export type AskMrKnowledge = z.infer<typeof AskMrKnowledgeSchema>;

export const KnowledgeContextSchema = z.object({ context: z.string().min(1) });

export type KnowledgeContext = z.infer<typeof KnowledgeContextSchema>;
