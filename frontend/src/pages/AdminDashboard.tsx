import React from 'react';
import { Users, Brain, Shield, TrendingUp, UserPlus, Settings } from 'lucide-react';

interface StatCard {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

const stats: StatCard[] = [
  {
    title: 'Total Members',
    value: 156,
    icon: Users,
    color: 'text-google-blue'
  },
  {
    title: 'Active Quizzes',
    value: 12,
    icon: Brain,
    color: 'text-google-red'
  },
  {
    title: 'Admin Count',
    value: 5,
    icon: Shield,
    color: 'text-google-yellow'
  },
  {
    title: 'Quiz Completions',
    value: 438,
    icon: TrendingUp,
    color: 'text-google-green'
  }
];

function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <button className="btn-primary flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Add Admin</span>
          </button>
          <button className="btn-primary flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
              <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
            </div>
            <h3 className="text-lg font-medium text-gray-600">{stat.title}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {[
              { text: 'New member joined: Sarah Parker', time: '2 hours ago' },
              { text: 'Quiz created: Advanced JavaScript', time: '4 hours ago' },
              { text: 'Admin role assigned to Mike Johnson', time: '1 day ago' },
              { text: 'Quiz completed by 15 students', time: '2 days ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                <span className="text-gray-700">{activity.text}</span>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'Manage Users', icon: Users, color: 'bg-google-blue' },
              { title: 'Create Quiz', icon: Brain, color: 'bg-google-red' },
              { title: 'View Reports', icon: TrendingUp, color: 'bg-google-yellow' },
              { title: 'System Settings', icon: Settings, color: 'bg-google-green' }
            ].map((action, index) => (
              <button
                key={index}
                className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className={`${action.color} text-white p-3 rounded-full mb-2`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-gray-700">{action.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;