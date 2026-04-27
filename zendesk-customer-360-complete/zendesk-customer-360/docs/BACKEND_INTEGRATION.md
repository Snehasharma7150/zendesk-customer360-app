/**
 * ========== BACKEND INTEGRATION GUIDE ==========
 * 
 * This file contains:
 * 1. Production-ready API service implementation
 * 2. Error handling strategies
 * 3. Caching mechanisms
 * 4. WebSocket for real-time updates
 * 5. Retry logic for failed requests
 * 
 * Copy the relevant sections into your main.js file
 */

// ============================================================================
// SECTION 1: PRODUCTION API SERVICE WITH ERROR HANDLING & RETRY LOGIC
// ============================================================================

const API_CONFIG = {
  BASE_URL: process.env.VUE_APP_API_URL || 'https://api.yourcompany.com/v1',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  CACHE_DURATION: 5 * 60 * 1000 // 5 minutes
};

class APIService {
  constructor() {
    this.cache = new Map();
    this.cacheTimestamps = new Map();
  }

  /**
   * Main fetch wrapper with timeout, retry, and error handling
   */
  async request(endpoint, options = {}) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    // Check cache first
    if (options.method === 'GET' && this.isCached(endpoint)) {
      console.log(`📦 Returning cached data for: ${endpoint}`);
      return this.cache.get(endpoint);
    }

    let lastError;

    // Retry logic
    for (let attempt = 1; attempt <= API_CONFIG.RETRY_ATTEMPTS; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getAuthToken()}`,
            ...options.headers
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Cache successful GET requests
        if (options.method === 'GET' || !options.method) {
          this.setCache(endpoint, data);
        }

        return data;

      } catch (error) {
        lastError = error;
        console.warn(`⚠️ Request attempt ${attempt} failed:`, error.message);

        if (attempt < API_CONFIG.RETRY_ATTEMPTS) {
          const delayMs = API_CONFIG.RETRY_DELAY * attempt;
          console.log(`🔄 Retrying in ${delayMs}ms...`);
          await this.delay(delayMs);
        }
      }
    }

    // All retries failed
    const errorMessage = `Failed to fetch ${endpoint} after ${API_CONFIG.RETRY_ATTEMPTS} attempts: ${lastError?.message}`;
    console.error(`❌ ${errorMessage}`);
    throw new Error(errorMessage);
  }

  /**
   * Cache management
   */
  setCache(key, data) {
    this.cache.set(key, data);
    this.cacheTimestamps.set(key, Date.now());
  }

  isCached(key) {
    if (!this.cache.has(key)) return false;

    const timestamp = this.cacheTimestamps.get(key);
    const age = Date.now() - timestamp;

    if (age > API_CONFIG.CACHE_DURATION) {
      this.cache.delete(key);
      this.cacheTimestamps.delete(key);
      return false;
    }

    return true;
  }

  clearCache() {
    this.cache.clear();
    this.cacheTimestamps.clear();
  }

  /**
   * Utility functions
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getAuthToken() {
    // Implement your token retrieval logic
    // Option 1: From localStorage
    // return localStorage.getItem('auth_token');
    
    // Option 2: From Zendesk context
    // return ZAF context token
    
    // Option 3: From environment variable
    return process.env.VUE_APP_AUTH_TOKEN || '';
  }

  /**
   * Customer Data Endpoints
   */

  async getCustomer(customerId) {
    return this.request(`/customers/${customerId}`);
  }

  async getOrders(customerId, filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/customers/${customerId}/orders?${params}`);
  }

  async getOrder(orderId) {
    return this.request(`/orders/${orderId}`);
  }

  async getLoyalty(customerId) {
    return this.request(`/customers/${customerId}/loyalty`);
  }

  async getBasket(customerId) {
    return this.request(`/customers/${customerId}/basket`);
  }

  async getProducts() {
    return this.request('/products');
  }

  /**
   * Action Endpoints (POST/PUT)
   */

  async updateCustomer(customerId, data) {
    return this.request(`/customers/${customerId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async applyCoupon(customerId, couponCode) {
    return this.request(`/customers/${customerId}/apply-coupon`, {
      method: 'POST',
      body: JSON.stringify({ code: couponCode })
    });
  }

  async addToBasket(customerId, productId, quantity) {
    return this.request(`/customers/${customerId}/basket`, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity })
    });
  }
}

// Create singleton instance
const api = new APIService();

// ============================================================================
// SECTION 2: REAL-TIME DATA WITH WEBSOCKET
// ============================================================================

class RealtimeService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
  }

  connect(customerId) {
    const wsUrl = `wss://api.yourcompany.com/ws/customers/${customerId}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('✅ WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      };

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.warn('⚠️ WebSocket disconnected');
        this.reconnect(customerId);
      };

    } catch (error) {
      console.error('Error connecting WebSocket:', error);
    }
  }

  reconnect(customerId) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * this.reconnectAttempts;
      console.log(`🔄 Reconnecting in ${delay}ms... (Attempt ${this.reconnectAttempts})`);

      setTimeout(() => {
        this.connect(customerId);
      }, delay);
    }
  }

  handleMessage(data) {
    // Handle different message types
    switch (data.type) {
      case 'order_updated':
        console.log('📦 Order updated:', data.payload);
        // Emit event to Vue component
        break;
      case 'basket_updated':
        console.log('🛒 Basket updated:', data.payload);
        break;
      case 'loyalty_changed':
        console.log('💳 Loyalty updated:', data.payload);
        break;
      default:
        console.log('📨 Unknown message type:', data.type);
    }
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

const realtimeService = new RealtimeService();

// ============================================================================
// SECTION 3: INTEGRATION EXAMPLE FOR VUE COMPONENT
// ============================================================================

/*
  HOW TO USE IN YOUR VUE COMPONENT:

  async mounted() {
    try {
      // Get customer ID from Zendesk ticket context
      const customerId = await this.getCustomerIdFromZendesk();

      // Load all data in parallel
      const [customerData, orders, loyalty, basket, products] = await Promise.all([
        api.getCustomer(customerId),
        api.getOrders(customerId, { limit: 50 }),
        api.getLoyalty(customerId),
        api.getBasket(customerId),
        api.getProducts()
      ]);

      // Update Vue data
      this.sharedData.organization = customerData.organization;
      this.sharedData.requester = customerData.requester;
      this.sharedData.orders = orders;
      this.sharedData.loyalty = loyalty;
      this.sharedData.basket = basket;
      this.sharedData.products = products;

      // Build lookup tables
      this.buildItemsLookup();

      // Connect to real-time updates
      realtimeService.connect(customerId);

      this.isLoading = false;

    } catch (error) {
      console.error('Failed to initialize app:', error);
      // Show error message to user
      this.errorMessage = 'Failed to load customer data. Please refresh the page.';
      this.isLoading = false;
    }
  },

  beforeDestroy() {
    // Clean up WebSocket connection
    realtimeService.close();
  }
*/

// ============================================================================
// SECTION 4: ZENDESK CONTEXT INTEGRATION
// ============================================================================

class ZendeskContextService {
  constructor() {
    this.client = ZAF.init();
  }

  /**
   * Get ticket data from Zendesk
   */
  async getTicketData() {
    try {
      const data = await this.client.get('ticket.requester.id');
      return data['ticket.requester.id'];
    } catch (error) {
      console.error('Error getting ticket data:', error);
      return null;
    }
  }

  /**
   * Get requester ID from ticket
   */
  async getRequesterId() {
    try {
      const data = await this.client.get('ticket.requester');
      return data['ticket.requester'];
    } catch (error) {
      console.error('Error getting requester:', error);
      return null;
    }
  }

  /**
   * Get full ticket data
   */
  async getFullTicket() {
    try {
      const data = await this.client.get('ticket');
      return data['ticket'];
    } catch (error) {
      console.error('Error getting ticket:', error);
      return null;
    }
  }

  /**
   * Resize app container
   */
  resizeApp(height) {
    this.client.invoke('resize', { height: height });
  }

  /**
   * Add comment to ticket
   */
  async addComment(commentText) {
    try {
      await this.client.set('comment.text', commentText);
      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      return false;
    }
  }
}

const zendeskContext = new ZendeskContextService();

// ============================================================================
// SECTION 5: ERROR HANDLER & LOGGER
// ============================================================================

class ErrorHandler {
  static handle(error, context = '') {
    console.error(`Error in ${context}:`, error);

    // Categorize error
    if (error instanceof TypeError) {
      return { 
        message: 'Network error. Please check your connection.',
        type: 'network'
      };
    } else if (error.message.includes('401')) {
      return { 
        message: 'Authentication failed. Please log in again.',
        type: 'auth'
      };
    } else if (error.message.includes('404')) {
      return { 
        message: 'Customer data not found.',
        type: 'not_found'
      };
    } else if (error.message.includes('500')) {
      return { 
        message: 'Server error. Please try again later.',
        type: 'server'
      };
    } else {
      return { 
        message: error.message || 'An unknown error occurred.',
        type: 'unknown'
      };
    }
  }
}

// ============================================================================
// SECTION 6: DATA TRANSFORMATION & MAPPING
// ============================================================================

class DataTransformer {
  /**
   * Transform raw API response to app data structure
   */
  static normalizeCustomerData(rawData) {
    return {
      organization: {
        name: rawData.company_name,
        accountId: rawData.account_number
      },
      requester: {
        name: rawData.primary_contact,
        email: rawData.email,
        phone: rawData.phone,
        notes: rawData.internal_notes,
        user_fields: rawData.custom_fields || {}
      }
    };
  }

  /**
   * Transform raw order data
   */
  static normalizeOrders(rawOrders) {
    return rawOrders.map(order => ({
      id: order.order_id,
      status: order.status.toLowerCase(),
      date: order.created_date,
      details: {
        payment: {
          name: 'Payment Method',
          value: order.payment_method
        },
        shipping: {
          name: 'Shipping Address',
          value: order.shipping_address
        },
        billing: {
          name: 'Billing Address',
          value: order.billing_address
        }
      },
      items: order.line_items.map(item => ({
        id: item.product_id,
        quantity: item.quantity
      }))
    }));
  }

  /**
   * Transform products to lookup table
   */
  static normalizeProducts(rawProducts) {
    const lookup = {};
    rawProducts.forEach(product => {
      lookup[product.id] = {
        name: product.name,
        price: product.price,
        url: product.url,
        photo: product.image_url
      };
    });
    return lookup;
  }
}

// ============================================================================
// SECTION 7: EXPORT FOR USE IN MAIN.JS
// ============================================================================

// These are ready to use in your Vue component
const BackendServices = {
  api,
  realtimeService,
  zendeskContext,
  ErrorHandler,
  DataTransformer
};

console.log('✅ Backend Services Loaded');
