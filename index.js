// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!

// DOM Elements
const stateInput = document.getElementById('state-input');
const fetchButton = document.getElementById('fetch-alerts');
const alertsDisplay = document.getElementById('alerts-display');
const errorMessage = document.getElementById('error-message');

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

// Clear error message
function clearError() {
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');
}

// Clear alerts display
function clearAlerts() {
    alertsDisplay.innerHTML = '';
}

// Clear input field
function clearInput() {
    stateInput.value = '';
}

// State abbreviation validation
function isValidStateAbbr(abbr) {
    return /^[A-Z]{2}$/.test(abbr);
}

// Main function to fetch weather alerts
async function fetchWeatherAlerts(stateAbbr) {
    // Clear previous errors and alerts
    clearError();
    clearAlerts();
    
    // Validate input
    if (!stateAbbr || stateAbbr.trim() === '') {
        showError('Please enter a state abbreviation.');
        return;
    }
    
    const upperStateAbbr = stateAbbr.trim().toUpperCase();
    
    if (!isValidStateAbbr(upperStateAbbr)) {
        showError('Please enter a valid 2-letter state code (e.g., CA, NY, TX).');
        return;
    }
    
    try {
        // Make API request
        const response = await fetch(`https://api.weather.gov/alerts/active?area=${upperStateAbbr}`);
        
        // Check if response is OK
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Parse JSON response
        const data = await response.json();
        
        // Display alerts - TESTS WANT SPECIFIC FORMAT!
        displayAlerts(data);
        
        // Clear input field (as per requirements)
        clearInput();
        
    } catch (error) {
        // Show error message
        showError(`Failed to fetch weather alerts: ${error.message}`);
    }
}

// Function to display alerts on the page
// TESTS EXPECT: "Weather Alerts: X" where X is number of alerts
function displayAlerts(data) {
    // Check if we have alerts
    if (!data.features || data.features.length === 0) {
        alertsDisplay.innerHTML = `
            <div>Weather Alerts: 0</div>
        `;
        return;
    }
    
    // Get number of alerts
    const alertCount = data.features.length;
    
    // Create HTML for alerts - TESTS WANT SPECIFIC FORMAT!
    let alertsHTML = `<div>Weather Alerts: ${alertCount}</div>`;
    
    // Add each alert headline
    data.features.forEach((alert, index) => {
        const alertData = alert.properties;
        const headline = alertData.headline || 'No headline available';
        
        // TESTS want each headline on its own line
        alertsHTML += `<div>${headline}</div>`;
    });
    
    // Update the display
    alertsDisplay.innerHTML = alertsHTML;
}

// Event Listeners

// Fetch button click
fetchButton.addEventListener('click', () => {
    const stateAbbr = stateInput.value;
    fetchWeatherAlerts(stateAbbr);
});

// Enter key in input field
stateInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        fetchButton.click();
    }
});

// Auto-uppercase input as user types
stateInput.addEventListener('input', (event) => {
    event.target.value = event.target.value.toUpperCase();
});

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Weather Alerts App loaded and ready!');
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchWeatherAlerts,
        displayAlerts,
        isValidStateAbbr,
        showError,
        clearError,
        clearAlerts,
        clearInput
    };
}