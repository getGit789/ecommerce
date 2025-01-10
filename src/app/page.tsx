'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useDashboardStore } from '@/store/dashboardStore';
import { motion, AnimatePresence } from 'framer-motion';
import type { Order } from '@/store/dashboardStore';
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
import { IconX } from '@tabler/icons-react';

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

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value}`;
};

const getDatasetStyle = (isCurrentPeriod: boolean) => ({
  borderColor: isCurrentPeriod ? '#4F46E5' : '#EC4899',
  backgroundColor: isCurrentPeriod ? 'rgba(79, 70, 229, 0.1)' : 'rgba(236, 72, 153, 0.1)',
  tension: 0.4,
  fill: true,
  pointBackgroundColor: isCurrentPeriod ? '#4F46E5' : '#EC4899',
  pointBorderColor: '#fff',
  borderWidth: 2,
});

const getChartOptions = (timeRange: '24h' | '7d' | '30d' | '90d') => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false,
    axis: 'x' as const,
  },
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#fff',
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 20,
      },
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(15, 26, 67, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      padding: 12,
      displayColors: true,
      usePointStyle: true,
      callbacks: {
        title: (items: { label: string }[]) => {
          const label = items[0].label;
          switch (timeRange) {
            case '7d':
              return `${label}, ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
            case '30d':
              return `${label}, ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
            case '90d':
              return label;
            default:
              return `${label}, ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
          }
        },
        label: (context: { dataset: { label?: string }, parsed: { y: number } }) => {
          const label = context.dataset.label || '';
          const value = context.parsed.y;
          return `${label}: ${formatCurrency(value)}`;
        },
      },
    },
  },
  scales: {
    y: {
      type: 'linear' as const,
      beginAtZero: timeRange === '24h',
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color: '#fff',
        callback: function(value: string | number) {
          return formatCurrency(Number(value));
        },
        maxTicksLimit: 8,
      },
      title: {
        display: true,
        text: 'Revenue',
        color: '#fff',
        padding: { top: 0, bottom: 10 },
      },
    },
    x: {
      type: 'category' as const,
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color: '#fff',
        maxRotation: 45,
        minRotation: 45,
        autoSkip: true,
        maxTicksLimit: timeRange === '90d' ? 12 : 8,
      },
      title: {
        display: true,
        text: timeRange === '24h' ? 'Time' : timeRange === '7d' ? 'Day' : timeRange === '30d' ? 'Week' : 'Month',
        color: '#fff',
        padding: { top: 10, bottom: 0 },
      },
    },
  },
  animation: {
    duration: 1000,
    easing: 'easeInOutQuad' as const
  },
  hover: {
    mode: 'index' as const,
    intersect: false,
  },
  elements: {
    point: {
      radius: 4,
      hoverRadius: 6,
      borderWidth: 2,
      hoverBorderWidth: 3,
    },
    line: {
      tension: 0.4,
      borderWidth: 2,
      fill: true,
    },
  },
});

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [isViewAllOrdersOpen, setIsViewAllOrdersOpen] = useState(false);
  const [orderFilter, setOrderFilter] = useState<'all' | 'new' | 'pending' | 'shipped'>('all');
  const [orderSort, setOrderSort] = useState<'newest' | 'oldest'>('newest');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('24h');
  const {
    orders,
    salesData,
    addOrder,
    removeOrder,
    updateOrderStatus,
    addNotification,
  } = useDashboardStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMetricCardClick = (status: 'shipped' | 'pending' | 'new') => {
    addOrder({
      status,
      amount: Math.floor(Math.random() * 1000) + 100,
      customer: `Customer ${Math.floor(Math.random() * 10000)}`
    });
  };

  const handleOrderClick = (orderId: string, currentStatus: string) => {
    const statusMap = {
      new: 'pending',
      pending: 'shipped',
      shipped: 'shipped',
    } as const;

    const newStatus = statusMap[currentStatus as keyof typeof statusMap];
    updateOrderStatus(orderId, newStatus);
  };

  const handleOrderRemove = (e: React.MouseEvent, orderId: string, status: 'shipped' | 'pending' | 'new') => {
    e.stopPropagation();
    removeOrder(orderId, status);
    addNotification({
      message: `Order ${orderId} has been removed`,
      type: 'alert'
    });
  };

  // Get all orders sorted by date
  const getAllOrders = (limit?: number) => {
    const allOrders = [...orders.new, ...orders.pending, ...orders.shipped]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (orderFilter !== 'all') {
      return limit ? allOrders.filter(o => o.status === orderFilter).slice(0, limit) : allOrders.filter(o => o.status === orderFilter);
    }
    
    return limit ? allOrders.slice(0, limit) : allOrders;
  };

  // Get sorted orders
  const getSortedOrders = (ordersToSort: Order[]) => {
    return [...ordersToSort].sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return orderSort === 'newest' ? timeB - timeA : timeA - timeB;
    });
  };

  const getChartData = () => {
    if (!salesData) {
      return {
        labels: [],
        datasets: []
      };
    }

    switch (timeRange) {
      case '7d':
        if (!salesData.weekly?.labels || !salesData.weekly?.current || !salesData.weekly?.previous) {
          return {
            labels: [],
            datasets: []
          };
        }
        return {
          labels: salesData.weekly.labels,
          datasets: [
            {
              label: 'This Week',
              data: salesData.weekly.current,
              ...getDatasetStyle(true),
            },
            {
              label: 'Last Week',
              data: salesData.weekly.previous,
              ...getDatasetStyle(false),
            },
          ],
        };
      case '30d':
        if (!salesData.monthly?.labels || !salesData.monthly?.current || !salesData.monthly?.previous) {
          return {
            labels: [],
            datasets: []
          };
        }
        return {
          labels: salesData.monthly.labels,
          datasets: [
            {
              label: 'This Month',
              data: salesData.monthly.current,
              ...getDatasetStyle(true),
            },
            {
              label: 'Last Month',
              data: salesData.monthly.previous,
              ...getDatasetStyle(false),
            },
          ],
        };
      case '90d':
        if (!salesData.quarterly?.labels || !salesData.quarterly?.current || !salesData.quarterly?.previous) {
          return {
            labels: [],
            datasets: []
          };
        }
        return {
          labels: salesData.quarterly.labels,
          datasets: [
            {
              label: 'This Year',
              data: salesData.quarterly.current,
              ...getDatasetStyle(true),
            },
            {
              label: 'Last Year',
              data: salesData.quarterly.previous,
              ...getDatasetStyle(false),
            },
          ],
        };
      default: // 24h
        if (!salesData.labels || !salesData.today || !salesData.yesterday) {
          return {
            labels: [],
            datasets: []
          };
        }
        return {
          labels: salesData.labels,
          datasets: [
            {
              label: 'Today',
              data: salesData.today,
              ...getDatasetStyle(true),
            },
            {
              label: 'Yesterday',
              data: salesData.yesterday,
              ...getDatasetStyle(false),
            },
          ],
        };
    }
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case '7d':
        return 'Weekly Revenue';
      case '30d':
        return 'Monthly Revenue';
      case '90d':
        return 'Quarterly Revenue';
      default:
        return "Today's Revenue";
    }
  };

  const getTimeRangePeriodLabel = () => {
    if (!mounted) return ''; // Return empty string during server-side rendering
    
    const now = new Date();
    switch (timeRange) {
      case '7d':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - 6);
        return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      case '30d':
        return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      case '90d':
        return now.getFullYear().toString();
      default:
        return now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  // Render loading state during hydration
  if (!mounted) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          {/* Metrics Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#0F1A43] p-6 rounded-2xl">
                <div className="h-4 bg-[#1B2B65] rounded w-1/3 mb-4"></div>
                <div className="h-8 bg-[#1B2B65] rounded w-1/4"></div>
              </div>
            ))}
          </div>

          {/* Chart and Orders Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#0F1A43] p-6 rounded-2xl">
              <div className="h-4 bg-[#1B2B65] rounded w-1/4 mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-[#1B2B65] rounded"></div>
                ))}
              </div>
            </div>
            <div className="bg-[#0F1A43] p-6 rounded-2xl">
              <div className="h-4 bg-[#1B2B65] rounded w-1/3 mb-4"></div>
              <div className="h-[300px] bg-[#1B2B65] rounded"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          className="bg-[#4F46E5] bg-opacity-20 p-6 rounded-2xl relative overflow-hidden cursor-pointer"
          whileHover={{ scale: 1.02 }}
          onClick={() => handleMetricCardClick('shipped')}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-50" />
          <h3 className="text-white mb-4 relative z-10">Shipped orders</h3>
          <div className="text-5xl font-bold text-white relative z-10">
            {orders.shipped.length.toString().padStart(2, '0')}
          </div>
        </motion.div>

        <motion.div
          className="bg-[#EC4899] bg-opacity-20 p-6 rounded-2xl relative overflow-hidden cursor-pointer"
          whileHover={{ scale: 1.02 }}
          onClick={() => handleMetricCardClick('pending')}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-pink-600 opacity-50" />
          <h3 className="text-white mb-4 relative z-10">Pending orders</h3>
          <div className="text-5xl font-bold text-white relative z-10">
            {orders.pending.length.toString().padStart(2, '0')}
          </div>
        </motion.div>

        <motion.div
          className="bg-[#A855F7] bg-opacity-20 p-6 rounded-2xl relative overflow-hidden cursor-pointer"
          whileHover={{ scale: 1.02 }}
          onClick={() => handleMetricCardClick('new')}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 opacity-50" />
          <h3 className="text-white mb-4 relative z-10">New orders</h3>
          <div className="text-5xl font-bold text-white relative z-10">
            {orders.new.length.toString().padStart(2, '0')}
          </div>
        </motion.div>
      </div>

      {/* Inbox and Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="space-y-6">
          {/* Orders List */}
          <motion.div
            className="bg-[#0F1A43] rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Recent Orders</h3>
              <button 
                className="text-blue-500 hover:text-blue-400"
                onClick={() => setIsViewAllOrdersOpen(true)}
              >
                View all
              </button>
            </div>
            <div className="space-y-4">
              {getAllOrders(4).length > 0 ? (
                getAllOrders(4).map((order, index) => (
                  <motion.div
                    key={`${order.id}-${index}`}
                    className="flex items-center justify-between p-4 bg-[#1B2B65] rounded-lg cursor-pointer group"
                    whileHover={{ x: 4 }}
                    onClick={() => handleOrderClick(order.id, order.status)}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          order.status === 'new' 
                            ? 'bg-purple-500' 
                            : order.status === 'pending'
                            ? 'bg-pink-500'
                            : 'bg-blue-500'
                        }`}
                      />
                      <div>
                        <div className="text-white">{order.customer}</div>
                        <div className="text-gray-400 text-sm">
                          ${order.amount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div
                        className={`px-3 py-1 rounded-full text-xs ${
                          order.status === 'new'
                            ? 'bg-purple-500'
                            : order.status === 'pending'
                            ? 'bg-pink-500'
                            : 'bg-blue-500'
                        }`}
                      >
                        {order.status.toUpperCase()}
                      </div>
                      <motion.button
                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleOrderRemove(e, order.id, order.status)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <IconX className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No orders yet</p>
                  <p className="text-sm text-gray-500 mt-2">Click on the cards above to create new orders</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Sales Chart */}
        <motion.div
          className="bg-[#0F1A43] rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white">{getTimeRangeLabel()}</h3>
              <p className="text-gray-400 text-sm">
                {getTimeRangePeriodLabel()}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                className="bg-[#1B2B65] text-white rounded-lg px-3 py-1 text-sm border border-[#2C3E6D] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[#4F46E5]" />
                  <span className="text-sm text-gray-400">
                    {timeRange === '24h' ? 'Today' : timeRange === '7d' ? 'This Week' : timeRange === '30d' ? 'This Month' : 'This Year'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[#EC4899]" />
                  <span className="text-sm text-gray-400">
                    {timeRange === '24h' ? 'Yesterday' : timeRange === '7d' ? 'Last Week' : timeRange === '30d' ? 'Last Month' : 'Last Year'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            {mounted && typeof window !== 'undefined' && (
              <Line
                options={getChartOptions(timeRange)}
                data={getChartData()}
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* View All Orders Modal */}
      <AnimatePresence>
        {isViewAllOrdersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsViewAllOrdersOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0F1A43] w-full max-w-2xl rounded-lg shadow-lg overflow-hidden mx-4"
            >
              <div className="p-4 border-b border-[#1B2B65] flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">All Orders</h2>
                <div className="flex items-center space-x-2">
                  <select
                    className="bg-[#1B2B65] text-white rounded-lg px-2 py-1 text-xs"
                    value={orderFilter}
                    onChange={(e) => setOrderFilter(e.target.value as 'all' | 'new' | 'pending' | 'shipped')}
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                  </select>
                  <select
                    className="bg-[#1B2B65] text-white rounded-lg px-2 py-1 text-xs"
                    value={orderSort}
                    onChange={(e) => setOrderSort(e.target.value as 'newest' | 'oldest')}
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                  </select>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsViewAllOrdersOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <IconX className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>
              <div 
                className="p-4 max-h-[70vh] overflow-y-auto custom-scrollbar"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#1B2B65 transparent'
                }}
              >
                <div className="space-y-2">
                  {getSortedOrders(getAllOrders()).map((order, index) => (
                    <motion.div
                      key={`${order.id}-${index}`}
                      className="flex items-center justify-between p-4 bg-[#1B2B65] rounded-lg cursor-pointer group"
                      whileHover={{ x: 4 }}
                      onClick={() => handleOrderClick(order.id, order.status)}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            order.status === 'new' 
                              ? 'bg-purple-500' 
                              : order.status === 'pending'
                              ? 'bg-pink-500'
                              : 'bg-blue-500'
                          }`}
                        />
                        <div>
                          <div className="text-white">{order.customer}</div>
                          <div className="text-gray-400 text-sm">
                            ${order.amount.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div
                          className={`px-3 py-1 rounded-full text-xs ${
                            order.status === 'new'
                              ? 'bg-purple-500'
                              : order.status === 'pending'
                              ? 'bg-pink-500'
                              : 'bg-blue-500'
                          }`}
                        >
                          {order.status.toUpperCase()}
                        </div>
                        <motion.button
                          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => handleOrderRemove(e, order.id, order.status)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <IconX className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
