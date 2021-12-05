
import {alertInterface, priceDataInterface} from '../common/types';
import {ABOVE_ALERT, BELOW_ALERT} from '../common/constants';
import {SOCKET_RESTART_DELAY, PRICE_PROCESS_DELAY, CURRENCY_PROCESS_DELAY} from "./constants";
import assets from "./assets";
import currencies from "./currencies"
import getCoinDisplayName from "../pages/popup/utils/getCoinDisplayName";
import { getLocalStorageSync, setLocalStorageSync, clearLocalStorageSync } from '../common/localStorageSync';

let ws: any;
let previousPriceProcessStartTime: number;
let previousCurrencyProcessStartTime: number;

/**
  Creates a desktop alert
*/
const createAlert = (alert: alertInterface) => {
  const opt = {
    type: "basic",
    iconUrl: "assets/all_sizes.png",
    title: 'Crypto Flux - Alert',
    message: `${getCoinDisplayName(alert['id'])} ${alert.type.toLowerCase()} ${alert['price']} ${alert['currency']}!`,
  };
  chrome.notifications.create(`CryptoFlux-${Date.now()}`, opt);
  console.info("ALERT", opt);
}


/**
  Converts a price from one currency to another
*/
const convertCurrency = async (fromCurr: string, toCurr: string, price: number) => {
  const currencies = await getLocalStorageSync("currencies");
  return (currencies[toCurr] / currencies[fromCurr]) * price;
}


/**
  Checks stored alerts (in chrome's local storage). If any are met with the current
  price data, an alert is sent.
*/
const checkForAndSendAlerts = async () => {
  const alerts = await getLocalStorageSync("alerts");
  if (!alerts) return;

  const updatedAlerts: alertInterface[] = []
  for (const alert of alerts) {
    const currentPriceUSD = assets[alert['id']]['price'];
    const alertPriceUSD = await convertCurrency(alert['currency'], 'USD', alert['price']);
    if (!alert['met']) {
      if (alert['type'] === ABOVE_ALERT && currentPriceUSD > alertPriceUSD) {
        createAlert(alert);
        alert['met'] = true;
      } else if (alert['type'] === BELOW_ALERT && currentPriceUSD < alertPriceUSD) {
        createAlert(alert);
        alert['met'] = true;
      }
    }
    updatedAlerts.push(alert);
  
  }
  await setLocalStorageSync("alerts", updatedAlerts);
}

/**
  Fectches currency prices from an API
*/
const fetchCurrencyData = async () => {
  const result = await fetch("https://open.er-api.com/v6/latest/USD")
  const data = await result.json();

  for (const currency in currencies) {
    currencies[currency] = data.rates[currency];
  }
  await setLocalStorageSync("currencies", currencies);
}

/**
  Creates the onMessage and onclose callbacks for an websocket connection
*/
const resetPriceWS = (ws: any) => {
    ws.onmessage = async (msg: any) => {
        console.info("WS message received");
        const data: {[key: string]: number} = JSON.parse(msg.data);
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
        if (previousPriceProcessStartTime === priceTimeFloor) return;

        console.info("Updating price data");
        
        // For testing purposes
        console.info(assets);
        console.info(currencies);

        previousPriceProcessStartTime = priceTimeFloor;
        await setLocalStorageSync("priceData", assets);
        await checkForAndSendAlerts();

        chrome.runtime.sendMessage('prices-updated');
    }
    
    ws.onclose = async () => {
        console.info("Price WS connection closed");
        await new Promise(resolve => setTimeout(resolve, SOCKET_RESTART_DELAY));
        startNewPriceWS();
    }
}

/**
  Starts a new web socket connection for crypto price data
*/
const startNewPriceWS = async () => {
  console.info("Starting new Price WS connection");
  const assetsString = await getAssetsString();
  ws = new WebSocket("wss://ws.coincap.io/prices?assets=" + assetsString);
  resetPriceWS(ws);
}

/********************************* Helper Functions *****************************/

/**
 * Creates a string of crypto id names, each separates by a comma (except for
 * the last one)
 */
const createAssetsString = (priceData: priceDataInterface[]) : string => {
  let assets = "";
  for (const coinId of Object.keys(priceData)) {
    assets += coinId + ','
  }
  assets = assets.substring(0, assets.length - 1);
  return assets;
}

/**
 * Creates and returns the asset string needed for the crypto price web socket connection
 */
const getAssetsString = async () : Promise<string> => {
  const priceData = await getLocalStorageSync("priceData");
  return createAssetsString(priceData);
}

/**
 * Calculates and returns the immediately lower Unix timestamp that is a multiple of
 * PRICE_PROCESS_DELAY
 */
const getPriceTimeFloor = () => {
  let time = new Date().getTime();
  time = time - time % PRICE_PROCESS_DELAY;
  return time;
}

/**
 * Calculates and returns the immediately lower Unix timestamp that is a multiple of
 * CURRENCY_PROCESS_DELAY
 */
const getCurrencyTimeFloor = () => {
  let time = new Date().getTime();
  time = time - time % CURRENCY_PROCESS_DELAY;
  return time;
}

/*******************************************************************************/

const initialPricesFetch = async () => {
  try {
    const response = await fetch("https://api.coincap.io/v2/assets?limit=1000");
    // @ts-ignore
    const data = await response.json();
    data.data.forEach((coin: any) => {
      if (coin.id in assets) {
        assets[coin.id].price = parseFloat(coin.priceUsd);
      }
    });
    console.info("Initial fetch successful");
  } catch (err) {
    console.info("Intial fetch unsuccessful");
  }
}

const init = async () => {
  previousPriceProcessStartTime = getPriceTimeFloor() - PRICE_PROCESS_DELAY;
  previousCurrencyProcessStartTime = getCurrencyTimeFloor();
  
  await clearLocalStorageSync();
  await fetchCurrencyData();
  await initialPricesFetch();
  await setLocalStorageSync("priceData", assets);
  startNewPriceWS();
}

chrome.runtime.onInstalled.addListener(() => {
  init();
});


