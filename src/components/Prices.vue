<template>
    <div>
        <h3 class = "sub-title-prices"> Crypto Prices </h3>
        <label for = "currency"> Currency: </label>
        <select class = "form-control input prices-curr" id = "currency" v-model = "chosenCurrency">
            <option v-for="key in Object.keys(currencies)" :key="key">{{key}}</option>
        </select>

        <table class="table table-sm table-dark table-bordered text-center">
            <thead>
            <tr>
                <th class = "text-center">Coin Name</th>
                <th class = "text-center">Price (in {{chosenCurrency}})</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="key in Object.keys(coinsPriceData)" :key="key">
                <td> {{coinsPriceData[key].name}} - {{key}}</td>
                <td> {{(coinsPriceData[key].price * currencies[chosenCurrency]).toFixed(3)}} </td>
            </tr>
            </tbody>
        </table>
            <div class = "prices-note">
              <p> Updated every 30 seconds </p>
            </div>

    </div>
</template>

<script>

module.exports = {
    data: function () {
      return {
        chosenCurrency: 'USD',
        coinsPriceData: {
        'BTC': {
          name: 'Bitcoin',
          price: 0
        },
        'ETH': {
          name: 'Ethereum',
          price: 0
        },
        'LTC': {
          name: 'Litecoin',
          price: 0
        },
        'DOGE': {
          name: 'Dogecoin',
          price: 0
        }
      },
      currencies: {
        'USD': 1,
        'CAD': 0
      }
      }
    },

    mounted: function() {
      this.setPriceData();
      this.setCurrencyMultipliers();
    },
  
    methods: {
      setPriceData: function() {
        fetch('https://api.coincap.io/v2/assets/')
        .then(response => response.json())
        .then(result => {
          result.data.forEach(coin => {
            if (this.coinsPriceData[coin.symbol]) {
              this.coinsPriceData[coin.symbol].price = parseFloat(coin.priceUsd).toFixed(3);
            }
          });
        });
      },
  
      setCurrencyMultipliers: function() {
        fetch("https://api.exchangerate-api.com/v4/latest/usd").
        then(response => response.json())
        .then(result => {
          Object.keys(this.currencies).forEach(key => {
            if (key != 'USD') this.currencies[key] = result.rates[key].toFixed(3);
          });
        });
      }
  
    }
  }
  </script>

  
<style>

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
