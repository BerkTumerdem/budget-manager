// Demo Data Population Script
// Run this script to populate your budget manager with realistic data for presentation

const axios = require('axios');

// Configuration
const DEMO_USER_EMAIL = 'demo@example.com';
const DEMO_USER_PASSWORD = 'demo123';
const API_BASE_URL = 'http://localhost:5000/api';

// Romanian categories
const categories = [
  { name: 'Mâncare & Restaurante', color: '#FF6B6B' },
  { name: 'Transport', color: '#4ECDC4' },
  { name: 'Cumpărături', color: '#45B7D1' },
  { name: 'Divertisment', color: '#96CEB4' },
  { name: 'Facturi & Utilități', color: '#FFEAA7' },
  { name: 'Sănătate', color: '#DDA0DD' },
  { name: 'Educație', color: '#98D8C8' },
  { name: 'Salariu', color: '#F7DC6F' },
  { name: 'Freelance', color: '#BB8FCE' },
  { name: 'Investiții', color: '#85C1E9' }
];

// Sample transactions for 3 months
const generateTransactions = () => {
  const transactions = [];
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2025-07-08'); // Only generate data up to July 8, 2025
  
  // Income transactions
  const incomeCategories = ['Salariu', 'Freelance', 'Investiții'];
  const incomeAmounts = [2500, 800, 300, 1200, 400];
  
  // Expense categories and their typical amounts
  const expenseData = {
    'Mâncare & Restaurante': [25, 45, 80, 120, 35, 60, 90],
    'Transport': [15, 30, 50, 80, 25, 40, 65],
    'Cumpărături': [50, 120, 200, 80, 150, 90, 180],
    'Divertisment': [30, 60, 100, 45, 75, 120, 80],
    'Facturi & Utilități': [150, 200, 180, 220, 160, 190, 210],
    'Sănătate': [40, 80, 120, 60, 100, 150, 90],
    'Educație': [200, 300, 250, 400, 180, 350, 280]
  };

  // Romanian descriptions
  const descriptions = {
    'Mâncare & Restaurante': ['Cumpărături la supermarket', 'Restaurant', 'Cafenea', 'Mâncare la pachet', 'Fast food'],
    'Transport': ['Benzină', 'Transport public', 'Taxi/Uber', 'Întreținere mașină', 'Parcare'],
    'Cumpărături': ['Haine', 'Electronice', 'Articole casă', 'Cumpărături online', 'Cadouri'],
    'Divertisment': ['Cinema', 'Bilete concert', 'Abonament sală', 'Netflix', 'Jocuri video'],
    'Facturi & Utilități': ['Factură electricitate', 'Factură internet', 'Factură telefon', 'Factură apă', 'Factură gaz'],
    'Sănătate': ['Farmacie', 'Vizită la doctor', 'Control stomatologic', 'Rețetă', 'Asigurare medicală'],
    'Educație': ['Curs online', 'Cărți', 'Workshop', 'Conferință', 'Licență software']
  };

  // Generate income transactions (monthly salary, monthly freelance, occasional investments)
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    // Salary only on the 1st of each month
    if (currentDate.getDate() === 1) {
      transactions.push({
        amount: 2500,
        description: 'Salariu lunar',
        date: currentDate.toISOString().split('T')[0],
        type: 'income',
        category: 'Salariu'
      });
    }
    // Freelance income: only on the 15th of each month
    if (currentDate.getDate() === 15) {
      transactions.push({
        amount: incomeAmounts[Math.floor(Math.random() * incomeAmounts.length)],
        description: 'Proiect freelance',
        date: currentDate.toISOString().split('T')[0],
        type: 'income',
        category: 'Freelance'
      });
    }
    // Investment returns: only on the 20th of each month
    if (currentDate.getDate() === 20) {
      transactions.push({
        amount: 300 + Math.random() * 200,
        description: 'Câștig investiții',
        date: currentDate.toISOString().split('T')[0],
        type: 'income',
        category: 'Investiții'
      });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Generate expense transactions
  currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    // Daily expenses (with some randomness)
    if (Math.random() < 0.5) { // 50% chance of daily expense for more realism
      const categoryNames = Object.keys(expenseData);
      const randomCategory = categoryNames[Math.floor(Math.random() * categoryNames.length)];
      const amounts = expenseData[randomCategory];
      const amount = amounts[Math.floor(Math.random() * amounts.length)];
      const categoryDescriptions = descriptions[randomCategory];
      const description = categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];
      transactions.push({
        amount: amount,
        description: description,
        date: currentDate.toISOString().split('T')[0],
        type: 'expense',
        category: randomCategory
      });
    }
    // Add a second expense on weekends for realism
    if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      if (Math.random() < 0.3) {
        const categoryNames = Object.keys(expenseData);
        const randomCategory = categoryNames[Math.floor(Math.random() * categoryNames.length)];
        const amounts = expenseData[randomCategory];
        const amount = amounts[Math.floor(Math.random() * amounts.length)];
        const categoryDescriptions = descriptions[randomCategory];
        const description = categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];
        transactions.push({
          amount: amount,
          description: description,
          date: currentDate.toISOString().split('T')[0],
          type: 'expense',
          category: randomCategory
        });
      }
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return transactions;
};

// Main function to populate data
async function populateDemoData() {
  try {
    console.log('🚀 Starting demo data population...');
    
    // Step 1: Login to get token
    console.log('🔐 Logging in...');
    let token;
    try {
      const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: DEMO_USER_EMAIL,
        password: DEMO_USER_PASSWORD
      });
      token = loginResponse.data.token;
      console.log('✅ Login successful');
    } catch (error) {
      console.error('❌ Login failed:', error.response ? error.response.data : error.message);
      console.log('💡 Please make sure your backend server is running and your credentials are correct.');
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };
    
    // Step 2: Clear existing data
    console.log('🧹 Clearing existing data...');
    try {
      // Get existing transactions and delete them
      const existingTransactions = await axios.get(`${API_BASE_URL}/expenses`, { headers });
      for (const transaction of existingTransactions.data) {
        await axios.delete(`${API_BASE_URL}/expenses/${transaction._id}`, { headers });
      }
      console.log('✅ Cleared existing transactions');
      // Get existing categories and delete them
      const existingCategories = await axios.get(`${API_BASE_URL}/categories`, { headers });
      for (const category of existingCategories.data) {
        await axios.delete(`${API_BASE_URL}/categories/${category._id}`, { headers });
      }
      console.log('✅ Cleared existing categories');
    } catch (error) {
      console.log('⚠️  Could not clear existing data, continuing...');
    }
    
    // Step 3: Create categories
    console.log('📂 Creare categorii în română...');
    for (const category of categories) {
      try {
        await axios.post(`${API_BASE_URL}/categories`, category, { headers });
        console.log(`✅ Creată categoria: ${category.name}`);
      } catch (error) {
        console.log(`❌ Eroare la crearea categoriei ${category.name}:`, error.response ? error.response.data : error.message);
      }
    }
    
    // Step 4: Fetch all categories for the user and build a fresh name-to-_id map
    let categoryIds = {};
    try {
      const allCategories = await axios.get(`${API_BASE_URL}/categories`, { headers });
      for (const cat of allCategories.data) {
        categoryIds[cat.name] = cat._id;
      }
      console.log('✅ Mapped all category names to their _id.');
    } catch (error) {
      console.log('❌ Eroare la maparea categoriilor:', error.response ? error.response.data : error.message);
      return;
    }
    
    // Step 5: Generate and add transactions
    console.log('💰 Generez tranzacții...');
    const transactions = generateTransactions();
    let addedCount = 0;
    for (const transaction of transactions) {
      try {
        const transactionData = {
          amount: transaction.amount,
          description: transaction.description,
          date: transaction.date,
          type: transaction.type,
          category: categoryIds[transaction.category] || null
        };
        await axios.post(`${API_BASE_URL}/expenses`, transactionData, { headers });
        addedCount++;
        if (addedCount % 10 === 0) {
          console.log(`📊 Adăugate ${addedCount} tranzacții...`);
        }
      } catch (error) {
        console.log(`❌ Eroare la adăugarea tranzacției: ${transaction.description}`, error.response ? error.response.data : error.message);
      }
    }
    
    console.log('🎉 Populare demo completă!');
    console.log(`📈 Total tranzacții adăugate: ${addedCount}`);
    console.log(`📅 Perioadă: 1 ianuarie 2024 - 8 iulie 2025`);
    console.log(`👤 Contul tău: ${DEMO_USER_EMAIL}`);
    console.log('\n💡 Acum poți intra cu datele tale și să vezi datele demo în română!');
    
  } catch (error) {
    console.error('❌ Eroare la popularea datelor demo:', error.message);
    if (error.response) {
      console.error('Răspuns:', error.response.data);
    }
    console.log('💡 Asigură-te că backend-ul rulează pe http://localhost:5000');
  }
}

// Run the script
populateDemoData(); 