import { CyberpunkExperienceCard, CyberpunkTimeline } from "@/components/ui";
import workExperience from "@/data/workExperience";

const timelineItems = workExperience.map((job) => ({
  title: job.title,
  company: job.company,
  location: job.location,
  period: job.period,
  description: job.achievements,
  technologies: [],
}));

export default function ExperienceDemoPage() {
  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-500 font-cyberpunk glow-text mb-4">Modern Experience Components</h1>
          <p className="text-gray-400 text-lg">Enhanced with shadcn/ui and cyberpunk styling</p>
        </div>

        {/* Experience Cards Demo */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-orange-500 font-cyberpunk glow-text mb-8 text-center">
            Expandable Experience Cards
          </h2>
          <div className="space-y-6">
            {workExperience.slice(0, 3).map((job, index) => (
              <CyberpunkExperienceCard
                key={`${job.company}-${job.title}`}
                title={job.title}
                company={job.company}
                location={job.location}
                period={job.period}
                achievements={job.achievements}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* Timeline Demo */}
        <section>
          <h2 className="text-2xl font-bold text-orange-500 font-cyberpunk glow-text mb-8 text-center">
            Interactive Timeline
          </h2>
          <CyberpunkTimeline items={timelineItems.slice(0, 4)} />
        </section>
      </div>
    </div>
  );
}
