'use client';

import React from 'react';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconSearch, 
  IconTruck, 
  IconPackage, 
  IconClock, 
  IconCheck, 
  IconX,
  IconEdit,
  IconPlus,
  IconMapPin,
  IconSettings
} from '@tabler/icons-react';

// Types
interface ShippingRate {
  id: string;
  name: string;
  carrier: string;
  baseRate: number;
  estimatedDays: string;
  restrictions?: string;
}

interface Carrier {
  id: string;
  name: string;
  logo: string;
  active: boolean;
  trackingUrl: string;
}

interface Shipment {
  id: string;
  orderId: string;
  carrier: string;
  trackingNumber: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'failed';
  estimatedDelivery: string;
  customerName: string;
  destination: string;
  createdAt: string;
}

// Mock Data
const carriers: Carrier[] = [
  {
    id: '1',
    name: 'FedEx',
    logo: '📦',
    active: true,
    trackingUrl: 'https://www.fedex.com/tracking/'
  },
  {
    id: '2',
    name: 'UPS',
    logo: '🚚',
    active: true,
    trackingUrl: 'https://www.ups.com/track'
  },
  {
    id: '3',
    name: 'USPS',
    logo: '✉️',
    active: true,
    trackingUrl: 'https://tools.usps.com/go/TrackConfirmAction'
  },
  {
    id: '4',
    name: 'DHL',
    logo: '🌍',
    active: false,
    trackingUrl: 'https://www.dhl.com/track'
  }
];

const shippingRates: ShippingRate[] = [
  {
    id: '1',
    name: 'Standard Shipping',
    carrier: 'FedEx',
    baseRate: 9.99,
    estimatedDays: '3-5',
    restrictions: 'Up to 20 lbs'
  },
  {
    id: '2',
    name: 'Express Shipping',
    carrier: 'UPS',
    baseRate: 19.99,
    estimatedDays: '1-2',
    restrictions: 'Up to 15 lbs'
  },
  {
    id: '3',
    name: 'Economy Shipping',
    carrier: 'USPS',
    baseRate: 5.99,
    estimatedDays: '5-7',
    restrictions: 'Up to 10 lbs'
  }
];

const shipments: Shipment[] = [
  {
    id: '1',
    orderId: 'ORD-001',
    carrier: 'FedEx',
    trackingNumber: 'FDX123456789',
    status: 'in-transit',
    estimatedDelivery: '2024-01-20',
    customerName: 'John Doe',
    destination: 'New York, NY',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    orderId: 'ORD-002',
    carrier: 'UPS',
    trackingNumber: 'UPS987654321',
    status: 'delivered',
    estimatedDelivery: '2024-01-18',
    customerName: 'Jane Smith',
    destination: 'Los Angeles, CA',
    createdAt: '2024-01-16'
  },
  {
    id: '3',
    orderId: 'ORD-003',
    carrier: 'USPS',
    trackingNumber: 'USPS456789123',
    status: 'pending',
    estimatedDelivery: '2024-01-22',
    customerName: 'Mike Johnson',
    destination: 'Chicago, IL',
    createdAt: '2024-01-17'
  }
];

export default function ShippingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isCarrierModalOpen, setIsCarrierModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  const getStatusColor = (status: Shipment['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500';
      case 'in-transit':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: Shipment['status']) => {
    switch (status) {
      case 'delivered':
        return <IconCheck className="w-5 h-5" />;
      case 'in-transit':
        return <IconTruck className="w-5 h-5" />;
      case 'pending':
        return <IconClock className="w-5 h-5" />;
      case 'failed':
        return <IconX className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getFilteredShipments = () => {
    let filtered = [...shipments];

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(shipment => shipment.status === selectedStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(shipment =>
        shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.customerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Shipping</h1>
            <p className="text-gray-400 mt-1">Manage shipments and delivery settings</p>
          </div>
          <div className="flex space-x-4">
            <motion.button
              className="bg-background-dark px-4 py-2 rounded-lg text-white flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCarrierModalOpen(true)}
            >
              <IconSettings className="w-5 h-5" />
              <span>Carriers</span>
            </motion.button>
            <motion.button
              className="bg-primary px-4 py-2 rounded-lg text-white flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsRateModalOpen(true)}
            >
              <IconPlus className="w-5 h-5" />
              <span>Add Rate</span>
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-background-dark rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Active Shipments</p>
                <h3 className="text-2xl font-bold text-white mt-1">24</h3>
              </div>
              <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
                <IconTruck className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>
          <div className="bg-background-dark rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Delivered Today</p>
                <h3 className="text-2xl font-bold text-white mt-1">12</h3>
              </div>
              <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
                <IconCheck className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
          <div className="bg-background-dark rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Pending Shipments</p>
                <h3 className="text-2xl font-bold text-white mt-1">8</h3>
              </div>
              <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-lg">
                <IconPackage className="w-6 h-6 text-yellow-500" />
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
                placeholder="Search by tracking number, order ID, or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background pl-10 pr-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-background text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Shipping Rates */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Shipping Rates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shippingRates.map((rate) => (
              <motion.div
                key={rate.id}
                className="bg-background-dark rounded-xl p-6"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-medium">{rate.name}</h3>
                    <p className="text-gray-400 text-sm">{rate.carrier}</p>
                  </div>
                  <span className="text-white font-semibold">${rate.baseRate}</span>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-400">
                    Estimated delivery: {rate.estimatedDays} days
                  </p>
                  {rate.restrictions && (
                    <p className="text-sm text-gray-400 mt-1">{rate.restrictions}</p>
                  )}
                </div>
                <motion.button
                  className="mt-4 w-full bg-background text-white py-2 rounded-lg flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <IconEdit className="w-4 h-4" />
                  <span>Edit Rate</span>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Shipments Table */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Recent Shipments</h2>
          <div className="bg-background-dark rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-background">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Tracking</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Carrier</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Destination</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-background">
                  {getFilteredShipments().map((shipment) => (
                    <motion.tr
                      key={shipment.id}
                      className="hover:bg-background cursor-pointer"
                      onClick={() => {
                        setSelectedShipment(shipment);
                        setIsTrackingModalOpen(true);
                      }}
                      whileHover={{ backgroundColor: 'rgba(27, 43, 101, 0.5)' }}
                    >
                      <td className="px-6 py-4 text-sm text-white">{shipment.orderId}</td>
                      <td className="px-6 py-4 text-sm text-white">{shipment.customerName}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{shipment.trackingNumber}</td>
                      <td className="px-6 py-4 text-sm text-white">{shipment.carrier}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs text-white space-x-1 ${getStatusColor(shipment.status)}`}>
                          {getStatusIcon(shipment.status)}
                          <span>{shipment.status.replace('-', ' ').toUpperCase()}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{shipment.destination}</td>
                      <td className="px-6 py-4">
                        <motion.button
                          className="text-primary hover:text-primary-dark"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(carriers.find(c => c.name === shipment.carrier)?.trackingUrl, '_blank');
                          }}
                        >
                          <IconMapPin className="w-5 h-5" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Modal */}
      <AnimatePresence>
        {isTrackingModalOpen && selectedShipment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsTrackingModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background-dark w-full max-w-2xl rounded-xl shadow-lg overflow-hidden mx-4"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Tracking Details</h2>
                    <p className="text-gray-400">Order ID: {selectedShipment.orderId}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsTrackingModalOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <IconX className="w-6 h-6" />
                  </motion.button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-gray-400 mb-1">Customer</h3>
                      <p className="text-white">{selectedShipment.customerName}</p>
                    </div>
                    <div>
                      <h3 className="text-gray-400 mb-1">Carrier</h3>
                      <p className="text-white">{selectedShipment.carrier}</p>
                    </div>
                    <div>
                      <h3 className="text-gray-400 mb-1">Tracking Number</h3>
                      <p className="text-white">{selectedShipment.trackingNumber}</p>
                    </div>
                    <div>
                      <h3 className="text-gray-400 mb-1">Status</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs text-white space-x-1 ${getStatusColor(selectedShipment.status)}`}>
                        {getStatusIcon(selectedShipment.status)}
                        <span>{selectedShipment.status.replace('-', ' ').toUpperCase()}</span>
                      </span>
                    </div>
                    <div>
                      <h3 className="text-gray-400 mb-1">Destination</h3>
                      <p className="text-white">{selectedShipment.destination}</p>
                    </div>
                    <div>
                      <h3 className="text-gray-400 mb-1">Estimated Delivery</h3>
                      <p className="text-white">{new Date(selectedShipment.estimatedDelivery).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-background">
                    <h3 className="text-white font-medium mb-4">Tracking Timeline</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="bg-green-500 p-2 rounded-full">
                          <IconCheck className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-white">Order Processed</p>
                          <p className="text-sm text-gray-400">{new Date(selectedShipment.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      {selectedShipment.status === 'in-transit' && (
                        <div className="flex items-start space-x-3">
                          <div className="bg-blue-500 p-2 rounded-full">
                            <IconTruck className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-white">In Transit</p>
                            <p className="text-sm text-gray-400">Package is on the way</p>
                          </div>
                        </div>
                      )}
                    </div>
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