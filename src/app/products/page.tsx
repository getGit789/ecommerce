'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { IconPlus, IconSearch, IconFilter, IconEdit, IconTrash, IconX, IconCategory, IconBox } from '@tabler/icons-react';
import Image from 'next/image';
import { productImages } from '@/components/layout/DashboardLayout';

// Types
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  image: string;
  description: string;
  sku: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

// Mock Data
const categories: Category[] = [
  { id: '1', name: 'Electronics', description: 'Electronic devices and accessories', productCount: 150 },
  { id: '2', name: 'Clothing', description: 'Fashion and apparel', productCount: 300 },
  { id: '3', name: 'Home & Garden', description: 'Home decor and gardening tools', productCount: 200 },
  { id: '4', name: 'Books', description: 'Books and publications', productCount: 500 },
];

const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 99.99,
    stock: 45,
    status: 'in-stock',
    image: productImages.headphones,
    description: 'High-quality wireless headphones with noise cancellation',
    sku: 'WH-001'
  },
  {
    id: '2',
    name: 'Cotton T-Shirt',
    category: 'Clothing',
    price: 24.99,
    stock: 5,
    status: 'low-stock',
    image: productImages.tshirt,
    description: 'Comfortable cotton t-shirt in various colors',
    sku: 'CT-001'
  },
  {
    id: '3',
    name: 'Smart Watch Pro',
    category: 'Electronics',
    price: 199.99,
    stock: 0,
    status: 'out-of-stock',
    image: productImages.smartwatch,
    description: 'Advanced smartwatch with health tracking features',
    sku: 'SW-001'
  },
  {
    id: '4',
    name: 'Adventure Backpack',
    category: 'Clothing',
    price: 79.99,
    stock: 28,
    status: 'in-stock',
    image: productImages.backpack,
    description: 'Durable backpack perfect for outdoor adventures',
    sku: 'BP-001'
  }
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Filter and sort products
  const getFilteredProducts = () => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortOrder === 'asc' 
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
    });

    return filtered;
  };

  const getStockStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-500';
      case 'low-stock':
        return 'bg-yellow-500';
      case 'out-of-stock':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Products</h1>
            <p className="text-gray-400 mt-1">Manage your products and inventory</p>
          </div>
          <div className="flex space-x-4">
            <motion.button
              className="bg-background-dark px-4 py-2 rounded-lg text-white flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCategoryModalOpen(true)}
            >
              <IconCategory className="w-5 h-5" />
              <span>Categories</span>
            </motion.button>
            <motion.button
              className="bg-primary px-4 py-2 rounded-lg text-white flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddModalOpen(true)}
            >
              <IconPlus className="w-5 h-5" />
              <span>Add Product</span>
            </motion.button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-background-dark rounded-xl p-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background pl-10 pr-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-background text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'stock')}
                className="bg-background text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="stock">Sort by Stock</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="bg-background text-white px-4 py-2 rounded-lg hover:bg-background-darker"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {getFilteredProducts().map((product) => (
            <motion.div
              key={product.id}
              className="bg-background-dark rounded-xl overflow-hidden cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                setSelectedProduct(product);
                setIsDetailModalOpen(true);
              }}
            >
              <div className="aspect-square relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-medium">{product.name}</h3>
                    <p className="text-gray-400 text-sm">{product.category}</p>
                  </div>
                  <span className="text-white font-semibold">${product.price}</span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${getStockStatusColor(product.status)}`} />
                    <span className="text-sm text-gray-400">
                      {product.stock} in stock
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">SKU: {product.sku}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedProduct && (
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
                    <h2 className="text-xl font-semibold text-white">{selectedProduct.name}</h2>
                    <p className="text-gray-400">SKU: {selectedProduct.sku}</p>
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
                  <div className="aspect-square relative rounded-lg overflow-hidden">
                    <Image
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-gray-400 mb-1">Category</h3>
                      <p className="text-white">{selectedProduct.category}</p>
                    </div>
                    <div>
                      <h3 className="text-gray-400 mb-1">Price</h3>
                      <p className="text-white">${selectedProduct.price}</p>
                    </div>
                    <div>
                      <h3 className="text-gray-400 mb-1">Stock Status</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${getStockStatusColor(selectedProduct.status)}`} />
                        <span className="text-white">{selectedProduct.stock} units</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-gray-400 mb-1">Description</h3>
                      <p className="text-white">{selectedProduct.description}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-background">
                  <div className="flex justify-end space-x-4">
                    <motion.button
                      className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Delete Product
                    </motion.button>
                    <motion.button
                      className="px-4 py-2 text-white bg-primary rounded-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Edit Product
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories Modal */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsCategoryModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background-dark w-full max-w-2xl rounded-xl shadow-lg overflow-hidden mx-4"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">Product Categories</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <IconX className="w-6 h-6" />
                  </motion.button>
                </div>

                <div className="space-y-4">
                  {categories.map(category => (
                    <motion.div
                      key={category.id}
                      className="bg-background p-4 rounded-lg"
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white font-medium">{category.name}</h3>
                          <p className="text-gray-400 text-sm">{category.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400 text-sm">{category.productCount} products</span>
                          <motion.button
                            className="text-gray-400 hover:text-white"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <IconEdit className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-background">
                  <motion.button
                    className="w-full bg-primary text-white py-2 rounded-lg flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <IconPlus className="w-5 h-5" />
                    <span>Add Category</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
} 