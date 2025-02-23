import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Mahdi Rashidi</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
            Senior Backend Engineer • Cloud & DevOps Practitioner
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-500 mb-4">Istanbul, Turkey</p>
          <div className="flex justify-center space-x-6 mb-6">
            <a
              href="mailto:m8rashidi@gmail.com"
              className="text-gray-600 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400"
            >
              <span>📧 Email</span>
            </a>
            <a
              href="https://github.com/mrdevx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400"
            >
              <span>GitHub</span>
            </a>
            <a
              href="https://linkedin.com/in/mrdevx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400"
            >
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <Link
            href="/projects"
            className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors"
          >
            <h2 className="text-2xl font-bold mb-2">Projects →</h2>
            <p className="text-gray-600 dark:text-gray-400">Cloud-native and scalable solutions I've built</p>
          </Link>

          <Link
            href="/blog"
            className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors"
          >
            <h2 className="text-2xl font-bold mb-2">Blog →</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Articles on backend development, cloud architecture, and DevOps
            </p>
          </Link>

          <Link
            href="/about"
            className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors"
          >
            <h2 className="text-2xl font-bold mb-2">About →</h2>
            <p className="text-gray-600 dark:text-gray-400">9+ years of experience in scalable backend development</p>
          </Link>

          <Link
            href="/resume"
            className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors"
          >
            <h2 className="text-2xl font-bold mb-2">Resume →</h2>
            <p className="text-gray-600 dark:text-gray-400">My professional journey and technical expertise</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
