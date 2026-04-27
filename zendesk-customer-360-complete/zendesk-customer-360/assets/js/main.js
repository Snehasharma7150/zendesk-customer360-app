/**
 * ========== ZENDESK APP FRAMEWORK INITIALIZATION ==========
 * This initializes the Zendesk client that we'll use to fetch data
 */

const client = ZAF.init();

/**
 * ========== HELPER UTILITY FUNCTIONS ==========
 * These functions are used throughout the app for common operations
 */

// Format date strings to human-readable format
function formatDate(dateStr) {
  if (!dateStr) return '';

  // Handle relative dates
  if (dateStr === 'today') {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  if (dateStr === 'yesterday') {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  if (dateStr === 'tomorrow') {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Handle YYYY-MM-DD format
  const date = new Date(dateStr + 'T00:00:00');
  if (!isNaN(date)) {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  return dateStr;
}

// Check if a string is a date format
function isDateFormat(str) {
  return /^([0-9]{4})-(1[0-2]|0[1-9])-(3[01]|[12][0-9]|0[1-9])/.test(str);
}

// Format currency values
function formatCurrency(amount, currencySymbol = '$') {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return `${currencySymbol}0.00`;
  }

  return `${currencySymbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

/**
 * ========== BACKEND API SERVICE ==========
 * Structure for making API calls to your backend
 * Update the BASE_URL to your actual backend endpoint
 */

const API_SERVICE = {
  // Update this to your actual backend URL
  BASE_URL: 'https://api.yourcompany.com/v1',

  // Get customer data by ID
  async getCustomerData(customerId) {
    try {
      const response = await fetch(`${this.BASE_URL}/customers/${customerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching customer data:', error);
      return null;
    }
  },

  // Get orders for a customer
  async getCustomerOrders(customerId) {
    try {
      const response = await fetch(
        `${this.BASE_URL}/customers/${customerId}/orders`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getAuthToken()}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  // Get loyalty information
  async getLoyaltyInfo(customerId) {
    try {
      const response = await fetch(
        `${this.BASE_URL}/customers/${customerId}/loyalty`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getAuthToken()}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching loyalty info:', error);
      return null;
    }
  },

  // Get customer basket/shopping cart
  async getCustomerBasket(customerId) {
    try {
      const response = await fetch(
        `${this.BASE_URL}/customers/${customerId}/basket`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getAuthToken()}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching basket:', error);
      return [];
    }
  },

  // Placeholder for authentication token
  // In production, implement proper authentication
  getAuthToken() {
    // Get token from localStorage, session storage, or environment
    return localStorage.getItem('auth_token') || 'demo_token';
  }
};

/**
 * ========== DEMO DATA LOADER ==========
 * Returns sample data for testing without a backend
 */

const DEMO_DATA = {
  // Sample products catalog
  products: [
    {
      id: '384-91742',
      name: 'Commercial Facility Monitoring',
      price: 45000
    },
    {
      id: '436-46291',
      name: 'Motion Sensors x 94',
      price: 27467
    },
    {
      id: '567-92711',
      name: 'Temperature Sensors x 12',
      price: 4093
    },
    {
      id: '782-73942',
      name: 'CloudHome Gateway - Commercial',
      price: 8000
    },
    {
      id: '543-81346',
      name: 'CloudHome Advanced Monitoring',
      price: 4000
    },
    {
      id: '293-61943',
      name: 'Installation Fee',
      price: 23082
    }
  ],

  // Sample customer organization
  organization: {
    name: 'Acme Corporation',
    accountId: 'CH-2498-CMRL'
  },

  // Sample customer requester
  requester: {
    name: 'John Smith',
    email: 'john.smith@acme.com',
    phone: '+1 (555) 123-4567',
    notes: 'VIP Customer - Premium Support Plan',
    user_fields: {
      company_size: 'Enterprise',
      industry: 'Technology',
      contract_value: '$500,000'
    }
  },

  // Sample orders
  orders: [
    {
      id: 'ORD-2024-001',
      status: 'active',
      date: 'today',
      details: {
        payment: {
          name: 'Payment Method',
          value: 'Credit Card'
        },
        shipping: {
          name: 'Shipping Address',
          value: '1100 Lake Carolyn Blvd, Irving, TX 75039'
        },
        billing: {
          name: 'Billing Address',
          value: '1100 Lake Carolyn Blvd, Irving, TX 75039'
        }
      },
      items: [
        { id: '384-91742', quantity: 1 },
        { id: '436-46291', quantity: 2 }
      ]
    },
    {
      id: 'ORD-2024-002',
      status: 'pending',
      date: 'yesterday',
      details: {
        payment: {
          name: 'Payment Method',
          value: 'Bank Transfer'
        },
        shipping: {
          name: 'Shipping Address',
          value: '1100 Lake Carolyn Blvd, Irving, TX 75039'
        }
      },
      items: [
        { id: '567-92711', quantity: 3 }
      ]
    },
    {
      id: 'ORD-2024-003',
      status: 'delivered',
      date: '2024-04-15',
      details: {
        payment: {
          name: 'Payment Method',
          value: 'Credit Card'
        },
        shipping: {
          name: 'Shipping Address',
          value: '1100 Lake Carolyn Blvd, Irving, TX 75039'
        }
      },
      items: [
        { id: '782-73942', quantity: 1 },
        { id: '543-81346', quantity: 1 }
      ]
    }
  ],

  // Sample basket
  basket: [
    { id: '384-91742', quantity: 1 },
    { id: '567-92711', quantity: 2 }
  ],

  // Sample loyalty information
  loyalty: {
    details: [
      {
        icon: 'fa-crown',
        title: 'Customer Tier',
        value: 'Platinum'
      },
      {
        icon: 'fa-coins',
        title: 'Loyalty Points',
        value: '25,000 pts'
      },
      {
        icon: 'fa-calendar',
        title: 'Member Since',
        value: 'Jan 15, 2020'
      }
    ],
    vouchers: [
      {
        code: 'SUMMER20',
        source: 'Email Campaign',
        status: 'available'
      },
      {
        code: 'VIP_EXCLUSIVE',
        source: 'Direct Mail',
        status: 'available'
      },
      {
        code: 'WELCOME10',
        source: 'SMS',
        status: 'used'
      },
      {
        code: 'SPRING15',
        source: 'In-App',
        status: 'expired'
      },
      {
        code: 'LOYALTY_BONUS',
        source: 'Email Campaign',
        status: 'available'
      },
      {
        code: 'BLACK_FRIDAY',
        source: 'Email Campaign',
        status: 'used'
      }
    ]
  },

  currencySymbol: '$'
};

console.log('✅ Utilities and Demo Data Loaded');
