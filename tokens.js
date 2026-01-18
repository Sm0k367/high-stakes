/**
 * EPIC TECH AI // SMOKEN_TOKEN_SYSTEM
 * TRACKING NEURAL ENGAGEMENT
 */

let userTokens = parseInt(localStorage.getItem('smoken_tokens')) || 0;

function addTokens(amount) {
    userTokens += amount;
    localStorage.setItem('smoken_tokens', userTokens);
    updateTokenUI();
    logToTerminal(`NEURAL_REWARD: +${amount} SMOKEN_TOKENS`, 'ECONOMY');
}

function updateTokenUI() {
    const statusBox = document.getElementById('system-load');
    // We repurpose the load box or add a new one
    statusBox.title = `TOTAL_TOKENS: ${userTokens}`;
}

// Automatically reward the user for boot-up
window.addEventListener('load', () => {
    setTimeout(() => {
        addTokens(10); // Reward for entering the High-Stakes zone
    }, 5000);
});
