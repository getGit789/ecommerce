'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { IconBox, IconTruck, IconCreditCard, IconSettings, IconPower, IconShoppingCart, IconMessage, IconBell, IconSearch, IconLayoutGrid, IconX } from '@tabler/icons-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: <IconLayoutGrid className="w-5 h-5" />, label: 'Dashboard', href: '/' },
  { icon: <IconShoppingCart className="w-5 h-5" />, label: 'Order', href: '/order' },
  { icon: <IconBox className="w-5 h-5" />, label: 'Products', href: '/products' },
  { icon: <IconTruck className="w-5 h-5" />, label: 'Shipping', href: '/shipping' },
  { icon: <IconCreditCard className="w-5 h-5" />, label: 'Payments', href: '/payments' },
  { icon: <IconSettings className="w-5 h-5" />, label: 'Settings', href: '/settings' },
];

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='20' fill='%234F46E5'/%3E%3Cpath d='M20 20C22.21 20 24 18.21 24 16C24 13.79 22.21 12 20 12C17.79 12 16 13.79 16 16C16 18.21 17.79 20 20 20ZM20 22C17.33 22 12 23.34 12 26V28H28V26C28 23.34 22.67 22 20 22Z' fill='white'/%3E%3C/svg%3E";

export const productImages = {
  headphones: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGNUY1RjUiLz48cGF0aCBkPSJNNjAgODBDNjAgNjguOTU0MyA2OC45NTQzIDYwIDgwIDYwSDEyMEMxMzEuMDQ2IDYwIDE0MCA2OC45NTQzIDE0MCA4MEw2MCA4MFoiIGZpbGw9IiM0QjVFRkYiLz48cGF0aCBkPSJNNjUgODBWMTIwQzY1IDEyOC4yODQgNzEuNzE1NyAxMzUgODAgMTM1Qzg4LjI4NDMgMTM1IDk1IDEyOC4yODQgOTUgMTIwVjgwSDY1WiIgZmlsbD0iIzRCNUVGRiIvPjxwYXRoIGQ9Ik0xMDUgODBWMTIwQzEwNSAxMjguMjg0IDExMS43MTYgMTM1IDEyMCAxMzVDMTI4LjI4NCAxMzUgMTM1IDEyOC4yODQgMTM1IDEyMFY4MEgxMDVaIiBmaWxsPSIjNEI1RUZGIi8+PGNpcmNsZSBjeD0iODAiIGN5PSIxMjAiIHI9IjEwIiBmaWxsPSIjMkIzQkZGIi8+PGNpcmNsZSBjeD0iMTIwIiBjeT0iMTIwIiByPSIxMCIgZmlsbD0iIzJCM0JGRiIvPjwvc3ZnPg==',
  tshirt: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGNUY1RjUiLz48cGF0aCBkPSJNNjAgNjBIODBMOTAgODBIMTEwTDEyMCA2MEgxNDBMMTUwIDkwVjE0MEg1MFY5MEw2MCA2MFoiIGZpbGw9IiM0QjVFRkYiLz48cGF0aCBkPSJNODUgNjBIOTVMMTAwIDcwSDExNUwxMjAgNjBIMTMwTDEzNSA4MFYxMjBINjVWODBMODUgNjBaIiBmaWxsPSIjMkIzQkZGIi8+PHBhdGggZD0iTTkwIDYwSDExMEwxMDAgODBIOTBMOTAgNjBaIiBmaWxsPSIjRkZGRkZGIi8+PC9zdmc+',
  smartwatch: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGNUY1RjUiLz48cmVjdCB4PSI3MCIgeT0iNjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI4MCIgcng9IjEwIiBmaWxsPSIjNEI1RUZGIi8+PHJlY3QgeD0iODAiIHk9IjcwIiB3aWR0aD0iNDAiIGhlaWdodD0iNjAiIHJ4PSI1IiBmaWxsPSIjMkIzQkZGIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSIyMCIgZmlsbD0iI0ZGRkZGRiIvPjxwYXRoIGQ9Ik0xMDAgODBWMTAwSDExNSIgc3Ryb2tlPSIjNEI1RUZGIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=',
  backpack: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGNUY1RjUiLz48cGF0aCBkPSJNNjAgNzBIODBWNTBIMTIwVjcwSDE0MFYxNTBINjBWNzBaIiBmaWxsPSIjNEI1RUZGIi8+PHBhdGggZD0iTTcwIDgwSDEzMFYxNDBINzBWODBaIiBmaWxsPSIjMkIzQkZGIi8+PHJlY3QgeD0iODAiIHk9IjkwIiB3aWR0aD0iNDAiIGhlaWdodD0iMjAiIGZpbGw9IiNGRkZGRkYiLz48cGF0aCBkPSJNODUgNTBIOTVWNzBIODVWNTBaIiBmaWxsPSIjMkIzQkZGIi8+PHBhdGggZD0iTTEwNSA1MEgxMTVWNzBIMTA1VjUwWiIgZmlsbD0iIzJCM0JGRiIvPjwvc3ZnPg=='
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);
  const [isViewAllMessagesOpen, setIsViewAllMessagesOpen] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [notificationSort, setNotificationSort] = useState<'newest' | 'oldest'>('newest');
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [messageSort, setMessageSort] = useState<'newest' | 'oldest'>('newest');

  const {
    searchQuery,
    setSearchQuery,
    notifications,
    messages,
    unreadCount,
    unreadMessages,
    markNotificationAsRead,
    markMessageAsRead,
    filterNotifications,
    sortNotifications,
    filterMessages,
    sortMessages,
    totalRevenue,
    revenueChange,
  } = useDashboardStore();

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle notification click
  const handleNotificationClick = (id: string) => {
    markNotificationAsRead(id);
    setIsNotificationsOpen(false);
  };

  // Handle view all click
  const handleViewAll = () => {
    setIsViewAllOpen(true);
    setIsNotificationsOpen(false);
  };

  const handleMessageClick = (id: string) => {
    markMessageAsRead(id);
    setIsMessagesOpen(false);
  };

  const handleViewAllMessages = () => {
    setIsViewAllMessagesOpen(true);
    setIsMessagesOpen(false);
  };

  const getFilteredSortedNotifications = () => {
    const filtered = filterNotifications(notificationFilter);
    return sortNotifications(notificationSort, filtered);
  };

  const getFilteredSortedMessages = () => {
    const filtered = filterMessages(messageFilter);
    return sortMessages(messageSort, filtered);
  };

  return (
    <div className="flex h-screen bg-[#0B1437]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F1A43] text-white flex flex-col border-r border-[#1B2B65]">
        {/* Power Icon */}
        <motion.div 
          className="h-20 flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <IconPower className="text-white w-8 h-8 cursor-pointer" stroke={2} />
        </motion.div>

        {/* Navigation */}
        <div className="p-4">
          {/* Dashboard Button */}
          <div className="mb-6">
            <Link href="/">
              <motion.div
                className="bg-yellow-400 text-black px-4 py-2.5 rounded-lg flex items-center space-x-3 hover:bg-yellow-500 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <IconLayoutGrid className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </motion.div>
            </Link>
          </div>

          {/* Menu Items */}
          <nav className="space-y-1">
            {navItems.slice(1).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                      isActive 
                        ? 'text-white bg-[#1B2B65]' 
                        : 'text-gray-400 hover:text-white hover:bg-[#1B2B65]'
                    }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Customer Support Section */}
        <div className="mt-auto p-4">
          <div className="mb-6">
            <h3 className="text-white font-medium mb-1">Customer Support</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Ask you query, place requests or important issues. Our support team will contact 24/7 to you.
            </p>
          </div>

          <motion.button
            className="w-full bg-cyan-500 text-white py-2.5 rounded-lg hover:bg-cyan-600 transition-colors flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <IconMessage className="w-5 h-5" />
            <span>Connect Now</span>
          </motion.button>

          <div className="mt-6 pt-6 border-t border-[#1B2B65] text-sm text-gray-400 space-y-2">
            <motion.div 
              className="hover:text-white cursor-pointer"
              whileHover={{ x: 4 }}
            >
              Terms & Services
            </motion.div>
            <motion.div 
              className="hover:text-white cursor-pointer"
              whileHover={{ x: 4 }}
            >
              Privacy Policy
            </motion.div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-[#0B1437] p-4 flex items-center justify-between">
          {/* Left side - Revenue */}
          <div className="flex items-center space-x-8">
            <div>
              <div className="text-sm text-gray-200">Total Revenue</div>
              <motion.div 
                className="text-2xl font-bold text-white flex items-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span>$ {totalRevenue.toFixed(2)}</span>
                <div className="text-xs ml-4 flex items-center space-x-4">
                  <span className="text-red-500 flex items-center">▼ ${revenueChange.decrease.toFixed(2)}</span>
                  <span className="text-green-500 flex items-center">▲ ${revenueChange.increase.toFixed(2)}</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center">
                <IconSearch className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearch}
                className="w-full bg-[#1B2B65] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Right side - Icons */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <motion.button
                className="text-gray-400 hover:text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMessagesOpen(!isMessagesOpen)}
              >
                <IconMessage className="w-6 h-6" />
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {isMessagesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-[#0F1A43] rounded-lg shadow-lg overflow-hidden z-50"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-white font-medium">Messages</h3>
                        <span className="text-xs text-blue-400">{messages.length} New</span>
                      </div>
                      <div className="flex justify-between items-center mb-3 text-sm">
                        <select
                          className="bg-[#1B2B65] text-white rounded-lg px-2 py-1 text-xs"
                          value={messageFilter}
                          onChange={(e) => setMessageFilter(e.target.value as 'all' | 'unread' | 'read')}
                        >
                          <option value="all">All</option>
                          <option value="unread">Unread</option>
                          <option value="read">Read</option>
                        </select>
                        <select
                          className="bg-[#1B2B65] text-white rounded-lg px-2 py-1 text-xs"
                          value={messageSort}
                          onChange={(e) => setMessageSort(e.target.value as 'newest' | 'oldest')}
                        >
                          <option value="newest">Newest</option>
                          <option value="oldest">Oldest</option>
                        </select>
                      </div>
                      <div 
                        className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar"
                        style={{
                          scrollbarWidth: 'thin',
                          scrollbarColor: '#1B2B65 transparent'
                        }}
                      >
                        {getFilteredSortedMessages().slice(0, 7).map((message) => (
                          <motion.div
                            key={message.id}
                            className={`p-3 rounded-lg cursor-pointer ${
                              message.isRead ? 'bg-[#1B2B65]' : 'bg-[#2C3E6D]'
                            }`}
                            onClick={() => handleMessageClick(message.id)}
                            whileHover={{ x: 4 }}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full overflow-hidden">
                                <Image
                                  src={message.avatar || DEFAULT_AVATAR}
                                  alt={message.sender}
                                  width={32}
                                  height={32}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-white text-sm font-medium truncate">{message.sender}</div>
                                <div className="text-gray-400 text-xs truncate">{message.content}</div>
                              </div>
                            </div>
                            <div className="text-gray-400 text-xs mt-1">
                              {new Date(message.timestamp).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      {messages.length > 7 && (
                        <motion.div
                          className="w-full text-center text-blue-400 hover:text-blue-300 py-2 mt-2 text-sm font-medium cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          onClick={handleViewAllMessages}
                        >
                          View All ({messages.length})
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <motion.button
                className="text-gray-400 hover:text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <IconBell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-[#0F1A43] rounded-lg shadow-lg overflow-hidden z-50"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-white font-medium">Notifications</h3>
                        <span className="text-xs text-blue-400">{notifications.length} New</span>
                      </div>
                      <div className="flex justify-between items-center mb-3 text-sm">
                        <select
                          className="bg-[#1B2B65] text-white rounded-lg px-2 py-1 text-xs"
                          value={notificationFilter}
                          onChange={(e) => setNotificationFilter(e.target.value as 'all' | 'unread' | 'read')}
                        >
                          <option value="all">All</option>
                          <option value="unread">Unread</option>
                          <option value="read">Read</option>
                        </select>
                        <select
                          className="bg-[#1B2B65] text-white rounded-lg px-2 py-1 text-xs"
                          value={notificationSort}
                          onChange={(e) => setNotificationSort(e.target.value as 'newest' | 'oldest')}
                        >
                          <option value="newest">Newest</option>
                          <option value="oldest">Oldest</option>
                        </select>
                      </div>
                      <div 
                        className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar"
                        style={{
                          scrollbarWidth: 'thin',
                          scrollbarColor: '#1B2B65 transparent'
                        }}
                      >
                        {getFilteredSortedNotifications().slice(0, 7).map((notification) => (
                          <motion.div
                            key={notification.id}
                            className={`p-3 rounded-lg cursor-pointer ${
                              notification.isRead ? 'bg-[#1B2B65]' : 'bg-[#2C3E6D]'
                            }`}
                            onClick={() => handleNotificationClick(notification.id)}
                            whileHover={{ x: 4 }}
                          >
                            <div className="text-white text-sm">{notification.message}</div>
                            <div className="text-gray-400 text-xs mt-1">
                              {new Date(notification.timestamp).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      {notifications.length > 7 && (
                        <motion.div
                          className="w-full text-center text-blue-400 hover:text-blue-300 py-2 mt-2 text-sm font-medium cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          onClick={handleViewAll}
                        >
                          View All ({notifications.length})
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              className="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src={DEFAULT_AVATAR}
                alt="Profile"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>

      {/* View All Messages Modal */}
      <AnimatePresence>
        {isViewAllMessagesOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsViewAllMessagesOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0F1A43] w-full max-w-2xl rounded-lg shadow-lg overflow-hidden mx-4"
            >
              <div className="p-4 border-b border-[#1B2B65] flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">All Messages</h2>
                <div className="flex items-center space-x-2">
                  <select
                    className="bg-[#1B2B65] text-white rounded-lg px-2 py-1 text-xs"
                    value={messageFilter}
                    onChange={(e) => setMessageFilter(e.target.value as 'all' | 'unread' | 'read')}
                  >
                    <option value="all">All</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                  </select>
                  <select
                    className="bg-[#1B2B65] text-white rounded-lg px-2 py-1 text-xs"
                    value={messageSort}
                    onChange={(e) => setMessageSort(e.target.value as 'newest' | 'oldest')}
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                  </select>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsViewAllMessagesOpen(false)}
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
                  {getFilteredSortedMessages().map((message) => (
                    <motion.div
                      key={message.id}
                      className={`p-3 rounded-lg cursor-pointer ${
                        message.isRead ? 'bg-[#1B2B65]' : 'bg-[#2C3E6D]'
                      }`}
                      onClick={() => handleMessageClick(message.id)}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          <Image
                            src={message.avatar || DEFAULT_AVATAR}
                            alt={message.sender}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm font-medium truncate">{message.sender}</div>
                          <div className="text-gray-400 text-xs truncate">{message.content}</div>
                        </div>
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View All Notifications Modal */}
      <AnimatePresence>
        {isViewAllOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsViewAllOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0F1A43] w-full max-w-2xl rounded-lg shadow-lg overflow-hidden mx-4"
            >
              <div className="p-4 border-b border-[#1B2B65] flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">All Notifications</h2>
                <div className="flex items-center space-x-2">
                  <select
                    className="bg-[#1B2B65] text-white rounded-lg px-2 py-1 text-xs"
                    value={notificationFilter}
                    onChange={(e) => setNotificationFilter(e.target.value as 'all' | 'unread' | 'read')}
                  >
                    <option value="all">All</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                  </select>
                  <select
                    className="bg-[#1B2B65] text-white rounded-lg px-2 py-1 text-xs"
                    value={notificationSort}
                    onChange={(e) => setNotificationSort(e.target.value as 'newest' | 'oldest')}
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                  </select>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsViewAllOpen(false)}
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
                  {getFilteredSortedNotifications().map((notification) => (
                    <motion.div
                      key={notification.id}
                      className={`p-3 rounded-lg cursor-pointer ${
                        notification.isRead ? 'bg-[#1B2B65]' : 'bg-[#2C3E6D]'
                      }`}
                      onClick={() => handleNotificationClick(notification.id)}
                      whileHover={{ x: 4 }}
                    >
                      <div className="text-white text-sm">{notification.message}</div>
                      <div className="text-gray-400 text-xs mt-1">
                        {new Date(notification.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 