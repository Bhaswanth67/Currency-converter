document.addEventListener('DOMContentLoaded', function () {
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    const amount = document.getElementById('amount');
    const result = document.getElementById('result');
    const form = document.getElementById('converter-form');
    const reverseBtn = document.getElementById('reverse-btn');

    const apiKey = 'your_api_key_here';

    // Fetch all available currencies
    fetch(`https://api.currencyapi.com/v3/latest?apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const currencies = Object.keys(data.data);
            currencies.forEach(currency => {
                const option1 = document.createElement('option');
                option1.value = currency;
                option1.textContent = currency;
                fromCurrency.appendChild(option1);

                const option2 = document.createElement('option');
                option2.value = currency;
                option2.textContent = currency;
                toCurrency.appendChild(option2);
            });
        });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const from = fromCurrency.value;
        const to = toCurrency.value;
        const amountValue = amount.value;
        
        try {
            const response = await fetch(`https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=${from}`);
            const data = await response.json();
            const rate = data.data[to].value;
            const convertedAmount = (amountValue * rate).toFixed(2);
            result.textContent = `${amountValue} ${from} = ${convertedAmount} ${to}`;
        } catch (error) {
            result.textContent = 'Error fetching exchange rates.';
        }
    });

    // Handle reverse button click
    reverseBtn.addEventListener('click', function () {
        const temp = fromCurrency.value;
        fromCurrency.value = toCurrency.value;
        toCurrency.value = temp;

        // Trigger conversion after reversing
        form.dispatchEvent(new Event('submit'));
    });
});
