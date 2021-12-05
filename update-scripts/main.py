import json
from dotenv import load_dotenv
import requests

def udpate_coins_json():
    coin_ids = None
    with open("coinIds.json") as f:
        coin_ids = set(json.load(f))

    r = requests.get("https://api.coincap.io/v2/assets?limit=1000")
    if (r.status_code != 200):
        print("Could not connect to API")
        exit()
    else:
        api_tickers_data = r.json()["data"]

        api_tickers = dict()
        for t in api_tickers_data:
            if (t["id"] in coin_ids):
                api_tickers[t["id"]] = dict({"symbol": t["symbol"], "id": t["id"], "name": t["name"], "price": 0, "isDisplayed": True})

        with open("coins.json", "w") as file:
            json.dump(api_tickers, file)

def update_currencies_json():
    currency_ids = None
    with open("currencyIds.json") as f:
        currency_ids = set(json.load(f))

    r = requests.get("https://api.exchangerate-api.com/v4/latest/usd")
    if (r.status_code != 200):
        print("Could not connect to API")
        exit()
    else:
        currency_request_data = r.json()

        currency_data = dict()
        for c in currency_request_data["rates"].keys():
            if (c in currency_ids):
                currency_data[c] = 0
        
        with open("currencies.json", "w") as file:
            json.dump(currency_data, file)

load_dotenv()

while True:
    command = input("Enter <coins> to udpate coins.json, and <curr> to update currencies.json: ")
    if (command == "coins"):
        udpate_coins_json()
        break
    elif (command == "curr"):
        update_currencies_json()
        break
    else:
        print("Invalid command")








