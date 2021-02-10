import axios from 'axios'

const apiCryptoNames = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'LTC': 'litecoin'
}

chrome.runtime.onInstalled.addListener(function() {

  setInterval(() => {
    let notifications = [];
    chrome.storage.local.get(['limits'], (result) => {
      result.limits.forEach((limit, index) =>  {
        const url = 'https://api.coincap.io/v2/assets/' + apiCryptoNames[limit.crypto];
        axios.get(url)
        .then((response) => {
          if (checkResponse(limit, Number(response.data.data.priceUsd))) {
            notifications.push(limit);
            limit.reached = true;
            result.limits[index]= limit;
            chrome.storage.local.set({limits: result.limits});
          }
        });
      });
    });
    
    if (notifications.length > 0) {
      //chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        //chrome.tabs.sendMessage(tabs[0].id, {notifications});
      //});
    }

  }, 5000);

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
