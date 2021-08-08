import axios from 'axios';

const apiCryptoNames = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'LTC': 'litecoin',
  'DOGE': 'dogecoin'
}

chrome.runtime.onInstalled.addListener(function() {
  setInterval(() => {
    chrome.storage.local.get(['limits'], (result) => {
      result.limits.forEach((limit, index) =>  {
        const url = 'https://api.coincap.io/v2/assets/' + apiCryptoNames[limit.crypto];
        axios.get(url)
        .then((response) => {
          if (checkResponse(limit, Number(response.data.data.priceUsd))) {
            limit.reached = true;
            result.limits[index]= limit;
            chrome.storage.local.set({limits: result.limits});

            var opt = {
              iconUrl: "icons/all_sizes.png",
              type: 'basic',
              title: 'Crypto Flux - Limit Reached',
              message: `Your limit price for ${limit.crypto} ${limit.zone.toLowerCase()} $${limit.price} ${limit.currency} was just reached!`,
            };
            chrome.notifications.create(`notification-${Date.now()}`, opt);
      
          }
        });
      });
    });
    
  }, 30000);
});

const checkResponse = (limit, cryptoPrice) => {
  if (limit.reached) return false;

  let limitPrice = limit.price;
  if (limit.currency != 'USD') {
    axios.get("https://api.exchangeratesapi.io/latest?base=USD")
    .then(response => {
      limitPrice *= response.data.rates[limit.currency];
    });
  }

  if (limit.zone == 'Above' && cryptoPrice > limitPrice || limit.zone == 'Below' && cryptoPrice < limitPrice) {
    return true;
  }
  return false;
}
