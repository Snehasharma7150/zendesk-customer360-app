# 🚀 Quick Start Guide - Customer 360 App

## 📦 What You Have

Your complete Zendesk Customer 360 app with:
- ✅ 4 main tabs (User Info, Loyalty, Orders, Shopping Cart)
- ✅ Demo data for immediate testing
- ✅ Fully functional Vue.js + Vuetify UI
- ✅ Production-ready backend integration structure
- ✅ Error handling and retry logic
- ✅ Real-time WebSocket support
- ✅ Complete documentation

---

## 📂 File Structure

```
zendesk-customer-360/
├── manifest.json                 ← App configuration
├── README.md                     ← Full documentation
├── assets/
│   ├── iframe.html              ← Main UI (HTML + Vue templates)
│   ├── css/app.css              ← All styling
│   └── js/
│       ├── main.js              ← Utils, API service, demo data
│       └── app.js               ← Vue.js app logic
├── docs/
│   ├── BACKEND_INTEGRATION.md   ← Backend integration guide
│   └── API_EXAMPLES.js          ← API request/response samples
└── translations/
    └── en.json                  ← Language strings
```

---

## ⚡ Quick Test (5 minutes)

### 1. **Test the Demo Version Locally**
   - Open `assets/iframe.html` in your browser
   - The app will load demo customer data
   - All 4 tabs should work with sample data

### 2. **Deploy to Zendesk (Test Environment)**
   - Create a ZIP file with all folders
   - Go to Zendesk Admin → Apps → Upload Private App
   - Select the ZIP and install
   - Open any ticket → app appears in sidebar

### 3. **Verify Functionality**
   - Click through all 4 tabs
   - Search and sort orders
   - View order details
   - Check shopping cart

---

## 🔧 Implementation Checklist

### Phase 1: Local Testing (Day 1)
- [ ] Unzip files to local folder
- [ ] Open `iframe.html` in browser
- [ ] Verify demo data loads
- [ ] Test all tabs functionality
- [ ] Check responsive design on mobile

### Phase 2: Zendesk Integration (Day 2)
- [ ] Update `manifest.json` with your company info
- [ ] Package files as ZIP
- [ ] Create test app in Zendesk
- [ ] Install in Zendesk test environment
- [ ] Verify app appears in ticket sidebar
- [ ] Test interactivity in Zendesk

### Phase 3: Backend Setup (Day 3-5)
- [ ] Review `docs/BACKEND_INTEGRATION.md`
- [ ] Update API endpoints in `assets/js/main.js`
- [ ] Implement authentication token logic
- [ ] Test API connectivity
- [ ] Transform API responses to app format
- [ ] Enable real-time WebSocket updates (optional)

### Phase 4: Production Deployment (Day 6-7)
- [ ] Final testing with real customer data
- [ ] Security review (tokens, auth)
- [ ] Update error handling messages
- [ ] Deploy to production
- [ ] Monitor app usage and errors
- [ ] Create user documentation

---

## 📝 Code Copy-Paste Ready

All files are already created with complete, production-ready code. You can:

1. **Copy the entire project** → Use as-is with demo data
2. **Copy individual files** → Customize one by one
3. **Use code snippets** → Extract specific functions

### Most Important Files to Review

1. **`assets/js/app.js`** - Vue component with all logic
   - `initializeApp()` - Replace with your data loading
   - `fetchCustomerData()` - Connect to your API
   - Computed properties for totals and calculations

2. **`assets/js/main.js`** - Utility functions and API service
   - `API_SERVICE` - Update BASE_URL to your endpoint
   - `DEMO_DATA` - Replace with your sample data
   - Helper functions for date, currency, validation

3. **`assets/iframe.html`** - UI template with all components
   - Tab navigation structure
   - Data binding examples
   - Vuetify component usage

4. **`assets/css/app.css`** - All styling
   - Responsive design
   - Custom color scheme
   - Animation effects

---

## 🔌 Backend Integration Quick Reference

### Update API Endpoint (3 lines)

In `assets/js/main.js`, find:
```javascript
const API_SERVICE = {
  BASE_URL: 'https://api.yourcompany.com/v1',  // ← Change this
```

Change to your actual API:
```javascript
BASE_URL: 'https://api.mycompany.com/api/v1',
```

### Implement Data Fetching (Example)

Replace demo data loading in `app.js`:
```javascript
// OLD (Demo data):
async initializeApp() {
  this.loadDemoData();
}

// NEW (Real API):
async initializeApp() {
  try {
    const customerId = 'CUST-12345'; // Get from Zendesk ticket
    
    const [customer, orders, loyalty, basket] = await Promise.all([
      api.getCustomer(customerId),
      api.getOrders(customerId),
      api.getLoyalty(customerId),
      api.getBasket(customerId)
    ]);
    
    this.sharedData.organization = customer.organization;
    this.sharedData.requester = customer.requester;
    this.sharedData.orders = orders;
    this.sharedData.loyalty = loyalty;
    this.sharedData.basket = basket;
    
    this.buildItemsLookup();
    this.filterOrders();
    this.isLoading = false;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

---

## 🎯 Key Features Explained

### 1. **Customer Info Tab**
- Shows customer and organization details
- Custom field support
- Email links clickable
- Handles date formatting

### 2. **Loyalty Tab**
- Customer tier and points display
- Marketing campaigns table
- Voucher code tracking
- Status badges (available/used/expired)
- Load more functionality for large voucher lists

### 3. **Orders Tab**
- Real-time search filtering
- Sort by date or ID
- Expandable order details
- Item-level breakdown
- Order status badges
- Total calculations

### 4. **Shopping Cart Tab**
- Current basket items
- Unit and total pricing
- Tax calculation (10% in demo)
- Link to ERP/OMS system
- Empty state handling

---

## 🎨 Customization Examples

### Change Primary Color
In `assets/css/app.css`:
```css
:root {
  --primary-color: #FF6B35;  /* Change from #1976d2 */
}
```

Or in `assets/js/app.js`:
```javascript
theme: {
  themes: {
    light: {
      primary: '#FF6B35'  // Your brand color
    }
  }
}
```

### Add New Tab

1. In `assets/iframe.html`, add to tabs object:
```html
<v-icon>fa-your-icon</v-icon>
```

2. Add tab content:
```html
<template v-if="currentTab === 'new-tab'">
  <!-- Your content -->
</template>
```

3. In `assets/js/app.js`:
```javascript
tabs: {
  // ... existing tabs
  'new-tab': { icon: 'fa-your-icon', name: 'Your Tab' }
}
```

### Change Data Fields

Example: Add "Contract Value" to user info

1. Update Vue data in `app.js`:
```javascript
userFieldLabels: {
  contract_value: 'Annual Contract Value',
  // ... other fields
}
```

2. In HTML, it automatically displays (already in loop)

3. Update demo data in `main.js`:
```javascript
user_fields: {
  contract_value: '$500,000'
}
```

---

## 🚨 Common Issues & Solutions

### Issue: App not showing in Zendesk
**Solution:**
- Check `manifest.json` is valid JSON
- Verify file paths in manifest point to correct locations
- Clear Zendesk cache (hard refresh)
- Check browser console for errors

### Issue: Demo data not loading
**Solution:**
- Ensure `main.js` loads before `app.js` (check HTML script order)
- Check browser console for JavaScript errors
- Verify Vuetify is initialized properly

### Issue: API calls failing
**Solution:**
- Check API URL in `main.js` is correct
- Verify authentication token is being sent
- Check CORS headers on backend
- Look at network tab in browser dev tools

### Issue: Styling looks wrong
**Solution:**
- Ensure `app.css` is linked in HTML
- Check Vuetify CSS is loaded from CDN
- Verify no conflicting CSS from other apps
- Clear browser cache

---

## 📚 Documentation Files

1. **README.md** - Full project documentation
2. **docs/BACKEND_INTEGRATION.md** - Production backend setup
3. **docs/API_EXAMPLES.js** - API request/response samples
4. **This file** - Quick start guide

---

## 🎓 Learning Resources

- Vue.js docs: https://vuejs.org/
- Vuetify docs: https://vuetifyjs.com/
- Font Awesome: https://fontawesome.com/
- Zendesk App Framework: https://developer.zendesk.com/

---

## 📞 Support

If you encounter issues:

1. **Check the docs folder** - Most questions are answered there
2. **Review the code comments** - Every section is explained
3. **Check browser console** - Errors are logged there
4. **Test with demo data first** - Before integrating backend

---

## ✅ What's Next?

1. **Week 1:** Test locally, deploy to Zendesk test
2. **Week 2:** Integrate with your backend API
3. **Week 3:** User acceptance testing
4. **Week 4:** Deploy to production

---

**You're all set! The app is fully functional and ready to customize. Start with testing the demo version, then integrate your backend. Good luck!** 🚀

---

*Last Updated: April 2024*  
*Version: 1.0*
