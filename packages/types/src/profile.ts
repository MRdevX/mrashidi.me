import { z } from "zod";

export const ProfileSchema = z.object({
  person: z.object({
    name: z.string().min(1),
    title: z.string().min(1),
    location: z.string(),
    email: z.email(),
    website: z.url(),
    twitterHandle: z.string(),
  }),
  social: z.object({
    github: z.url(),
    linkedin: z.url(),
    telegram: z.url(),
    githubRepo: z.url(),
  }),
  site: z.object({
    name: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    keywords: z.string(),
  }),
});

export type Profile = z.infer<typeof ProfileSchema>;

export const firstName = (profile: Profile): string => profile.person.name.split(" ")[0];
