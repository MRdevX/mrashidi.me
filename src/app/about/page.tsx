export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">About Me</h1>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg mb-6">
          Hi! I'm Mohammad Reza, a backend developer and software engineer with over 8 years of experience building scalable
          applications and distributed systems.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Background</h2>
        <p className="mb-6">
          I specialize in designing and implementing high-performance backend systems, with expertise in Go, Python, and
          TypeScript. My experience includes working with microservices, cloud infrastructure, and database optimization.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Technical Skills</h2>
        <ul className="list-disc pl-6 mb-6">
          <li>Backend Development: Go, Python, Node.js</li>
          <li>Databases: PostgreSQL, MongoDB, Redis</li>
          <li>Cloud & DevOps: AWS, Docker, Kubernetes</li>
          <li>Web Technologies: REST APIs, GraphQL</li>
          <li>Tools: Git, Linux, CI/CD</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Interests</h2>
        <p className="mb-6">
          Outside of coding, I enjoy contributing to open-source projects, writing technical articles, and staying up-to-date
          with the latest developments in software engineering.
        </p>
      </div>
    </div>
  );
}
