/**
 * ========== API EXAMPLES & SAMPLE RESPONSES ==========
 * 
 * This file contains:
 * 1. cURL examples for API endpoints
 * 2. JSON request/response samples
 * 3. Mock data generator for testing
 */

// ============================================================================
// SECTION 1: API ENDPOINT DOCUMENTATION
// ============================================================================

/*
BASE URL: https://api.yourcompany.com/v1
Authentication: Bearer token in Authorization header

ENDPOINTS:

1. GET /customers/{customerId}
   Returns: Customer information and organization details
   
   cURL Example:
   curl -X GET "https://api.yourcompany.com/v1/customers/CUST-12345" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json"

2. GET /customers/{customerId}/orders
   Returns: List of customer orders
   Optional params: ?status=active&limit=50&offset=0
   
   cURL Example:
   curl -X GET "https://api.yourcompany.com/v1/customers/CUST-12345/orders?status=active" \
     -H "Authorization: Bearer YOUR_TOKEN"

3. GET /customers/{customerId}/loyalty
   Returns: Loyalty tier, points, campaigns, vouchers
   
   cURL Example:
   curl -X GET "https://api.yourcompany.com/v1/customers/CUST-12345/loyalty" \
     -H "Authorization: Bearer YOUR_TOKEN"

4. GET /customers/{customerId}/basket
   Returns: Current shopping cart items
   
   cURL Example:
   curl -X GET "https://api.yourcompany.com/v1/customers/CUST-12345/basket" \
     -H "Authorization: Bearer YOUR_TOKEN"

5. GET /products
   Returns: Product catalog
   Optional params: ?limit=100
   
   cURL Example:
   curl -X GET "https://api.yourcompany.com/v1/products?limit=100" \
     -H "Authorization: Bearer YOUR_TOKEN"

6. GET /orders/{orderId}
   Returns: Detailed order information
   
   cURL Example:
   curl -X GET "https://api.yourcompany.com/v1/orders/ORD-2024-001" \
     -H "Authorization: Bearer YOUR_TOKEN"

7. POST /customers/{customerId}/apply-coupon
   Applies a coupon to customer account
   
   cURL Example:
   curl -X POST "https://api.yourcompany.com/v1/customers/CUST-12345/apply-coupon" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"code": "SUMMER20"}'

8. POST /customers/{customerId}/basket
   Adds item to shopping cart
   
   cURL Example:
   curl -X POST "https://api.yourcompany.com/v1/customers/CUST-12345/basket" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"productId": "PROD-001", "quantity": 2}'
*/

// ============================================================================
// SECTION 2: SAMPLE JSON RESPONSES
// ============================================================================

const SAMPLE_RESPONSES = {
  
  // Customer Info Response
  getCustomer: {
    "id": "CUST-12345",
    "company_name": "Acme Corporation",
    "account_number": "CH-2498-CMRL",
    "primary_contact": "John Smith",
    "email": "john.smith@acme.com",
    "phone": "+1 (555) 123-4567",
    "internal_notes": "VIP Customer - Premium Support Plan",
    "custom_fields": {
      "company_size": "Enterprise",
      "industry": "Technology",
      "contract_value": "$500,000",
      "subscription_plan": "Premium Plus",
      "customer_type": "B2B"
    },
    "created_date": "2020-01-15",
    "status": "active"
  },

  // Orders List Response
  getOrders: {
    "total": 3,
    "limit": 50,
    "offset": 0,
    "orders": [
      {
        "order_id": "ORD-2024-001",
        "status": "Active",
        "created_date": "2024-04-23",
        "payment_method": "Credit Card",
        "payment_status": "Paid",
        "shipping_address": "1100 Lake Carolyn Blvd, Irving, TX 75039",
        "billing_address": "1100 Lake Carolyn Blvd, Irving, TX 75039",
        "line_items": [
          {
            "product_id": "PROD-384-91742",
            "name": "Commercial Facility Monitoring",
            "quantity": 1,
            "price": 45000,
            "subtotal": 45000
          },
          {
            "product_id": "PROD-436-46291",
            "name": "Motion Sensors x 94",
            "quantity": 2,
            "price": 27467,
            "subtotal": 54934
          }
        ],
        "subtotal": 99934,
        "tax": 7995,
        "total": 107929
      },
      {
        "order_id": "ORD-2024-002",
        "status": "Pending",
        "created_date": "2024-04-22",
        "payment_method": "Bank Transfer",
        "payment_status": "Awaiting Payment",
        "shipping_address": "1100 Lake Carolyn Blvd, Irving, TX 75039",
        "billing_address": "1100 Lake Carolyn Blvd, Irving, TX 75039",
        "line_items": [
          {
            "product_id": "PROD-567-92711",
            "name": "Temperature Sensors x 12",
            "quantity": 3,
            "price": 4093,
            "subtotal": 12279
          }
        ],
        "subtotal": 12279,
        "tax": 982,
        "total": 13261
      },
      {
        "order_id": "ORD-2024-003",
        "status": "Delivered",
        "created_date": "2024-04-15",
        "payment_method": "Credit Card",
        "payment_status": "Paid",
        "shipping_address": "1100 Lake Carolyn Blvd, Irving, TX 75039",
        "billing_address": "1100 Lake Carolyn Blvd, Irving, TX 75039",
        "line_items": [
          {
            "product_id": "PROD-782-73942",
            "name": "CloudHome Gateway - Commercial",
            "quantity": 1,
            "price": 8000,
            "subtotal": 8000
          },
          {
            "product_id": "PROD-543-81346",
            "name": "CloudHome Advanced Monitoring",
            "quantity": 1,
            "price": 4000,
            "subtotal": 4000
          }
        ],
        "subtotal": 12000,
        "tax": 960,
        "total": 12960
      }
    ]
  },

  // Loyalty Info Response
  getLoyalty: {
    "customer_id": "CUST-12345",
    "tier": "Platinum",
    "points": 25000,
    "member_since": "2020-01-15",
    "total_spend": "1,250,000",
    "next_tier": "Diamond",
    "points_to_next_tier": 5000,
    "vouchers": [
      {
        "code": "SUMMER20",
        "source": "Email Campaign",
        "status": "available",
        "discount_type": "percentage",
        "discount_value": 20,
        "valid_until": "2024-08-31",
        "usage_count": 0,
        "max_uses": null
      },
      {
        "code": "VIP_EXCLUSIVE",
        "source": "Direct Mail",
        "status": "available",
        "discount_type": "fixed",
        "discount_value": 100,
        "valid_until": "2024-12-31",
        "usage_count": 0,
        "max_uses": 1
      },
      {
        "code": "WELCOME10",
        "source": "SMS",
        "status": "used",
        "discount_type": "percentage",
        "discount_value": 10,
        "valid_until": "2024-03-15",
        "usage_count": 1,
        "max_uses": 1
      },
      {
        "code": "SPRING15",
        "source": "In-App",
        "status": "expired",
        "discount_type": "percentage",
        "discount_value": 15,
        "valid_until": "2024-03-20",
        "usage_count": 0,
        "max_uses": null
      },
      {
        "code": "LOYALTY_BONUS",
        "source": "Email Campaign",
        "status": "available",
        "discount_type": "percentage",
        "discount_value": 25,
        "valid_until": "2024-06-30",
        "usage_count": 0,
        "max_uses": 1
      }
    ],
    "campaigns": [
      {
        "campaign_id": "CAMP-001",
        "name": "Summer Sale 2024",
        "channel": "Email",
        "status": "active",
        "enrolled": true
      },
      {
        "campaign_id": "CAMP-002",
        "name": "VIP Exclusive Offers",
        "channel": "Direct Mail",
        "status": "active",
        "enrolled": true
      },
      {
        "campaign_id": "CAMP-003",
        "name": "SMS Flash Sales",
        "channel": "SMS",
        "status": "active",
        "enrolled": false
      }
    ]
  },

  // Basket Response
  getBasket: {
    "customer_id": "CUST-12345",
    "cart_id": "CART-67890",
    "last_updated": "2024-04-23T10:30:00Z",
    "items": [
      {
        "product_id": "PROD-384-91742",
        "quantity": 1,
        "added_date": "2024-04-23"
      },
      {
        "product_id": "PROD-567-92711",
        "quantity": 2,
        "added_date": "2024-04-22"
      }
    ],
    "subtotal": 53186,
    "estimated_tax": 4255,
    "estimated_total": 57441
  },

  // Products Response
  getProducts: {
    "total": 6,
    "limit": 100,
    "offset": 0,
    "products": [
      {
        "id": "PROD-384-91742",
        "name": "Commercial Facility Monitoring",
        "price": 45000,
        "category": "Monitoring",
        "sku": "384-91742",
        "status": "active",
        "image_url": "https://example.com/images/monitoring.jpg"
      },
      {
        "id": "PROD-436-46291",
        "name": "Motion Sensors x 94",
        "price": 27467,
        "category": "Sensors",
        "sku": "436-46291",
        "status": "active",
        "image_url": "https://example.com/images/motion-sensors.jpg"
      },
      {
        "id": "PROD-567-92711",
        "name": "Temperature Sensors x 12",
        "price": 4093,
        "category": "Sensors",
        "sku": "567-92711",
        "status": "active",
        "image_url": "https://example.com/images/temp-sensors.jpg"
      },
      {
        "id": "PROD-782-73942",
        "name": "CloudHome Gateway - Commercial",
        "price": 8000,
        "category": "Gateway",
        "sku": "782-73942",
        "status": "active",
        "image_url": "https://example.com/images/gateway.jpg"
      },
      {
        "id": "PROD-543-81346",
        "name": "CloudHome Advanced Monitoring",
        "price": 4000,
        "category": "Services",
        "sku": "543-81346",
        "status": "active",
        "image_url": "https://example.com/images/advanced-monitoring.jpg"
      },
      {
        "id": "PROD-293-61943",
        "name": "Installation Fee",
        "price": 23082,
        "category": "Services",
        "sku": "293-61943",
        "status": "active",
        "image_url": null
      }
    ]
  }
};

// ============================================================================
// SECTION 3: MOCK DATA GENERATOR FOR TESTING
// ============================================================================

/**
 * Generate random customer data for testing
 */
function generateMockCustomer() {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'James', 'Emma'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'];
  const companies = ['Acme Corp', 'Tech Solutions', 'Global Enterprises', 'Innovation Labs'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const company = companies[Math.floor(Math.random() * companies.length)];
  
  return {
    id: `CUST-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    company_name: company,
    account_number: `ACCT-${Math.floor(Math.random() * 100000)}`,
    primary_contact: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(' ', '')}.com`,
    phone: `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    internal_notes: 'Premium customer account',
    custom_fields: {
      company_size: ['Small', 'Medium', 'Enterprise'][Math.floor(Math.random() * 3)],
      industry: ['Technology', 'Finance', 'Healthcare', 'Retail'][Math.floor(Math.random() * 4)],
      contract_value: `$${(Math.random() * 1000000).toFixed(0)}`,
      subscription_plan: ['Basic', 'Standard', 'Premium', 'Premium Plus'][Math.floor(Math.random() * 4)],
      customer_type: Math.random() > 0.5 ? 'B2B' : 'B2C'
    },
    created_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'active'
  };
}

/**
 * Generate random order data for testing
 */
function generateMockOrder(productIds) {
  const statuses = ['Active', 'Pending', 'Delivered', 'Cancelled'];
  const paymentMethods = ['Credit Card', 'Bank Transfer', 'PayPal', 'Check'];
  
  const selectedProducts = [];
  for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
    const randomProduct = productIds[Math.floor(Math.random() * productIds.length)];
    selectedProducts.push({
      product_id: randomProduct.id,
      name: randomProduct.name,
      quantity: Math.floor(Math.random() * 5) + 1,
      price: randomProduct.price,
      subtotal: randomProduct.price * (Math.floor(Math.random() * 5) + 1)
    });
  }
  
  const subtotal = selectedProducts.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * 0.08;
  
  return {
    order_id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    created_date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    payment_method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
    payment_status: Math.random() > 0.3 ? 'Paid' : 'Pending',
    shipping_address: '1100 Lake Carolyn Blvd, Irving, TX 75039',
    billing_address: '1100 Lake Carolyn Blvd, Irving, TX 75039',
    line_items: selectedProducts,
    subtotal: subtotal,
    tax: tax,
    total: subtotal + tax
  };
}

// ============================================================================
// SECTION 4: HOW TO USE MOCK DATA IN VUE
// ============================================================================

/*
// In your Vue component mounted() method:

async mounted() {
  try {
    // Option 1: Load real data from API
    const customer = await api.getCustomer('CUST-12345');
    const orders = await api.getOrders('CUST-12345');
    
    // Option 2: Use sample data (for testing)
    this.sharedData = this.transformSampleData(SAMPLE_RESPONSES.getCustomer);
    
    // Option 3: Generate random mock data
    const mockCustomer = generateMockCustomer();
    const mockOrders = [
      generateMockOrder(SAMPLE_RESPONSES.getProducts.products),
      generateMockOrder(SAMPLE_RESPONSES.getProducts.products)
    ];
    
  } catch (error) {
    console.error('Error:', error);
  }
}
*/

console.log('✅ API Examples & Sample Data Loaded');
