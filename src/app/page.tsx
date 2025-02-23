import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Mohammad Reza Ashidi</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">Backend Developer & Software Engineer</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <Link
            href="/projects"
            className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors"
          >
            <h2 className="text-2xl font-bold mb-2">Projects →</h2>
            <p className="text-gray-600 dark:text-gray-400">Check out my latest work and side projects</p>
          </Link>

          <Link
            href="/blog"
            className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors"
          >
            <h2 className="text-2xl font-bold mb-2">Blog →</h2>
            <p className="text-gray-600 dark:text-gray-400">Technical articles and thoughts on software development</p>
          </Link>

          <Link
            href="/about"
            className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors"
          >
            <h2 className="text-2xl font-bold mb-2">About →</h2>
            <p className="text-gray-600 dark:text-gray-400">Learn more about my background and experience</p>
          </Link>

          <Link
            href="/resume"
            className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors"
          >
            <h2 className="text-2xl font-bold mb-2">Resume →</h2>
            <p className="text-gray-600 dark:text-gray-400">View my professional experience and skills</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
