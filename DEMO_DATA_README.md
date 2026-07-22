# Demo Data Population Script

This script will populate your budget manager application with realistic data for a 3-month period (January-March 2024), perfect for presentations and demonstrations.

## 🚀 Quick Start

### Prerequisites
1. Make sure your backend server is running on `http://localhost:5000`
2. Make sure your frontend is running on `http://localhost:3000`
3. Install axios if not already installed: `npm install axios`

### Running the Script

1. **Open a terminal in your project root directory**

2. **Run the script:**
   ```bash
   node populate-demo-data.js
   ```

3. **Wait for completion** - The script will show progress as it creates:
   - Demo user account
   - 10 categories (Food & Dining, Transportation, Shopping, etc.)
   - ~200+ realistic transactions over 3 months

4. **Login to the application** with:
   - **Email:** `demo@example.com`
   - **Password:** `demo123`

## 📊 What Data Will Be Created

### Categories
- **Income Categories:** Salary, Freelance, Investments
- **Expense Categories:** Food & Dining, Transportation, Shopping, Entertainment, Bills & Utilities, Healthcare, Education

### Transaction Types
- **Income:** Monthly salary (2500 lei), freelance projects, investment returns
- **Expenses:** Daily realistic expenses with varying amounts and descriptions

### Time Period
- **Start Date:** January 1, 2024
- **End Date:** March 31, 2024
- **Total Transactions:** ~200+ transactions

## 🎯 Perfect for Presentations

This demo data will show:
- ✅ Realistic spending patterns
- ✅ Income vs expenses tracking
- ✅ Category-based analysis
- ✅ Monthly trends and reports
- ✅ Calendar view with transaction history
- ✅ Charts and visualizations with meaningful data

## 🔧 Customization

You can easily modify the script to:
- Change the date range
- Adjust transaction amounts
- Add more categories
- Modify transaction frequency
- Change the demo user credentials

## 🧹 Clean Up (Optional)

If you want to remove the demo data later:
1. Login with demo credentials
2. Delete transactions manually through the UI
3. Or modify the script to include a cleanup function

## ⚠️ Important Notes

- The script is safe and won't affect your existing data
- It creates a separate demo user account
- All amounts are in lei (Romanian currency)
- The script handles errors gracefully and continues if some items already exist

## 🎉 Ready for Your Presentation!

After running the script, you'll have a fully populated budget manager that looks like it's been used daily for 3 months. Perfect for demonstrating all the features of your application! 