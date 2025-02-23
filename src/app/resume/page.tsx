export default function Resume() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Resume</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Work Experience</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold">Senior Backend Engineer</h3>
            <p className="text-gray-600 dark:text-gray-400">Tech Company • 2021 - Present</p>
            <ul className="list-disc pl-6 mt-2 text-gray-600 dark:text-gray-400">
              <li>Led the development of high-performance microservices</li>
              <li>Optimized database queries improving response times by 40%</li>
              <li>Implemented scalable event-driven architecture</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold">Software Engineer</h3>
            <p className="text-gray-600 dark:text-gray-400">Another Corp • 2018 - 2021</p>
            <ul className="list-disc pl-6 mt-2 text-gray-600 dark:text-gray-400">
              <li>Developed RESTful APIs serving millions of requests</li>
              <li>Designed and implemented caching solutions</li>
              <li>Contributed to CI/CD pipeline improvements</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Skills</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold mb-2">Languages</h3>
            <p className="text-gray-600 dark:text-gray-400">Go, Python, TypeScript, SQL</p>
          </div>

          <div>
            <h3 className="font-bold mb-2">Frameworks</h3>
            <p className="text-gray-600 dark:text-gray-400">Echo, FastAPI, Node.js, Express</p>
          </div>

          <div>
            <h3 className="font-bold mb-2">Databases</h3>
            <p className="text-gray-600 dark:text-gray-400">PostgreSQL, MongoDB, Redis</p>
          </div>

          <div>
            <h3 className="font-bold mb-2">Tools & Platforms</h3>
            <p className="text-gray-600 dark:text-gray-400">Docker, Kubernetes, AWS, Git</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Education</h2>

        <div>
          <h3 className="text-xl font-bold">B.Sc. in Computer Science</h3>
          <p className="text-gray-600 dark:text-gray-400">University Name • 2014 - 2018</p>
        </div>
      </section>
    </div>
  );
}
