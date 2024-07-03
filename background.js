const apiKey = 'your_api_key_here';

// Function to fetch exchange rates
async function fetchExchangeRates() {
  try {
    const response = await fetch(`https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=USD`);
    const data = await response.json();
    chrome.storage.local.set({ exchangeRates: data });

    // Save the current timestamp
    const now = new Date().toLocaleString();
    chrome.storage.local.set({ lastUpdated: now });

  } catch (error) {
    console.error('Error fetching exchange rates:', error);
  }
}

// Set up an alarm to fetch exchange rates every 60 minutes
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('fetchRates', { periodInMinutes: 60 });
  fetchExchangeRates();  // Fetch immediately upon installation
});

// Fetch exchange rates when the browser starts
chrome.runtime.onStartup.addListener(() => {
  fetchExchangeRates();
});

// Handle the alarm event to fetch exchange rates
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'fetchRates') {
    fetchExchangeRates().then(() => {
      chrome.storage.local.get('exchangeRates', data => {
        const rates = data.exchangeRates.data;
        if (rates) {
          const message = `1 USD = ${rates['EUR'].value} EUR`;
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon128.png',
            title: 'Exchange Rate Update',
            message: message
          });
        }
      });
    });
  }
});
