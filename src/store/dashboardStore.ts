import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Notification {
  id: string;
  message: string;
  type: 'message' | 'alert';
  isRead: boolean;
  timestamp: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  isRead: boolean;
  timestamp: string;
  avatar?: string;
}

export interface Order {
  id: string;
  status: 'shipped' | 'pending' | 'new';
  amount: number;
  customer: string;
  date: string;
}

interface SearchResult {
  id: string;
  type: 'order' | 'product' | 'customer';
  title: string;
  description: string;
  link: string;
}

export interface DashboardStore {
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'timestamp'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  filterNotifications: (type: 'all' | 'unread' | 'read') => Notification[];
  sortNotifications: (order: 'newest' | 'oldest', notifications?: Notification[]) => Notification[];

  // Messages
  messages: Message[];
  unreadMessages: number;
  addMessage: (message: Omit<Message, 'id' | 'isRead' | 'timestamp'>) => void;
  markMessageAsRead: (id: string) => void;
  clearMessages: () => void;
  filterMessages: (type: 'all' | 'unread' | 'read') => Message[];
  sortMessages: (order: 'newest' | 'oldest', messages?: Message[]) => Message[];

  // Revenue
  totalRevenue: number;
  revenueChange: {
    increase: number;
    decrease: number;
  };
  updateRevenue: (amount: number) => void;

  // Orders
  orders: {
    shipped: Order[];
    pending: Order[];
    new: Order[];
  };
  addOrder: (order: Omit<Order, 'id' | 'date'>) => void;
  removeOrder: (orderId: string, status: Order['status']) => void;
  updateOrderStatus: (orderId: string, newStatus: Order['status']) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];

  // Chart Data
  salesData: {
    today: number[];
    yesterday: number[];
    labels: string[];
    weekly: {
      current: number[];
      previous: number[];
      labels: string[];
    };
    monthly: {
      current: number[];
      previous: number[];
      labels: string[];
    };
    quarterly: {
      current: number[];
      previous: number[];
      labels: string[];
    };
  };
  updateSalesData: (today: number[], yesterday: number[]) => void;
}

const generateUniqueId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  const secondRandomStr = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomStr}-${secondRandomStr}`;
};

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set, get) => ({
      // Notifications
      notifications: [],
      unreadCount: 0,
      addNotification: (notification) => 
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: generateUniqueId(),
              isRead: false,
              timestamp: new Date().toISOString(),
            },
            ...state.notifications,
          ],
          unreadCount: state.unreadCount + 1,
        })),
      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
          unreadCount: state.unreadCount - 1,
        })),
      clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
      filterNotifications: (type) => {
        const state = get();
        switch (type) {
          case 'unread':
            return state.notifications.filter((n) => !n.isRead);
          case 'read':
            return state.notifications.filter((n) => n.isRead);
          default:
            return state.notifications;
        }
      },
      sortNotifications: (order, notifications) => {
        const state = get();
        const itemsToSort = notifications || state.notifications;
        return [...itemsToSort].sort((a, b) => {
          const timeA = new Date(a.timestamp).getTime();
          const timeB = new Date(b.timestamp).getTime();
          return order === 'newest' ? timeB - timeA : timeA - timeB;
        });
      },

      // Messages
      messages: [
        {
          id: '1',
          sender: 'John Smith',
          content: 'Your order #4721 has been shipped',
          isRead: false,
          timestamp: new Date('2024-01-20T11:43:36').toISOString(),
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        {
          id: '2',
          sender: 'Sarah Johnson',
          content: 'New product inquiry for Electronics category',
          isRead: false,
          timestamp: new Date('2024-01-20T11:43:34').toISOString(),
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        {
          id: '3',
          sender: 'Mike Wilson',
          content: 'Customer support request #89123',
          isRead: false,
          timestamp: new Date('2024-01-20T11:43:33').toISOString(),
          avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        {
          id: '4',
          sender: 'Emily Davis',
          content: 'Inventory update required for SKU-789',
          isRead: false,
          timestamp: new Date('2024-01-20T11:43:32').toISOString(),
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        {
          id: '5',
          sender: 'Alex Brown',
          content: 'Payment confirmation for order #5832',
          isRead: false,
          timestamp: new Date('2024-01-20T11:43:32').toISOString(),
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        {
          id: '6',
          sender: 'Lisa Anderson',
          content: 'New feature request from client',
          isRead: false,
          timestamp: new Date('2024-01-20T11:43:31').toISOString(),
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        {
          id: '7',
          sender: 'David Miller',
          content: 'Weekly sales report available',
          isRead: false,
          timestamp: new Date('2024-01-20T11:43:30').toISOString(),
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        }
      ],
      unreadMessages: 7,
      addMessage: (message) =>
        set((state) => ({
          messages: [
            {
              ...message,
              id: generateUniqueId(),
              isRead: false,
              timestamp: new Date().toISOString(),
            },
            ...state.messages,
          ],
          unreadMessages: state.unreadMessages + 1,
        })),
      markMessageAsRead: (id) =>
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === id ? { ...m, isRead: true } : m
          ),
          unreadMessages: state.unreadMessages - 1,
        })),
      clearMessages: () => set({ messages: [], unreadMessages: 0 }),
      filterMessages: (type) => {
        const state = get();
        switch (type) {
          case 'unread':
            return state.messages.filter((m) => !m.isRead);
          case 'read':
            return state.messages.filter((m) => m.isRead);
          default:
            return state.messages;
        }
      },
      sortMessages: (order, messages) => {
        const state = get();
        const itemsToSort = messages || state.messages;
        return [...itemsToSort].sort((a, b) => {
          const timeA = new Date(a.timestamp).getTime();
          const timeB = new Date(b.timestamp).getTime();
          return order === 'newest' ? timeB - timeA : timeA - timeB;
        });
      },

      // Revenue
      totalRevenue: 45365.00,
      revenueChange: {
        increase: 1294,
        decrease: 1294,
      },
      updateRevenue: (amount) =>
        set((state) => {
          const diff = amount - state.totalRevenue;
          return {
            totalRevenue: amount,
            revenueChange: {
              increase: diff > 0 ? diff : state.revenueChange.increase,
              decrease: diff < 0 ? Math.abs(diff) : state.revenueChange.decrease,
            },
          };
        }),

      // Orders
      orders: {
        shipped: [],
        pending: [],
        new: [],
      },
      addOrder: (order) =>
        set((state) => {
          const newOrder = {
            ...order,
            id: generateUniqueId(),
            date: new Date().toISOString(),
            customer: `Customer ${Math.floor(Math.random() * 10000)}`,
            amount: Math.floor(Math.random() * 1000) + 100,
          };

          // Add notification for new order
          const notificationMessage = `New ${order.status} order #${newOrder.id.split('-')[0]} from ${newOrder.customer}`;
          get().addNotification({
            message: notificationMessage,
            type: 'alert'
          });

          return {
            orders: {
              ...state.orders,
              [order.status]: [newOrder, ...state.orders[order.status]],
            },
          };
        }),
      removeOrder: (orderId: string, status: Order['status']) =>
        set((state) => ({
          orders: {
            ...state.orders,
            [status]: state.orders[status].filter((o) => o.id !== orderId),
          },
        })),
      updateOrderStatus: (orderId: string, newStatus: Order['status']) =>
        set((state) => {
          const allOrders = [
            ...state.orders.shipped,
            ...state.orders.pending,
            ...state.orders.new,
          ];
          const order = allOrders.find((o) => o.id === orderId);
          if (!order) return state;

          const oldStatus = order.status;

          // Add notification for status update
          const notificationMessage = `Order ${orderId} moved from ${oldStatus} to ${newStatus}`;
          get().addNotification({
            message: notificationMessage,
            type: 'message'
          });

          return {
            orders: {
              ...state.orders,
              [oldStatus]: state.orders[oldStatus].filter((o) => o.id !== orderId),
              [newStatus]: [{ ...order, status: newStatus }, ...state.orders[newStatus]],
            },
          };
        }),

      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      searchResults: [],

      // Chart Data
      salesData: {
        // 24-hour data (hourly intervals)
        today: [
          20,   // 9AM
          5,    // 12PM
          -15,  // 3PM
          25,   // 6PM
          -5    // 9PM
        ],
        yesterday: [
          15,   // 9AM
          45,   // 12PM
          65,   // 3PM
          15,   // 6PM
          50    // 9PM
        ],
        labels: ['9AM', '12PM', '3PM', '6PM', '9PM'],
        
        // Weekly data (daily totals)
        weekly: {
          current: [
            32500, // Monday
            36800, // Tuesday
            42100, // Wednesday
            38900, // Thursday
            45200, // Friday
            35600, // Saturday
            31200  // Sunday
          ],
          previous: [
            30200, // Monday
            34500, // Tuesday
            39800, // Wednesday
            36500, // Thursday
            42900, // Friday
            33200, // Saturday
            29800  // Sunday
          ],
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        
        // Monthly data (weekly totals)
        monthly: {
          current: [
            245000, // Week 1
            268000, // Week 2
            292000, // Week 3
            315000  // Week 4
          ],
          previous: [
            235000, // Week 1
            255000, // Week 2
            278000, // Week 3
            298000  // Week 4
          ],
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        },
        
        // Quarterly/Yearly data (monthly totals)
        quarterly: {
          current: [
            980000,  // January
            1050000, // February
            1150000, // March
            1080000, // April
            1180000, // May
            1250000, // June
            1320000, // July
            1280000, // August
            1420000, // September
            1380000, // October
            1450000, // November
            1520000  // December
          ],
          previous: [
            920000,  // January
            980000,  // February
            1080000, // March
            1020000, // April
            1120000, // May
            1180000, // June
            1250000, // July
            1220000, // August
            1350000, // September
            1320000, // October
            1380000, // November
            1450000  // December
          ],
          labels: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ],
        },
      },
      updateSalesData: (today, yesterday) =>
        set((state) => ({
          salesData: {
            ...state.salesData,
            today,
            yesterday,
            labels: state.salesData.labels || [],
            weekly: {
              current: state.salesData.weekly?.current || [],
              previous: state.salesData.weekly?.previous || [],
              labels: state.salesData.weekly?.labels || []
            },
            monthly: {
              current: state.salesData.monthly?.current || [],
              previous: state.salesData.monthly?.previous || [],
              labels: state.salesData.monthly?.labels || []
            },
            quarterly: {
              current: state.salesData.quarterly?.current || [],
              previous: state.salesData.quarterly?.previous || [],
              labels: state.salesData.quarterly?.labels || []
            }
          },
        })),
    }),
    {
      name: 'dashboard-store',
    }
  )
); 