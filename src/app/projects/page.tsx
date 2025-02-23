const projects = [
  {
    title: "Distributed Cache System",
    description: "A high-performance distributed caching system built with Go",
    tech: ["Go", "Redis", "gRPC", "Docker"],
    link: "#",
  },
  {
    title: "API Gateway",
    description: "A scalable API gateway with rate limiting and auth middleware",
    tech: ["TypeScript", "Node.js", "Redis", "PostgreSQL"],
    link: "#",
  },
  {
    title: "Data Pipeline Framework",
    description: "ETL framework for processing large-scale data streams",
    tech: ["Python", "Apache Kafka", "Elasticsearch"],
    link: "#",
  },
  {
    title: "Microservices Platform",
    description: "Cloud-native microservices infrastructure with service mesh",
    tech: ["Go", "Kubernetes", "Istio", "AWS"],
    link: "#",
  },
];

export default function Projects() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Projects</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-2">{project.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech, techIndex) => (
                <span key={techIndex} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
