"use client";

import { MdAnalytics, MdAttachMoney, MdPeople, MdTrendingUp } from "react-icons/md";

export function AdminDashboard() {
  const stats = [
    {
      title: "Total Users",
      value: "2,543",
      change: "+12%",
      icon: MdPeople,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Revenue",
      value: "$12,345",
      change: "+8%",
      icon: MdAttachMoney,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Page Views",
      value: "45,678",
      change: "+23%",
      icon: MdAnalytics,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "Growth Rate",
      value: "15.2%",
      change: "+2.1%",
      icon: MdTrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-cyberpunk text-neon-orange mb-2">Dashboard Overview</h1>
        <p className="text-gray-300">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-gray-800/50 backdrop-blur-sm border border-primary/20 rounded-lg p-6 glass-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-green-500">↗ {stat.change}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`text-2xl ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-primary/20 rounded-lg p-6 glass-card">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-md">
            <h4 className="font-medium text-white mb-2">Manage Users</h4>
            <p className="text-sm text-gray-300">View and manage user accounts</p>
          </div>
          <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-md">
            <h4 className="font-medium text-white mb-2">View Analytics</h4>
            <p className="text-sm text-gray-300">Check website performance metrics</p>
          </div>
          <div className="p-4 bg-accent/10 border border-accent/20 rounded-md">
            <h4 className="font-medium text-white mb-2">System Settings</h4>
            <p className="text-sm text-gray-300">Configure system preferences</p>
          </div>
        </div>
      </div>
    </div>
  );
}
