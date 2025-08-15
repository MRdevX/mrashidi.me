import { CyberpunkTimeline } from "@/components/ui";
import workExperience from "@/data/workExperience";

const timelineItems = workExperience.map((job) => ({
  title: job.title,
  company: job.company,
  location: job.location,
  period: job.period,
  description: job.achievements,
  technologies: [],
}));

export default function ExperienceTimeline() {
  return <CyberpunkTimeline items={timelineItems} />;
}
