'use client';

import React from 'react';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconSearch,
  IconCreditCard,
  IconRefresh,
  IconCash,
  IconChartBar,
  IconX,
  IconDownload,
  IconFilter,
  IconCheck,
  IconAlertTriangle,
  IconClock,
  IconReceipt,
  IconPrinter,
  IconMail,
  IconCopy
} from '@tabler/icons-react';

// Types
interface Transaction {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
  cardLast4?: string;
  date: string;
  currency: string;
}

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'paypal' | 'bank_transfer';
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
}

interface RefundRequest {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  currency: string;
}

// Mock Data
const transactions: Transaction[] = [
  {
    id: 'TRX-001',
    orderId: 'ORD-001',
    customerName: 'John Doe',
    amount: 99.99,
    status: 'completed',
    paymentMethod: 'credit_card',
    cardLast4: '4242',
    date: '2024-01-15T10:30:00',
    currency: 'USD'
  },
  {
    id: 'TRX-002',
    orderId: 'ORD-002',
    customerName: 'Jane Smith',
    amount: 149.99,
    status: 'pending',
    paymentMethod: 'paypal',
    date: '2024-01-15T11:45:00',
    currency: 'USD'
  },
  {
    id: 'TRX-003',
    orderId: 'ORD-003',
    customerName: 'Mike Johnson',
    amount: 299.99,
    status: 'refunded',
    paymentMethod: 'credit_card',
    cardLast4: '1234',
    date: '2024-01-14T15:20:00',
    currency: 'USD'
  }
];

const paymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'credit_card',
    name: 'Credit Card',
    icon: <IconCreditCard className="w-6 h-6" />,
    enabled: true
  },
  {
    id: '2',
    type: 'paypal',
    name: 'PayPal',
    icon: <IconCash className="w-6 h-6" />,
    enabled: true
  },
  {
    id: '3',
    type: 'bank_transfer',
    name: 'Bank Transfer',
    icon: <IconRefresh className="w-6 h-6" />,
    enabled: false
  }
];

const refundRequests: RefundRequest[] = [
  {
    id: 'REF-001',
    orderId: 'ORD-003',
    customerName: 'Mike Johnson',
    amount: 299.99,
    reason: 'Item not as described',
    status: 'pending',
    date: '2024-01-14T16:30:00',
    currency: 'USD'
  }
];

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'custom'>('week');
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const getStatusColor = (status: Transaction['status'] | RefundRequest['status']) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'failed':
      case 'rejected':
        return 'bg-red-500';
      case 'refunded':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: Transaction['status'] | RefundRequest['status']) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <IconCheck className="w-5 h-5" />;
      case 'pending':
        return <IconClock className="w-5 h-5" />;
      case 'failed':
      case 'rejected':
        return <IconAlertTriangle className="w-5 h-5" />;
      case 'refunded':
        return <IconRefresh className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getPaymentMethodIcon = (method: Transaction['paymentMethod']) => {
    const paymentMethod = paymentMethods.find(pm => pm.type === method);
    return paymentMethod?.icon;
  };

  const getFilteredTransactions = () => {
    let filtered = [...transactions];

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === selectedStatus);
    }

    if (selectedPaymentMethod !== 'all') {
      filtered = filtered.filter(transaction => transaction.paymentMethod === selectedPaymentMethod);
    }

    if (searchQuery) {
      filtered = filtered.filter(transaction =>
        transaction.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.customerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const closeModal = () => {
    setIsActionModalOpen(false);
    setSelectedTransaction(null);
  };

  const ActionModal = () => {
    if (!selectedTransaction) return null;

    return (
      <AnimatePresence>
        {isActionModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background-dark rounded-xl p-6 max-w-2xl w-full mx-4 relative"
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <IconX className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">Transaction Details</h3>
                <p className="text-gray-400 mt-1">Transaction ID: {selectedTransaction.id}</p>
              </div>

              {/* Transaction Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-400 text-sm">Order ID</p>
                  <p className="text-white font-medium">{selectedTransaction.orderId}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Customer</p>
                  <p className="text-white font-medium">{selectedTransaction.customerName}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Amount</p>
                  <p className="text-white font-medium">
                    {selectedTransaction.currency} {selectedTransaction.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Payment Method</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {getPaymentMethodIcon(selectedTransaction.paymentMethod)}
                    <span className="text-white">
                      {selectedTransaction.paymentMethod === 'credit_card' && selectedTransaction.cardLast4
                        ? `•••• ${selectedTransaction.cardLast4}`
                        : paymentMethods.find(pm => pm.type === selectedTransaction.paymentMethod)?.name}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs text-white space-x-1 mt-1 ${getStatusColor(selectedTransaction.status)}`}>
                    {getStatusIcon(selectedTransaction.status)}
                    <span>{selectedTransaction.status.toUpperCase()}</span>
                  </span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Date</p>
                  <p className="text-white font-medium">
                    {new Date(selectedTransaction.date).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-2 bg-primary px-4 py-2 rounded-lg text-white"
                  onClick={() => {
                    // Handle print receipt
                    window.print();
                  }}
                >
                  <IconPrinter className="w-5 h-5" />
                  <span>Print Receipt</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-2 bg-background px-4 py-2 rounded-lg text-white"
                  onClick={() => {
                    // Handle email receipt
                  }}
                >
                  <IconMail className="w-5 h-5" />
                  <span>Email Receipt</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-2 bg-background px-4 py-2 rounded-lg text-white"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedTransaction.id);
                  }}
                >
                  <IconCopy className="w-5 h-5" />
                  <span>Copy ID</span>
                </motion.button>

                {selectedTransaction.status === 'completed' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-2 bg-red-500 px-4 py-2 rounded-lg text-white"
                    onClick={() => {
                      // Handle refund initiation
                    }}
                  >
                    <IconRefresh className="w-5 h-5" />
                    <span>Initiate Refund</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Payments</h1>
            <p className="text-gray-400 mt-1">Manage transactions and payment settings</p>
          </div>
          <div className="flex space-x-4">
            <motion.button
              className="bg-background-dark px-4 py-2 rounded-lg text-white flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {}}
            >
              <IconDownload className="w-5 h-5" />
              <span>Export</span>
            </motion.button>
            <motion.button
              className="bg-primary px-4 py-2 rounded-lg text-white flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {}}
            >
              <IconFilter className="w-5 h-5" />
              <span>Filter</span>
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-background-dark rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Total Revenue</p>
                <h3 className="text-2xl font-bold text-white mt-1">$12,345.67</h3>
                <p className="text-green-500 text-sm mt-1">+15.3% from last month</p>
              </div>
              <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
                <IconChartBar className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
          <div className="bg-background-dark rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Pending Payments</p>
                <h3 className="text-2xl font-bold text-white mt-1">8</h3>
                <p className="text-yellow-500 text-sm mt-1">3 require action</p>
              </div>
              <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-lg">
                <IconClock className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </div>
          <div className="bg-background-dark rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Successful Payments</p>
                <h3 className="text-2xl font-bold text-white mt-1">127</h3>
                <p className="text-green-500 text-sm mt-1">98.5% success rate</p>
              </div>
              <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
                <IconCheck className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
          <div className="bg-background-dark rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Refund Requests</p>
                <h3 className="text-2xl font-bold text-white mt-1">3</h3>
                <p className="text-blue-500 text-sm mt-1">$892.00 total</p>
              </div>
              <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
                <IconRefresh className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-background-dark rounded-xl p-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order ID or customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background pl-10 pr-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-background text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
              <select
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="bg-background text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Methods</option>
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="bg-background text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Recent Transactions</h2>
          <div className="bg-background-dark rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-background">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Method</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-background">
                  {getFilteredTransactions().map((transaction) => (
                    <motion.tr
                      key={transaction.id}
                      className="hover:bg-background cursor-pointer"
                      onClick={() => {
                        setSelectedTransaction(transaction);
                        setIsActionModalOpen(true);
                      }}
                      whileHover={{ backgroundColor: 'rgba(27, 43, 101, 0.5)' }}
                    >
                      <td className="px-6 py-4 text-sm text-white">{transaction.orderId}</td>
                      <td className="px-6 py-4 text-sm text-white">{transaction.customerName}</td>
                      <td className="px-6 py-4 text-sm text-white">
                        {transaction.currency} {transaction.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getPaymentMethodIcon(transaction.paymentMethod)}
                          <span className="text-sm text-white">
                            {transaction.paymentMethod === 'credit_card' && transaction.cardLast4
                              ? `•••• ${transaction.cardLast4}`
                              : paymentMethods.find(pm => pm.type === transaction.paymentMethod)?.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs text-white space-x-1 ${getStatusColor(transaction.status)}`}>
                          {getStatusIcon(transaction.status)}
                          <span>{transaction.status.toUpperCase()}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(transaction.date).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <motion.button
                          className="text-primary hover:text-primary-dark"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTransaction(transaction);
                            setIsActionModalOpen(true);
                          }}
                        >
                          <IconReceipt className="w-5 h-5" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Refund Requests */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Refund Requests</h2>
          <div className="bg-background-dark rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-background">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Request ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Reason</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-background">
                  {refundRequests.map((request) => (
                    <motion.tr
                      key={request.id}
                      className="hover:bg-background cursor-pointer"
                      whileHover={{ backgroundColor: 'rgba(27, 43, 101, 0.5)' }}
                    >
                      <td className="px-6 py-4 text-sm text-white">{request.id}</td>
                      <td className="px-6 py-4 text-sm text-white">{request.orderId}</td>
                      <td className="px-6 py-4 text-sm text-white">{request.customerName}</td>
                      <td className="px-6 py-4 text-sm text-white">
                        {request.currency} {request.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">{request.reason}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs text-white space-x-1 ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span>{request.status.toUpperCase()}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(request.date).toLocaleString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <ActionModal />
    </DashboardLayout>
  );
} 