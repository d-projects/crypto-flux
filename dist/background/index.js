import { c as clearLocalStorageSync, s as setLocalStorageSync, a as currencyData, g as getLocalStorageSync, b as assets, A as ABOVE_ALERT, B as BELOW_ALERT, d as getCoinDisplayName } from '../chunks/localStorageSync-05cd7a38.js';

// all numbers are in ms
const SOCKET_RESTART_DELAY = 10000;
const PRICE_PROCESS_DELAY = 10000;
const CURRENCY_PROCESS_DELAY = 86400000; // 24 hours

let ws;
let previousPriceProcessStartTime;
let previousCurrencyProcessStartTime;
/**
  Creates a desktop alert
*/
const createAlert = (alert) => {
    const opt = {
        type: "basic",
        iconUrl: "assets/all_sizes.png",
        title: 'Crypto Flux - Alert',
        message: `${getCoinDisplayName(alert['id'])} ${alert.type.toLowerCase()} ${alert['price']} ${alert['currency']}!`,
    };
    chrome.notifications.create(`CryptoFlux-${Date.now()}`, opt);
    console.info("ALERT", opt);
};
/**
  Converts a price from one currency to another
*/
const convertCurrency = async (fromCurr, toCurr, price) => {
    const currencies = await getLocalStorageSync("currencies");
    return (currencies[toCurr] / currencies[fromCurr]) * price;
};
/**
  Checks stored alerts (in chrome's local storage). If any are met with the current
  price data, an alert is sent.
*/
const checkForAndSendAlerts = async () => {
    const alerts = await getLocalStorageSync("alerts");
    if (!alerts)
        return;
    const updatedAlerts = [];
    for (const alert of alerts) {
        const currentPriceUSD = assets[alert['id']]['price'];
        const alertPriceUSD = await convertCurrency(alert['currency'], 'USD', alert['price']);
        if (!alert['met']) {
            if (alert['type'] === ABOVE_ALERT && currentPriceUSD > alertPriceUSD) {
                createAlert(alert);
                alert['met'] = true;
            }
            else if (alert['type'] === BELOW_ALERT && currentPriceUSD < alertPriceUSD) {
                createAlert(alert);
                alert['met'] = true;
            }
        }
        updatedAlerts.push(alert);
    }
    await setLocalStorageSync("alerts", updatedAlerts);
};
/**
  Fectches currency prices from an API
*/
const fetchCurrencyData = async () => {
    const result = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await result.json();
    for (const currency in currencyData) {
        currencyData[currency] = data.rates[currency];
    }
    await setLocalStorageSync("currencies", currencyData);
};
/**
  Creates the onMessage and onclose callbacks for an websocket connection
*/
const resetPriceWS = (ws) => {
    ws.onmessage = async (msg) => {
        console.info("WS message received");
        const data = JSON.parse(msg.data);
        for (const [coinId, price] of Object.entries(data)) {
            assets[coinId]['price'] = price;
        }
        const currencyTimeFloor = getCurrencyTimeFloor();
        const priceTimeFloor = getPriceTimeFloor();
        if (previousCurrencyProcessStartTime < currencyTimeFloor) {
            console.info("Fetching currency data");
            await fetchCurrencyData();
            previousCurrencyProcessStartTime = currencyTimeFloor;
        }
        if (previousPriceProcessStartTime === priceTimeFloor)
            return;
        console.info("Updating price data");
        // For testing purposes
        console.info(assets);
        console.info(currencyData);
        previousPriceProcessStartTime = priceTimeFloor;
        await setLocalStorageSync("priceData", assets);
        await checkForAndSendAlerts();
        chrome.runtime.sendMessage('prices-updated');
    };
    ws.onclose = async () => {
        console.info("Price WS connection closed");
        await new Promise(resolve => setTimeout(resolve, SOCKET_RESTART_DELAY));
        startNewPriceWS();
    };
};
/**
  Starts a new web socket connection for crypto price data
*/
const startNewPriceWS = async () => {
    console.info("Starting new Price WS connection");
    const assetsString = await getAssetsString();
    ws = new WebSocket("wss://ws.coincap.io/prices?assets=" + assetsString);
    resetPriceWS(ws);
};
/********************************* Helper Functions *****************************/
/**
 * Creates a string of crypto id names, each separates by a comma (except for
 * the last one)
 */
const createAssetsString = (priceData) => {
    let assets = "";
    for (const coinId of Object.keys(priceData)) {
        assets += coinId + ',';
    }
    assets = assets.substring(0, assets.length - 1);
    return assets;
};
/**
 * Creates and returns the asset string needed for the crypto price web socket connection
 */
const getAssetsString = async () => {
    const priceData = await getLocalStorageSync("priceData");
    return createAssetsString(priceData);
};
/**
 * Calculates and returns the immediately lower Unix timestamp that is a multiple of
 * PRICE_PROCESS_DELAY
 */
const getPriceTimeFloor = () => {
    let time = new Date().getTime();
    time = time - time % PRICE_PROCESS_DELAY;
    return time;
};
/**
 * Calculates and returns the immediately lower Unix timestamp that is a multiple of
 * CURRENCY_PROCESS_DELAY
 */
const getCurrencyTimeFloor = () => {
    let time = new Date().getTime();
    time = time - time % CURRENCY_PROCESS_DELAY;
    return time;
};
/*******************************************************************************/
const initialPricesFetch = async () => {
    try {
        const response = await fetch("https://api.coincap.io/v2/assets?limit=1000");
        // @ts-ignore
        const data = await response.json();
        data.data.forEach((coin) => {
            if (coin.id in assets) {
                assets[coin.id].price = parseFloat(coin.priceUsd);
            }
        });
        console.info("Initial fetch successful");
    }
    catch (err) {
        console.info("Intial fetch unsuccessful");
    }
};
const init = async () => {
    previousPriceProcessStartTime = getPriceTimeFloor() - PRICE_PROCESS_DELAY;
    previousCurrencyProcessStartTime = getCurrencyTimeFloor();
    await clearLocalStorageSync();
    await fetchCurrencyData();
    await initialPricesFetch();
    await setLocalStorageSync("priceData", assets);
    startNewPriceWS();
};
chrome.runtime.onInstalled.addListener(() => {
    init();
});
