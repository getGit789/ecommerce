'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useDashboardStore } from '@/store/dashboardStore';
import { motion, AnimatePresence } from 'framer-motion';
import { IconFilter, IconSearch, IconX, IconEdit, IconTrash, IconDownload } from '@tabler/icons-react';
import type { Order } from '@/store/dashboardStore';

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'pending' | 'shipped'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { orders, removeOrder, updateOrderStatus } = useDashboardStore();

  // Combine all orders
  const getAllOrders = () => {
    const allOrders = [...orders.new, ...orders.pending, ...orders.shipped];
    
    // Filter by status
    const filteredOrders = filterStatus === 'all' 
      ? allOrders 
      : allOrders.filter(order => order.status === filterStatus);

    // Filter by search query
    const searchedOrders = searchQuery
      ? filteredOrders.filter(order => 
          order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.id.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : filteredOrders;

    // Sort orders
    return searchedOrders.sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });
  };

  const handleStatusChange = (orderId: string, currentStatus: string) => {
    const statusMap = {
      new: 'pending',
      pending: 'shipped',
      shipped: 'shipped',
    } as const;

    const newStatus = statusMap[currentStatus as keyof typeof statusMap];
    updateOrderStatus(orderId, newStatus);
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-purple-500';
      case 'pending':
        return 'bg-pink-500';
      case 'shipped':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Orders Management</h1>
          <motion.button
            className="bg-primary px-4 py-2 rounded-lg text-white flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <IconDownload className="w-5 h-5" />
            <span>Export Orders</span>
          </motion.button>
        </div>

        {/* Filters */}
        <div className="bg-background-dark rounded-xl p-4 space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background pl-10 pr-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            {/* Filter Controls */}
            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                className="bg-background text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
              </select>
              
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
                className="bg-background text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-background-dark rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-background">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-background">
                {getAllOrders().map((order, index) => (
                  <motion.tr
                    key={`${order.id}-${order.status}-${index}`}
                    className="hover:bg-background cursor-pointer"
                    onClick={() => handleOrderClick(order)}
                    whileHover={{ backgroundColor: 'rgba(27, 43, 101, 0.5)' }}
                  >
                    <td className="px-6 py-4 text-sm text-white">#{order.id.slice(0, 8)}</td>
                    <td className="px-6 py-4 text-sm text-white">{order.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">${order.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs text-white ${getStatusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <motion.button
                          className="text-gray-400 hover:text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(order.id, order.status);
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <IconEdit className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          className="text-gray-400 hover:text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeOrder(order.id, order.status);
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <IconTrash className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsDetailModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background-dark w-full max-w-2xl rounded-xl shadow-lg overflow-hidden mx-4"
            >
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Order Details</h2>
                    <p className="text-gray-400">#{selectedOrder.id}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsDetailModalOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <IconX className="w-6 h-6" />
                  </motion.button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-gray-400 mb-2">Customer Information</h3>
                    <p className="text-white">{selectedOrder.customer}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 mb-2">Order Date</h3>
                    <p className="text-white">
                      {new Date(selectedOrder.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 mb-2">Order Status</h3>
                    <span className={`px-3 py-1 rounded-full text-xs text-white ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-gray-400 mb-2">Order Amount</h3>
                    <p className="text-white">${selectedOrder.amount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-background">
                  <div className="flex justify-end space-x-4">
                    <motion.button
                      className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        removeOrder(selectedOrder.id, selectedOrder.status);
                        setIsDetailModalOpen(false);
                      }}
                    >
                      Delete Order
                    </motion.button>
                    <motion.button
                      className="px-4 py-2 text-white bg-primary rounded-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        handleStatusChange(selectedOrder.id, selectedOrder.status);
                        setIsDetailModalOpen(false);
                      }}
                    >
                      Update Status
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
} 