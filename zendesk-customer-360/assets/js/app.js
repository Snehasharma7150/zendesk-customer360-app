/**
 * ========== VUE.JS APPLICATION INITIALIZATION ==========
 * Main Vue instance with all reactive data and methods
 */

// Initialize Vuetify theme
const vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#1976d2',
        secondary: '#26a69a',
        accent: '#82b1ff',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196f3',
        success: '#4caf50'
      }
    }
  }
});

/**
 * ========== MAIN VUE INSTANCE ==========
 * This is the heart of the application
 */

const vm = new Vue({
  el: '#app',
  vuetify: vuetify,

  /**
   * REACTIVE DATA
   * All properties here are reactive - changes automatically update the UI
   */
  data: {
    // Shared data structure that holds all customer information
    sharedData: {
      organization: {},
      requester: {},
      orders: [],
      products: [],
      basket: [],
      loyalty: {},
      tabs: {
        user: {
          icon: 'fa-user',
          name: 'Customer Info'
        },
        loyalty: {
          icon: 'fa-star',
          name: 'Loyalty & Campaigns'
        },
        orders: {
          icon: 'fa-shopping-bag',
          name: 'Orders'
        },
        basket: {
          icon: 'fa-shopping-cart',
          name: 'Shopping Cart'
        }
      },
      currencySymbol: '$'
    },

    // UI State
    currentTab: 'user',
    selectedVoucher: null,
    showAllVouchers: false,

    // Search and Filter
    searchOrderInput: '',
    filteredOrders: [],

    // Sorting
    sortOrderBy: 'date',
    sortOrderOrder: 'desc',
    orderTab: null,

    // Items mapping for quick lookup
    itemsInfo: {},

    // User field labels for custom fields
    userFieldLabels: {
      company_size: 'Company Size',
      industry: 'Industry',
      contract_value: 'Contract Value',
      subscription_plan: 'Subscription Plan',
      customer_type: 'Customer Type'
    },

    // Loading state
    isLoading: true
  },

  /**
   * COMPUTED PROPERTIES
   * These are calculated values that update automatically
   */
  computed: {
    /**
     * Total amount customer has spent across all orders
     */
    totalSpent() {
      let total = 0;
      this.sharedData.orders.forEach((order) => {
        total += this.calculateOrderTotal(order.items);
      });
      return this.formatMoney(total, this.sharedData.currencySymbol);
    },

    /**
     * Display vouchers (first 5 or all based on toggle)
     */
    displayVouchers() {
      if (!this.sharedData.loyalty || !this.sharedData.loyalty.vouchers) {
        return [];
      }
      return this.showAllVouchers
        ? this.sharedData.loyalty.vouchers
        : this.sharedData.loyalty.vouchers.slice(0, 5);
    },

    /**
     * Basket subtotal
     */
    basketSubtotal() {
      let subtotal = 0;
      this.sharedData.basket.forEach((item) => {
        if (this.itemsInfo[item.id]) {
          subtotal += this.itemsInfo[item.id].price * item.quantity;
        }
      });
      return this.formatMoney(subtotal, this.sharedData.currencySymbol);
    },

    /**
     * Basket total (including taxes/fees if applicable)
     */
    basketTotal() {
      let total = 0;
      this.sharedData.basket.forEach((item) => {
        if (this.itemsInfo[item.id]) {
          total += this.itemsInfo[item.id].price * item.quantity;
        }
      });
      // Add 10% tax
      const tax = total * 0.1;
      return this.formatMoney(total + tax, this.sharedData.currencySymbol);
    }
  },

  /**
   * LIFECYCLE HOOKS
   * Methods that run at specific stages of the app lifecycle
   */
  mounted() {
    console.log('🚀 App mounted, initializing data...');
    this.initializeApp();
  },

  /**
   * METHODS
   * All the functions that make the app work
   */
  methods: {
    /**
     * Initialize the application with demo data
     * REPLACE THIS with API calls for production use
     */
    async initializeApp() {
      try {
        // For now, load demo data
        // In production, call API_SERVICE methods here instead
        this.loadDemoData();

        // Build items lookup table for quick access
        this.buildItemsLookup();

        // Initialize filtered orders
        this.filterOrders();

        this.isLoading = false;
        console.log('✅ App initialized successfully');
      } catch (error) {
        console.error('❌ Error initializing app:', error);
        this.isLoading = false;
      }
    },

    /**
     * Load demo data into the app
     */
    loadDemoData() {
      this.sharedData.organization = DEMO_DATA.organization;
      this.sharedData.requester = DEMO_DATA.requester;
      this.sharedData.orders = DEMO_DATA.orders;
      this.sharedData.products = DEMO_DATA.products;
      this.sharedData.basket = DEMO_DATA.basket;
      this.sharedData.loyalty = DEMO_DATA.loyalty;
      this.sharedData.currencySymbol = DEMO_DATA.currencySymbol;
    },

    /**
     * Build a lookup table of items for quick reference
     */
    buildItemsLookup() {
      this.itemsInfo = {};
      this.sharedData.products.forEach((product) => {
        this.itemsInfo[product.id] = {
          name: product.name,
          price: product.price,
          url: product.url,
          photo: product.photo
        };
      });
    },

    /**
     * Filter orders based on search input
     */
    filterOrders() {
      let filtered = [...this.sharedData.orders];

      // Apply search filter
      if (this.searchOrderInput.trim()) {
        const searchTerm = this.searchOrderInput.toLowerCase();
        filtered = filtered.filter((order) => {
          return (
            order.id.toLowerCase().includes(searchTerm) ||
            this.dateToString(order.date).toLowerCase().includes(searchTerm)
          );
        });
      }

      // Apply sorting
      filtered.sort((a, b) => {
        let compareValue = 0;

        if (this.sortOrderBy === 'date') {
          const dateA = new Date(a.date === 'today' ? new Date() : a.date);
          const dateB = new Date(b.date === 'today' ? new Date() : b.date);
          compareValue = dateA - dateB;
        } else if (this.sortOrderBy === 'id') {
          compareValue = a.id.localeCompare(b.id);
        }

        return this.sortOrderOrder === 'desc' ? -compareValue : compareValue;
      });

      this.filteredOrders = filtered;
    },

    /**
     * Toggle sort direction for a column
     */
    toggleSort(column) {
      if (this.sortOrderBy === column) {
        this.sortOrderOrder = this.sortOrderOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortOrderBy = column;
        this.sortOrderOrder = 'asc';
      }
      this.filterOrders();
    },

    /**
     * Get custom user field label
     */
    getFieldLabel(key) {
      return this.userFieldLabels[key] || key;
    },

    /**
     * Check if a value is a date string
     */
    isDate(value) {
      if (typeof value !== 'string') return false;
      return isDateFormat(value);
    },

    /**
     * Convert date to readable string
     */
    dateToString(dateInput) {
      return formatDate(dateInput);
    },

    /**
     * Format currency values
     */
    formatMoney(amount, symbol = '$') {
      return formatCurrency(amount, symbol);
    },

    /**
     * Calculate total for an order
     */
    calculateOrderTotal(items) {
      let total = 0;
      items.forEach((item) => {
        if (this.itemsInfo[item.id]) {
          total += this.itemsInfo[item.id].price * item.quantity;
        }
      });
      return total;
    },

    /**
     * Get total for a specific order by ID
     */
    orderTotal(orderId) {
      const order = this.sharedData.orders.find((o) => o.id === orderId);
      if (!order) return this.formatMoney(0, this.sharedData.currencySymbol);
      return this.formatMoney(
        this.calculateOrderTotal(order.items),
        this.sharedData.currencySymbol
      );
    },

    /**
     * Get items for a specific order
     */
    getOrderItems(orderId) {
      const order = this.sharedData.orders.find((o) => o.id === orderId);
      if (!order) return [];

      return order.items.map((item) => ({
        id: item.id,
        name: this.itemsInfo[item.id]?.name || 'Unknown Product',
        price: this.itemsInfo[item.id]?.price || 0,
        quantity: item.quantity
      }));
    },

    /**
     * Get color for order status
     */
    getStatusColor(status) {
      const statusColors = {
        active: '#4caf50',
        pending: '#ff9800',
        delivered: '#2196f3',
        churned: '#f44336',
        cancelled: '#9e9e9e'
      };
      return statusColors[status] || '#999';
    },

    /**
     * Get color for voucher status
     */
    getVoucherColor(status) {
      const statusColors = {
        available: '#4caf50',
        used: '#9e9e9e',
        expired: '#f44336'
      };
      return statusColors[status] || '#999';
    },

    /**
     * Open order details (placeholder for modal/navigation)
     */
    openOrderDetails(orderId) {
      console.log(`Opening details for order: ${orderId}`);
      // In production, you might open a modal or navigate to a details page
      alert(`Order Details: ${orderId}`);
    },

    /**
     * Handle voucher selection
     */
    selectVoucher(voucher) {
      this.selectedVoucher = voucher;
      console.log('Selected voucher:', voucher);
    },

    /**
     * Handle API calls to backend
     * IMPLEMENT THESE METHODS FOR PRODUCTION
     */

    // Fetch customer data from backend
    async fetchCustomerData(customerId) {
      try {
        // Replace DEMO_DATA with real API call:
        // const data = await API_SERVICE.getCustomerData(customerId);
        // this.sharedData = { ...this.sharedData, ...data };
        console.log('Fetching customer data for:', customerId);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    },

    // Fetch orders from backend
    async fetchOrders(customerId) {
      try {
        // const orders = await API_SERVICE.getCustomerOrders(customerId);
        // this.sharedData.orders = orders;
        console.log('Fetching orders for:', customerId);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    },

    // Fetch loyalty information from backend
    async fetchLoyaltyInfo(customerId) {
      try {
        // const loyalty = await API_SERVICE.getLoyaltyInfo(customerId);
        // this.sharedData.loyalty = loyalty;
        console.log('Fetching loyalty info for:', customerId);
      } catch (error) {
        console.error('Error fetching loyalty info:', error);
      }
    },

    // Fetch customer basket from backend
    async fetchBasket(customerId) {
      try {
        // const basket = await API_SERVICE.getCustomerBasket(customerId);
        // this.sharedData.basket = basket;
        console.log('Fetching basket for:', customerId);
      } catch (error) {
        console.error('Error fetching basket:', error);
      }
    }
  }
});

console.log('✅ Vue App Loaded');
