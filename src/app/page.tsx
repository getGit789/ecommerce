'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Dynamically import the Line component with no SSR
const Line = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Line),
  { ssr: false }
);

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const salesData = {
  labels: ['9AM', '12PM', '3PM', '6PM', '9PM'],
  datasets: [
    {
      label: 'Today',
      data: [30, 45, 38, 52, 38],
      borderColor: '#4F46E5',
      tension: 0.4,
      fill: false,
    },
    {
      label: 'Yesterday',
      data: [25, 38, 42, 35, 45],
      borderColor: '#EC4899',
      tension: 0.4,
      fill: false,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#fff',
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color: '#fff',
      },
    },
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color: '#fff',
      },
    },
  },
};

interface InboxItem {
  id: string;
  title: string;
  time: string;
}

interface Activity {
  id: number;
  task: string;
  status: 'URGENT' | 'NEW' | 'DEFAULT';
  time: string;
  icon: 'check' | 'x' | 'plus' | 'update';
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [inboxItems] = useState<InboxItem[]>([
    { id: '12345', title: 'Waiting for order#12345', time: '4:39' },
    { id: '22234', title: 'Customer support id#22234', time: '11:07' },
  ]);

  const [recentActivities] = useState<Activity[]>([
    { id: 1, task: 'Confirm order update', status: 'URGENT', time: '4:39', icon: 'check' },
    { id: 2, task: 'Finish shipping update', status: 'URGENT', time: '11:07', icon: 'x' },
    { id: 3, task: 'Create new order', status: 'NEW', time: '13:45', icon: 'plus' },
    { id: 4, task: 'Update payment report', status: 'DEFAULT', time: '15:20', icon: 'update' },
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <DashboardLayout>
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#4F46E5] bg-opacity-20 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-50" />
          <h3 className="text-white mb-4 relative z-10">Shipped orders</h3>
          <div className="text-5xl font-bold text-white relative z-10">67</div>
        </div>
        <div className="bg-[#EC4899] bg-opacity-20 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-pink-600 opacity-50" />
          <h3 className="text-white mb-4 relative z-10">Pending orders</h3>
          <div className="text-5xl font-bold text-white relative z-10">09</div>
        </div>
        <div className="bg-[#A855F7] bg-opacity-20 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 opacity-50" />
          <h3 className="text-white mb-4 relative z-10">New orders</h3>
          <div className="text-5xl font-bold text-white relative z-10">35</div>
        </div>
      </div>

      {/* Inbox and Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inbox and Recent Activity */}
        <div className="space-y-6">
          {/* Inbox */}
          <div className="bg-[#0F1A43] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white">Inbox</h3>
                <p className="text-gray-400 text-sm">Group: Support</p>
              </div>
              <button className="text-blue-500 hover:text-blue-400">View details</button>
            </div>
            <div className="space-y-4">
              {inboxItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-white">{item.title}</span>
                  <span className="text-gray-400">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-[#0F1A43] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
              <button className="text-blue-500 hover:text-blue-400">View all</button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'URGENT' ? 'bg-yellow-500' :
                      activity.status === 'NEW' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <span className="text-white">{activity.task}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      activity.status === 'URGENT' ? 'bg-yellow-500' :
                      activity.status === 'NEW' ? 'bg-green-500' : 'bg-gray-500'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-[#0F1A43] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white">Today's Sales</h3>
              <p className="text-gray-400 text-sm">30 Sept 2021</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#4F46E5]" />
                <span className="text-sm text-gray-400">Today</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#EC4899]" />
                <span className="text-sm text-gray-400">Yesterday</span>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            {mounted && <Line options={chartOptions} data={salesData} />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
