// alert types
const ABOVE_ALERT = "above";
const BELOW_ALERT = "below";
// specifically for ADD_ALERTS_PAGE
const MAX_ALERTS = 10;
const MAX_ALERT_PRICE = 1000000000;
// decimal places
const MAX_DECIMAL_PLACES = 10;
// page constants
const ALERTS_PAGE = "/alerts";
const ADD_ALERT_PAGE = "/addAlert";
const PRICES_PAGE = "/prices";

const assets = { "bitcoin": { "symbol": "BTC", "id": "bitcoin", "name": "Bitcoin", "price": 0, "isDisplayed": true }, "ethereum": { "symbol": "ETH", "id": "ethereum", "name": "Ethereum", "price": 0, "isDisplayed": true }, "binance-coin": { "symbol": "BNB", "id": "binance-coin", "name": "Binance Coin", "price": 0, "isDisplayed": true }, "solana": { "symbol": "SOL", "id": "solana", "name": "Solana", "price": 0, "isDisplayed": true }, "cardano": { "symbol": "ADA", "id": "cardano", "name": "Cardano", "price": 0, "isDisplayed": true }, "xrp": { "symbol": "XRP", "id": "xrp", "name": "XRP", "price": 0, "isDisplayed": true }, "polkadot": { "symbol": "DOT", "id": "polkadot", "name": "Polkadot", "price": 0, "isDisplayed": true }, "dogecoin": { "symbol": "DOGE", "id": "dogecoin", "name": "Dogecoin", "price": 0, "isDisplayed": true }, "avalanche": { "symbol": "AVAX", "id": "avalanche", "name": "Avalanche", "price": 0, "isDisplayed": true }, "litecoin": { "symbol": "LTC", "id": "litecoin", "name": "Litecoin", "price": 0, "isDisplayed": true } };

const currencyData = { "USD": 0, "AUD": 0, "CAD": 0, "CNY": 0, "CZK": 0, "EUR": 0, "HKD": 0, "INR": 0, "JPY": 0, "KRW": 0 };

var getCoinDisplayName = (coinId, coinSymbol) => {
    const nameParts = coinId.split("-");
    let nameString = "";
    nameParts.forEach((part) => {
        nameString += part.charAt(0).toUpperCase() + part.slice(1) + " ";
    });
    if (coinSymbol) {
        nameString += "(" + coinSymbol + ")";
    }
    else {
        nameString = nameString.substring(0, nameString.length - 1);
    }
    return nameString;
};

// Synchronous functions to access and modify Chrome's local storage
const getLocalStorageSync = (key) => {
    return new Promise(resolve => {
        chrome.storage.local.get([key], (value) => {
            resolve(value[key]);
        });
    });
};
const setLocalStorageSync = (key, value) => {
    return new Promise(resolve => {
        chrome.storage.local.set({ [key]: value }, () => {
            resolve(null);
        });
    });
};
const clearLocalStorageSync = () => {
    return new Promise(resolve => {
        chrome.storage.local.clear(() => {
            resolve(null);
        });
    });
};

export { ABOVE_ALERT as A, BELOW_ALERT as B, MAX_ALERTS as M, PRICES_PAGE as P, currencyData as a, assets as b, clearLocalStorageSync as c, getCoinDisplayName as d, ALERTS_PAGE as e, ADD_ALERT_PAGE as f, getLocalStorageSync as g, MAX_DECIMAL_PLACES as h, MAX_ALERT_PRICE as i, setLocalStorageSync as s };
