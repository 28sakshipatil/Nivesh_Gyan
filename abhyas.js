// Virtual Trading Simulator JavaScript

// Global Variables
let virtualBalance = 1000000; // ₹10 lakh starting balance
let portfolio = {};
let watchlist = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK'];
let transactionHistory = [];

// Mock stock data (in real app, this would come from API)
const mockStocks = {
  'RELIANCE': { name: 'Reliance Industries Ltd', price: 2456.75, change: +12.50 },
  'TCS': { name: 'Tata Consultancy Services', price: 3967.80, change: -23.45 },
  'INFY': { name: 'Infosys Limited', price: 1789.30, change: +45.20 },
  'HDFCBANK': { name: 'HDFC Bank Limited', price: 1654.90, change: -8.75 },
  'ICICIBANK': { name: 'ICICI Bank Limited', price: 1267.45, change: +15.60 },
  'WIPRO': { name: 'Wipro Limited', price: 567.20, change: +3.45 },
  'LT': { name: 'Larsen & Toubro Ltd', price: 3789.65, change: -12.30 },
  'BAJFINANCE': { name: 'Bajaj Finance Limited', price: 7234.50, change: +89.75 },
  'MARUTI': { name: 'Maruti Suzuki India Ltd', price: 12456.80, change: -156.20 },
  'ASIANPAINT': { name: 'Asian Paints Limited', price: 3245.90, change: +23.40 }
};

// DOM Elements
const balanceElement = document.getElementById('balance');
const portfolioValueElement = document.getElementById('portfolio-value');
const totalPnlElement = document.getElementById('total-pnl');
const stockSearchInput = document.getElementById('stock-search');
const searchBtn = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');
const tradeForm = document.getElementById('trade-form');
const stockInfo = document.getElementById('stock-info');
const quantityInput = document.getElementById('quantity');
const priceInput = document.getElementById('price');
const totalAmountElement = document.getElementById('total-amount');
const placeOrderBtn = document.getElementById('place-order');
const startSimulationBtn = document.getElementById('start-simulation');
const resetSimulationBtn = document.getElementById('reset-simulation');

let selectedStock = null;

// Initialize the simulator
function initializeSimulator() {
  updateDisplay();
  loadWatchlist();
  setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
  searchBtn.addEventListener('click', searchStocks);
  stockSearchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchStocks();
  });
  
  quantityInput.addEventListener('input', calculateTotal);
  placeOrderBtn.addEventListener('click', placeOrder);
  startSimulationBtn.addEventListener('click', startSimulation);
  resetSimulationBtn.addEventListener('click', resetSimulation);
}

// Search stocks function
function searchStocks() {
  const query = stockSearchInput.value.toUpperCase().trim();
  searchResults.innerHTML = '';
  
  if (query.length < 2) {
    showAlert('Please enter at least 2 characters', 'error');
    return;
  }
  
  const matches = Object.keys(mockStocks).filter(symbol => 
    symbol.includes(query) || mockStocks[symbol].name.toUpperCase().includes(query)
  );
  
  if (matches.length === 0) {
    searchResults.innerHTML = '<p style="color: #888; text-align: center; padding: 1rem;">No stocks found</p>';
    return;
  }
  
  matches.forEach(symbol => {
    const stock = mockStocks[symbol];
    const resultDiv = document.createElement('div');
    resultDiv.className = 'stock-result';
    resultDiv.innerHTML = `
      <div>
        <div class="stock-name">${symbol}</div>
        <div style="color: #cccccc; font-size: 0.9rem;">${stock.name}</div>
      </div>
      <div>
        <div class="stock-price">₹${stock.price.toFixed(2)}</div>
        <div style="color: ${stock.change >= 0 ? '#00ff88' : '#ff4444'}; font-size: 0.9rem;">
          ${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}
        </div>
      </div>
    `;
    
    resultDiv.addEventListener('click', () => selectStock(symbol, stock));
    searchResults.appendChild(resultDiv);
  });
}

// Select stock for trading
function selectStock(symbol, stock) {
  selectedStock = { symbol, ...stock };
  
  stockInfo.innerHTML = `
    <h4 style="color: #00ff88; margin-bottom: 0.5rem;">${symbol}</h4>
    <p style="color: #cccccc; margin-bottom: 0.5rem;">${stock.name}</p>
    <p style="color: #ffffff; font-size: 1.1rem; font-weight: bold;">₹${stock.price.toFixed(2)}</p>
  `;
  
  priceInput.value = stock.price.toFixed(2);
  tradeForm.style.display = 'block';
  calculateTotal();
}

// Calculate total amount
function calculateTotal() {
  if (!selectedStock) return;
  
  const quantity = parseInt(quantityInput.value) || 0;
  const price = parseFloat(priceInput.value) || 0;
  const total = quantity * price;
  
  totalAmountElement.textContent = total.toLocaleString('en-IN', { minimumFractionDigits: 2 });
}

// Place order
function placeOrder() {
  if (!selectedStock) {
    showAlert('Please select a stock first', 'error');
    return;
  }
  
  const orderType = document.getElementById('order-type').value;
  const quantity = parseInt(quantityInput.value) || 0;
  const price = parseFloat(priceInput.value) || 0;
  const total = quantity * price;
  
  if (quantity <= 0) {
    showAlert('Please enter a valid quantity', 'error');
    return;
  }
  
  if (orderType === 'buy') {
    if (total > virtualBalance) {
      showAlert('Insufficient balance for this purchase', 'error');
      return;
    }
    
    // Execute buy order
    virtualBalance -= total;
    
    if (portfolio[selectedStock.symbol]) {
      portfolio[selectedStock.symbol].quantity += quantity;
      portfolio[selectedStock.symbol].avgPrice = 
        ((portfolio[selectedStock.symbol].avgPrice * (portfolio[selectedStock.symbol].quantity - quantity)) + total) / 
        portfolio[selectedStock.symbol].quantity;
    } else {
      portfolio[selectedStock.symbol] = {
        name: selectedStock.name,
        quantity: quantity,
        avgPrice: price,
        currentPrice: price
      };
    }
    
    showAlert(`Successfully bought ${quantity} shares of ${selectedStock.symbol}`, 'success');
    
  } else { // sell order
    if (!portfolio[selectedStock.symbol] || portfolio[selectedStock.symbol].quantity < quantity) {
      showAlert('Insufficient shares to sell', 'error');
      return;
    }
    
    // Execute sell order
    virtualBalance += total;
    portfolio[selectedStock.symbol].quantity -= quantity;
    
    if (portfolio[selectedStock.symbol].quantity === 0) {
      delete portfolio[selectedStock.symbol];
    }
    
    showAlert(`Successfully sold ${quantity} shares of ${selectedStock.symbol}`, 'success');
  }
  
  // Record transaction
  transactionHistory.push({
    symbol: selectedStock.symbol,
    type: orderType,
    quantity: quantity,
    price: price,
    total: total,
    timestamp: new Date()
  });
  
  updateDisplay();
  tradeForm.style.display = 'none';
  stockSearchInput.value = '';
  searchResults.innerHTML = '';
}

// Show portfolio
function showPortfolio() {
  hideAllDisplays();
  const portfolioDisplay = document.getElementById('portfolio-display');
  const holdingsList = document.getElementById('holdings-list');
  
  portfolioDisplay.style.display = 'block';
  holdingsList.innerHTML = '';
  
  if (Object.keys(portfolio).length === 0) {
    holdingsList.innerHTML = '<p style="text-align: center; color: #888;">No holdings yet. Start trading to build your portfolio!</p>';
    return;
  }
  
  Object.keys(portfolio).forEach(symbol => {
    const holding = portfolio[symbol];
    const currentPrice = mockStocks[symbol] ? mockStocks[symbol].price : holding.avgPrice;
    const currentValue = holding.quantity * currentPrice;
    const investedValue = holding.quantity * holding.avgPrice;
    const pnl = currentValue - investedValue;
    const pnlPercentage = (pnl / investedValue) * 100;
    
    const holdingDiv = document.createElement('div');
    holdingDiv.className = 'holding-item';
    holdingDiv.innerHTML = `
      <div class="holding-info">
        <h4>${symbol}</h4>
        <p>${holding.name}</p>
        <p>Qty: ${holding.quantity} | Avg: ₹${holding.avgPrice.toFixed(2)}</p>
      </div>
      <div class="holding-value">
        <p style="color: #ffffff; font-weight: bold;">₹${currentValue.toLocaleString('en-IN')}</p>
        <p class="holding-pnl ${pnl >= 0 ? 'positive' : 'negative'}">
          ${pnl >= 0 ? '+' : ''}₹${pnl.toFixed(2)} (${pnlPercentage.toFixed(2)}%)
        </p>
      </div>
    `;
    holdingsList.appendChild(holdingDiv);
  });
}

// Show performance
function showPerformance() {
  hideAllDisplays();
  const performanceDisplay = document.getElementById('performance-display');
  performanceDisplay.style.display = 'block';
  
  // Simple canvas chart
  const canvas = document.getElementById('performance-chart-canvas');
  const ctx = canvas.getContext('2d');
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw simple performance chart
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 3;
  ctx.beginPath();
  
  // Mock performance data
  const performanceData = [1000000, 1020000, 995000, 1045000, 1038000, 1067000, 1089000];
  const maxValue = Math.max(...performanceData);
  const minValue = Math.min(...performanceData);
  const range = maxValue - minValue;
  
  performanceData.forEach((value, index) => {
    const x = (index / (performanceData.length - 1)) * (canvas.width - 40) + 20;
    const y = canvas.height - 40 - ((value - minValue) / range) * (canvas.height - 80);
    
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  
  ctx.stroke();
  
  // Add labels
  ctx.fillStyle = '#cccccc';
  ctx.font = '12px Arial';
  ctx.fillText('Portfolio Performance', 20, 20);
  ctx.fillText(`₹${performanceData[0].toLocaleString('en-IN')}`, 20, canvas.height - 10);
  ctx.fillText(`₹${performanceData[performanceData.length - 1].toLocaleString('en-IN')}`, canvas.width - 80, canvas.height - 10);
}

// Show watchlist
function showWatchlist() {
  hideAllDisplays();
  const watchlistDisplay = document.getElementById('watchlist-display');
  const watchlistStocks = document.getElementById('watchlist-stocks');
  
  watchlistDisplay.style.display = 'block';
  watchlistStocks.innerHTML = '';
  
  watchlist.forEach(symbol => {
    const stock = mockStocks[symbol];
    if (stock) {
      const watchlistDiv = document.createElement('div');
      watchlistDiv.className = 'watchlist-item';
      watchlistDiv.innerHTML = `
        <h4 style="color: #00ff88; margin-bottom: 0.5rem;">${symbol}</h4>
        <p style="color: #cccccc; font-size: 0.9rem; margin-bottom: 0.5rem;">${stock.name}</p>
        <p style="color: #ffffff; font-weight: bold;">₹${stock.price.toFixed(2)}</p>
        <p style="color: ${stock.change >= 0 ? '#00ff88' : '#ff4444'};">
          ${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}
        </p>
      `;
      
      watchlistDiv.addEventListener('click', () => {
        stockSearchInput.value = symbol;
        selectStock(symbol, stock);
        hideAllDisplays();
      });
      
      watchlistStocks.appendChild(watchlistDiv);
    }
  });
}

// Load watchlist on page load
function loadWatchlist() {
  showWatchlist();
}

// Hide all display sections
function hideAllDisplays() {
  document.getElementById('portfolio-display').style.display = 'none';
  document.getElementById('performance-display').style.display = 'none';
  document.getElementById('watchlist-display').style.display = 'none';
}

// Update display elements
function updateDisplay() {
  balanceElement.textContent = virtualBalance.toLocaleString('en-IN');
  
  // Calculate portfolio value
  let portfolioValue = 0;
  let totalInvested = 0;
  
  Object.keys(portfolio).forEach(symbol => {
    const holding = portfolio[symbol];
    const currentPrice = mockStocks[symbol] ? mockStocks[symbol].price : holding.avgPrice;
    portfolioValue += holding.quantity * currentPrice;
    totalInvested += holding.quantity * holding.avgPrice;
  });
  
  portfolioValueElement.textContent = portfolioValue.toLocaleString('en-IN');
  
  // Calculate total P&L
  const totalPnl = portfolioValue - totalInvested;
  totalPnlElement.textContent = `₹${totalPnl.toLocaleString('en-IN')}`;
  totalPnlElement.className = `pnl-amount ${totalPnl >= 0 ? 'positive' : 'negative'}`;
}

// Show alert messages
function showAlert(message, type) {
  // Remove existing alerts
  const existingAlert = document.querySelector('.alert');
  if (existingAlert) {
    existingAlert.remove();
  }
  
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert ${type}`;
  alertDiv.textContent = message;
  
  const section = document.querySelector('.section');
  section.insertBefore(alertDiv, section.firstChild.nextSibling.nextSibling);
  
  // Auto remove alert after 3 seconds
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.remove();
    }
  }, 3000);
}

// Start simulation
function startSimulation() {
  showAlert('Virtual trading simulation started! You can now practice with ₹10,00,000 virtual capital.', 'success');
  
  // Simulate real-time price updates
  setInterval(updatePrices, 5000); // Update prices every 5 seconds
}

// Update stock prices (simulation)
function updatePrices() {
  Object.keys(mockStocks).forEach(symbol => {
    const stock = mockStocks[symbol];
    // Random price movement between -2% to +2%
    const changePercent = (Math.random() - 0.5) * 0.04;
    const newPrice = stock.price * (1 + changePercent);
    const priceChange = newPrice - stock.price;
    
    mockStocks[symbol].price = newPrice;
    mockStocks[symbol].change = priceChange;
  });
  
  updateDisplay();
  
  // Update displayed prices if stock is selected
  if (selectedStock && mockStocks[selectedStock.symbol]) {
    priceInput.value = mockStocks[selectedStock.symbol].price.toFixed(2);
    calculateTotal();
  }
}

// Reset simulation
function resetSimulation() {
  if (confirm('Are you sure you want to reset your portfolio? This action cannot be undone.')) {
    virtualBalance = 1000000;
    portfolio = {};
    transactionHistory = [];
    selectedStock = null;
    
    updateDisplay();
    hideAllDisplays();
    tradeForm.style.display = 'none';
    stockSearchInput.value = '';
    searchResults.innerHTML = '';
    
    showAlert('Portfolio reset successfully! Starting fresh with ₹10,00,000.', 'success');
  }
}

// Simulate market data updates
function simulateMarketData() {
  // Add some realistic price movements
  const movements = [
    { symbol: 'RELIANCE', change: Math.random() * 20 - 10 },
    { symbol: 'TCS', change: Math.random() * 30 - 15 },
    { symbol: 'INFY', change: Math.random() * 25 - 12.5 }
  ];
  
  movements.forEach(movement => {
    if (mockStocks[movement.symbol]) {
      mockStocks[movement.symbol].price += movement.change;
      mockStocks[movement.symbol].change = movement.change;
    }
  });
}

// Add to watchlist function
function addToWatchlist(symbol) {
  if (!watchlist.includes(symbol)) {
    watchlist.push(symbol);
    showAlert(`${symbol} added to watchlist`, 'success');
    showWatchlist();
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initializeSimulator);

// Auto-start price simulation
setTimeout(() => {
  setInterval(simulateMarketData, 3000);
}, 2000);