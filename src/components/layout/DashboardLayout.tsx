'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconHome, IconBox, IconTruck, IconCreditCard, IconSettings, IconPower, IconShoppingCart, IconMessage, IconBell, IconSearch, IconLayoutGrid } from '@tabler/icons-react';

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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-screen bg-[#0B1437]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F1A43] text-white flex flex-col border-r border-[#1B2B65]">
        {/* Power Icon */}
        <div className="h-20 flex items-center justify-center">
          <IconPower className="text-white w-8 h-8" stroke={2} />
        </div>

        {/* Navigation */}
        <div className="p-4">
          {/* Dashboard Button */}
          <div className="mb-6">
            <Link
              href="/"
              className="bg-yellow-400 text-black px-4 py-2.5 rounded-lg flex items-center space-x-3 hover:bg-yellow-500 transition-colors"
            >
              <IconLayoutGrid className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>
          </div>

          {/* Menu Items */}
          <nav className="space-y-1">
            {navItems.slice(1).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActive 
                      ? 'text-white bg-[#1B2B65]' 
                      : 'text-gray-400 hover:text-white hover:bg-[#1B2B65]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
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

          <button className="w-full bg-cyan-500 text-white py-2.5 rounded-lg hover:bg-cyan-600 transition-colors flex items-center justify-center space-x-2">
            <IconMessage className="w-5 h-5" />
            <span>Connect Now</span>
          </button>

          <div className="mt-6 pt-6 border-t border-[#1B2B65] text-sm text-gray-400 space-y-2">
            <div className="hover:text-white cursor-pointer">Terms & Services</div>
            <div className="hover:text-white cursor-pointer">Privacy Policy</div>
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
              <div className="text-2xl font-bold text-white flex items-center">
                <span>$ 45,365.00</span>
                <div className="text-xs ml-4 flex items-center space-x-4">
                  <span className="text-red-500 flex items-center">▼ $1,294</span>
                  <span className="text-green-500 flex items-center">▲ $1,294</span>
                </div>
              </div>
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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1B2B65] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Right side - Icons */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-white">
              <IconMessage className="w-6 h-6" />
            </button>
            <button className="text-gray-400 hover:text-white">
              <IconBell className="w-6 h-6" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
} 