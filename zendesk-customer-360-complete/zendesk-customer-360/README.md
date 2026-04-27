# Customer 360 - Zendesk Integration App

## 📋 Project Overview

**Customer 360** is a Zendesk integration app that provides support agents with a comprehensive view of customer information directly in the ticket sidebar. It displays customer data, order history, loyalty information, and shopping cart details.

---

## 🎯 Features

### ✅ Core Features Included

1. **Customer Information Tab** 📋
   - Display customer/organization details
   - Contact information (name, email, phone)
   - Custom user fields support
   - Account notes

2. **Loyalty & Campaigns Tab** 💳
   - Customer loyalty tier and points
   - Marketing campaign tracking
   - Voucher/discount code management
   - Campaign channel attribution
   - Expandable voucher list

3. **Orders Tab** 📦
   - Full order history with status badges
   - Advanced search by order ID or date
   - Sort by date or order ID (ascending/descending)
   - Expandable order details
   - Item-level breakdown with quantities and prices
   - Order total calculations

4. **Shopping Cart Tab** 🛒
   - Current items in customer's basket
   - Unit pricing and quantity display
   - Subtotal and total with tax calculation
   - Link to ERP/OMS system integration

---

## 📁 Project Structure

```
zendesk-customer-360/
├── manifest.json                 # App metadata and configuration
├── README.md                     # This file
├── assets/
│   ├── iframe.html              # Main HTML app container
│   ├── css/
│   │   └── app.css              # Custom styles
│   ├── js/
│   │   ├── main.js              # Utilities, helpers, API service
│   │   └── app.js               # Vue.js app logic
│   └── img/
│       └── [placeholder for images]
└── translations/
    └── en.json                  # English language strings
```

---

## 🚀 Getting Started

### Step 1: Installation

1. **Clone/Download the Project**
   ```bash
   git clone https://github.com/yourcompany/zendesk-customer-360.git
   cd zendesk-customer-360
   ```

2. **Install Dependencies** (if using build tools)
   ```bash
   npm install
   ```

### Step 2: Configuration

1. **Update App Manifest** (`manifest.json`)
   - Change the `author.name` to your name/company
   - Update `author.email` and `author.url`
   - Adjust the app size if needed

2. **Update API Service** (`assets/js/main.js`)
   - Replace `https://api.yourcompany.com/v1` with your actual backend URL
   - Implement authentication token retrieval

3. **Customize Demo Data** (`assets/js/main.js`)
   - Edit the `DEMO_DATA` object with your sample data
   - Update product catalog
   - Modify order examples
   - Adjust currency symbol

### Step 3: Testing with Demo Data

The app includes built-in demo data, so you can test immediately:

1. The app loads sample customer data on initialization
2. All tabs display demo information
3. Search and filter functions work with demo data

### Step 4: Backend Integration (Production)

When ready to connect to a real backend:

1. **In `assets/js/main.js`**, update the `API_SERVICE` object:

```javascript
// Replace the mock data loading with API calls

async initializeApp() {
  try {
    const customerId = await this.getCustomerIdFromTicket();
    
    // Fetch real data from your backend
    await Promise.all([
      this.fetchCustomerData(customerId),
      this.fetchOrders(customerId),
      this.fetchLoyaltyInfo(customerId),
      this.fetchBasket(customerId)
    ]);

    this.buildItemsLookup();
    this.filterOrders();
    this.isLoading = false;
  } catch (error) {
    console.error('Error initializing app:', error);
    this.isLoading = false;
  }
}
```

2. **Implement actual API calls** (replace the placeholder methods):

```javascript
async fetchCustomerData(customerId) {
  try {
    const data = await API_SERVICE.getCustomerData(customerId);
    this.sharedData.organization = data.organization;
    this.sharedData.requester = data.requester;
  } catch (error) {
    console.error('Error fetching customer data:', error);
  }
}
```

### Step 5: Deploy to Zendesk

1. **Package the app:**
   - Zip all files in the project directory

2. **Upload to Zendesk:**
   - Go to Zendesk Admin → Apps and Integrations → Zendesk Support Apps
   - Click "Upload Private App"
   - Select your zip file
   - Fill in the description and install

3. **Test in your Zendesk instance:**
   - Open any ticket
   - The Customer 360 app should appear in the right sidebar

---

## 🔧 Customization Guide

### Adding New Tabs

To add a new tab to the navigation:

1. **In HTML** (`assets/iframe.html`):
```html
<!-- Add to navigation -->
<v-icon class="mr-1">fa-your-icon</v-icon>

<!-- Add tab content section -->
<template v-if="currentTab === 'new-tab-key'">
  <!-- Your content here -->
</template>
```

2. **In Vue data** (`assets/js/app.js`):
```javascript
tabs: {
  user: { icon: 'fa-user', name: 'Customer Info' },
  loyalty: { icon: 'fa-star', name: 'Loyalty' },
  orders: { icon: 'fa-shopping-bag', name: 'Orders' },
  basket: { icon: 'fa-shopping-cart', name: 'Cart' },
  'new-tab': { icon: 'fa-your-icon', name: 'Your Tab' }  // Add this
}
```

### Modifying Data Structure

The app uses a centralized `sharedData` object in Vue's data. To add new fields:

1. **Update the data structure** in `assets/js/app.js`
2. **Update demo data** in `assets/js/main.js`
3. **Update API response handling** when integrating backend
4. **Add corresponding UI elements** in `assets/iframe.html`

### Styling

All styles are in `assets/css/app.css`. The app uses:
- **Vuetify** for pre-built components
- **FontAwesome** for icons
- **CSS Variables** for easy theme customization

To change the primary color:
1. Update Vuetify theme in `assets/js/app.js`
2. Or modify CSS variables in `assets/css/app.css`

---

## 🔌 Backend Integration Details

### Expected API Response Format

**Customer Data Endpoint:**
```json
{
  "organization": {
    "name": "Company Name",
    "accountId": "ACCT-123"
  },
  "requester": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-0000",
    "notes": "VIP Customer",
    "user_fields": {
      "company_size": "Enterprise",
      "industry": "Tech"
    }
  }
}
```

**Orders Endpoint:**
```json
[
  {
    "id": "ORD-001",
    "status": "active",
    "date": "2024-04-23",
    "details": {
      "payment": { "name": "Payment Method", "value": "Credit Card" },
      "shipping": { "name": "Shipping Address", "value": "..." }
    },
    "items": [
      { "id": "PROD-001", "quantity": 1 }
    ]
  }
]
```

**Loyalty Info Endpoint:**
```json
{
  "details": [
    { "icon": "fa-crown", "title": "Tier", "value": "Platinum" },
    { "icon": "fa-coins", "title": "Points", "value": "10,000" }
  ],
  "vouchers": [
    { "code": "SUMMER20", "source": "Email", "status": "available" }
  ]
}
```

**Basket Endpoint:**
```json
[
  { "id": "PROD-001", "quantity": 2 }
]
```

---

## 📚 Technology Stack

- **Frontend Framework**: Vue.js 2.6
- **UI Component Library**: Vuetify 2.4
- **Icons**: Font Awesome 6.4
- **Zendesk Integration**: Zendesk App Framework (ZAF) 2.0
- **Styling**: CSS3 with Vuetify theming

---

## 🐛 Troubleshooting

### App Not Appearing in Zendesk
- Ensure manifest.json is correctly formatted
- Check that app is installed in the correct location
- Verify file permissions

### API Calls Not Working
- Check CORS headers in your backend
- Verify authentication token is being sent
- Check browser console for detailed error messages

### Demo Data Not Loading
- Ensure `main.js` is loaded before `app.js`
- Check browser console for JavaScript errors
- Verify Vuetify is properly initialized

---

## 📝 License

This project is proprietary and confidential.

---

## 🤝 Support

For issues, questions, or contributions:
1. Check the troubleshooting section above
2. Review the code comments in JavaScript files
3. Contact your development team

---

## 📋 Checklist for Production Deployment

- [ ] Update API endpoints in `main.js`
- [ ] Implement proper authentication/authorization
- [ ] Test with real customer data
- [ ] Update manifest.json with correct author info
- [ ] Add custom styling/branding
- [ ] Test in Zendesk Support environment
- [ ] Document any custom fields or data structure
- [ ] Set up error logging/monitoring
- [ ] Create user documentation
- [ ] Package and deploy to Zendesk

---

**Last Updated**: April 2024
**Version**: 1.0
