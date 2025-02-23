const posts = [
  {
    title: "Building Scalable Backend Systems with Go",
    date: "2024-03-15",
    summary: "Learn how to design and implement scalable backend systems using Go and modern architecture patterns.",
    readTime: "8 min read",
  },
  {
    title: "Microservices vs Monoliths: A Practical Guide",
    date: "2024-03-01",
    summary: "An in-depth comparison of microservices and monolithic architectures, with real-world examples.",
    readTime: "10 min read",
  },
  {
    title: "Advanced PostgreSQL Performance Tuning",
    date: "2024-02-15",
    summary: "Tips and techniques for optimizing PostgreSQL performance in high-load applications.",
    readTime: "12 min read",
  },
  {
    title: "Understanding Distributed Systems",
    date: "2024-02-01",
    summary: "A comprehensive guide to distributed systems concepts and implementation.",
    readTime: "15 min read",
  },
];

export default function Blog() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>

      <div className="space-y-8">
        {posts.map((post, index) => (
          <article key={index} className="border-b border-gray-200 dark:border-gray-800 pb-8">
            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
            <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <span>{post.date}</span>
              <span>{post.readTime}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{post.summary}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
