export default function Resume() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Professional Experience</h1>
          <a
            href="/Mahdi_Rashidi_Resume.pdf"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
            target="_blank"
          >
            Download PDF
          </a>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Work Experience</h2>

            <div className="mb-8">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">Software Architect Technical Lead</h3>
                <span className="text-gray-600 dark:text-gray-400">Mar 2022 – Jan 2025</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Fakir Technology Consultants GmbH (inno2fleet E-Mobility Services) - Berlin, Germany (Remote)
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Developed and maintained multiple backend microservices within the Inno2Fleet platform using NestJS and
                  Typescript
                </li>
                <li>Designed and implemented Azure cloud infrastructure (AKS) for inno2fleet services</li>
                <li>
                  Scaled system to support 1,500+ European charging stations, processing 20,000+ monthly charging sessions
                </li>
                <li>Led GDPR-compliant cloud migration from GCP to Azure, ensuring data protection compliance</li>
                <li>
                  Reduced cloud costs by 45% (€5,000 → €2,720/month) through automated scaling and resource optimization
                </li>
                <li>Implemented Kubernetes with GitOps workflows on AKS, achieving 35% faster API response times</li>
              </ul>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">Senior Backend Engineer</h3>
                <span className="text-gray-600 dark:text-gray-400">Mar 2021 – Jan 2025</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Fakir Technology Consultants GmbH (inno2fleet E-Mobility Services) - Berlin, Germany (Remote)
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Built fleet eConsultant analysis platform using NestJS/TypeScript</li>
                <li>Delivered real-time decision-making tools for clients</li>
                <li>Improved system reliability 30% by transitioning message queue system from Redis to RabbitMQ</li>
                <li>Enhanced code quality through test automation with Jest framework</li>
                <li>Increased test coverage up to 65% across core services</li>
              </ul>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">Lead Backend Engineer</h3>
                <span className="text-gray-600 dark:text-gray-400">May 2020 – Apr 2021</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Mehrpardaz (Flight Operations Platform) - Tehran, Iran (Remote)
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Developed backend system for aviation iPadOS app enabling real-time flight operations</li>
                <li>Created modular architecture patterns for authentication, logging, and error handling</li>
                <li>Integrated flight tracking and weather data services including OpenWeatherMap API</li>
                <li>Established engineering best practices including code reviews and CI/CD workflows</li>
              </ul>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">Backend Developer</h3>
                <span className="text-gray-600 dark:text-gray-400">Feb 2020 – May 2020</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-3">Finnotech (Open Banking Platform) - Tehran, Iran</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Refactored authentication service for banking systems with enhanced security measures</li>
                <li>Implemented rate limiting and error logging for improved system reliability</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Recent Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Cloud & DevOps</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Introduction to Generative AI by Google Cloud (2024)</li>
                  <li>Advanced Terraform (2024)</li>
                  <li>Microservices: Security (2024)</li>
                  <li>Azure Administration Essential Training (2024)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Backend Development</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Building High-Throughput Data Microservices (2024)</li>
                  <li>Object-Oriented Programming in JavaScript</li>
                  <li>REST APIs with Flask and Python</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
