"use client";

export function AdminAnalytics() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-cyberpunk text-neon-orange mb-2">Analytics</h1>
        <p className="text-gray-300">Website performance and user analytics</p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-primary/20 rounded-lg p-6 glass-card">
          <p className="text-sm text-gray-300 mb-1">Page Views</p>
          <p className="text-2xl font-bold text-white mb-1">45,678</p>
          <p className="text-sm text-green-400">↗ 23.36%</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-secondary/20 rounded-lg p-6 glass-card">
          <p className="text-sm text-gray-300 mb-1">Unique Visitors</p>
          <p className="text-2xl font-bold text-white mb-1">12,345</p>
          <p className="text-sm text-green-400">↗ 12.5%</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-accent/20 rounded-lg p-6 glass-card">
          <p className="text-sm text-gray-300 mb-1">Bounce Rate</p>
          <p className="text-2xl font-bold text-white mb-1">34.2%</p>
          <p className="text-sm text-red-400">↘ 2.1%</p>
        </div>
      </div>
    </div>
  );
}
