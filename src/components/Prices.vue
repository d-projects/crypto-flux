<template>
  <section>
    <div v-if="failedApiRequest">
      <h4 class = "failed-api-error"> There was an error fetching the prices. Please try again a bit later. </h4>
    </div>
    <div v-else>
        <h3 class = "sub-title-prices"> Crypto Prices </h3>
        <label for = "currency"> Currency: </label>
        <select class = "form-control input prices-curr" id = "currency" v-model = "chosenCurrencySymbol" @change="onChosenCurrencyChange">
            <option v-for="curr in currencies" :key="curr.symbol">{{curr.symbol}}</option>
        </select>
        <table class="table table-sm table-dark table-bordered text-center">
          <thead>
          <tr>
              <th class = "text-center">Coin Name</th>
              <th class = "text-center">Price (in {{chosenCurrencySymbol}})</th>
          </tr>
          </thead>
          <tbody>
            <tr v-for="coin in coinsPriceData" :key="coin.symbol">
                <td> {{coin.name}} - {{coin.symbol}}</td>
                <td> {{(coin.price * exchangeRate).toFixed(3)}} </td>
            </tr>
          </tbody>
        </table>
        <div class = "prices-note">
          <p> Switch Tabs to Update </p>
        </div>
    </div>
  </section>
</template>

<script>
import coinsPriceData from '../utils/coinsPriceData';
import currencies from '../utils/currencies';

export default {
    data: function () {
      return {
        chosenCurrencySymbol: 'USD',
        exchangeRate: 1,
        coinsPriceData,
        currencies,
        failedApiRequest: false,
      }
    },

    mounted: function() {
      this.setPriceData();
      this.setCurrencyMultipliers();
    },
  
    methods: {
      // sets the coin price data after querying the price API
      setPriceData: function() {
        fetch('https://api.coincap.io/v2/assets/')
        .then(response => response.json())
        .then(result => {
          result.data.forEach(coin => {
            const index = coinsPriceData.findIndex(storedCoin => storedCoin.symbol === coin.symbol);
            console.log(index, coinsPriceData)
            if (index >= 0) {
              this.coinsPriceData[index].price = parseFloat(coin.priceUsd).toFixed(3);
            }
          });
          this.failedApiRequest = false;
        }).catch((err) => {
          this.failedApiRequest = true;
          console.error("Error Getting Price Data", err);
        });

        console.log("Coins Price Data", this.coinsPriceData);
      },
  
      // sets the currency data after querying the currency API
      setCurrencyMultipliers: function() {
        fetch("https://api.exchangerate-api.com/v4/latest/usd").
        then(response => response.json())
        .then(result => {
          this.currencies.forEach((curr, index) => {
            if (curr.symbol != 'USD') this.currencies[index]['exchangeRate'] = result.rates[curr.symbol].toFixed(3);
            else this.currencies[index]['exchangeRate'] = 1;
          });
          this.failedApiRequest = false;
        }).catch((err) => {
          this.failedApiRequest = true;
          console.error("Error Getting Currency Data", err);
        });

        console.log("Currencies", this.currencies);
      },

      // sets the exchaneg rate when the chosen currency is change
      onChosenCurrencyChange: function () {
      console.log("Currencies", this.currencies, this.chosenCurrencySymbol);
      console.log("Find Result", this.currencies.find(curr => curr.symbol === this.chosenCurrencySymbol));
        const exchangeRate = this.currencies.find(curr => curr.symbol === this.chosenCurrencySymbol).exchangeRate;
        this.exchangeRate = parseFloat(exchangeRate).toFixed(3);
        console.log("Exchange Rate", this.exchangeRate);
        console.log("Here");
        console.log(this.currencies, this.coinsPriceData, this.chosenCurrencySymbol);
      },
    }
  }
  </script>
  
<style>

.failed-api-error {
  color: red;
  text-align: center;
  margin-top: 20px;
}

.prices-note {
  float: right;
  font-size: 10px;
}

p, label {
  font-size: 15px;
}

.sub-title-prices {
  color: orange;
  margin-bottom: 20px;
}

.crypto-prices {
  margin: 10px 30px;
  color: grey;
}

.crypto-prices td {
  color: black;
}

.prices-curr {
  display: inline;
  width: 150px;
  height: 30px;
  margin-left: 10px;
  margin-bottom: 20px;
}

.icon {
  width: 30px;
  display: inline;
  margin-bottom: 15px;
}

</style>
