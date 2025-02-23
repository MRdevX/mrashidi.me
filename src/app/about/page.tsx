export default function About() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">About Me</h1>

        <div className="prose dark:prose-invert max-w-none">
          <section className="mb-12">
            <p className="text-lg mb-6">
              Software Engineer with 9+ years of experience in scalable Backend Development, with a primary focus on Node.js
              and TypeScript for the past 5+ years. Specialized in cloud native applications, microservices architecture, and
              DevOps practices. Proven expertise in optimizing cloud infrastructure, improving system reliability, and
              delivering high-impact solutions.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Technical Expertise</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Backend Development</h3>
                <p>Node.js, TypeScript, NestJS, Express.js, RESTful APIs</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Cloud & DevOps</h3>
                <p>Azure, Kubernetes, Docker, GitLab CI/CD, AWS, GCP, Terraform</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Architecture</h3>
                <p>Microservices, Event-Driven Architecture, Domain-Driven Design (DDD)</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Databases</h3>
                <p>PostgreSQL, MongoDB, Redis, TypeORM, Mongoose, Prisma</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Languages</h2>
            <ul className="list-none grid grid-cols-1 md:grid-cols-2 gap-4">
              <li>Persian - Native Proficiency</li>
              <li>English - Fluent (C1)</li>
              <li>German - Pre-Intermediate (A2)</li>
              <li>Turkish - Elementary (A1)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Education</h2>
            <div>
              <h3 className="text-xl font-semibold">B.Sc. in Computer Software Engineering</h3>
              <p className="text-gray-600 dark:text-gray-400">Bu-Ali Sina University, Hamedan, Iran</p>
              <p className="text-gray-600 dark:text-gray-400">Sep 2011 – Sep 2015</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
