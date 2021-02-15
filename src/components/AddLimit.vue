<template>
    <form class = "add-form">
        <h3 class = "sub-title-add"> Add a Limit </h3>
        <p> You can add up to 5 limits!</p>
        <div class = "errors" v-if="error"><h4> {{error}} </h4></div>
        <div class = "success" v-if="success"><h4> Your limit was added! </h4></div>

        <label for = "crypto"> Crypto: </label>
        <select class = "form-control input" id = "crypto" v-model = "newLimit.crypto">
            <option v-for="coin in coinsPriceData" :key="coin.symbol">{{coin.name}} - {{coin.symbol}}</option>
        </select>

        <br/>
        <label for = "currency"> Currency: </label>
        <select class = "form-control input" id = "currency" v-model = "newLimit.currency">
            <option v-for="curr in currencies" :key="curr">{{curr}}</option>
        </select>

        <br/>
        <label for = "amount">Notification Price: </label>
        <input class = "form-control input" id = "amount" v-model = "newLimit.price" placeholder = "0.00"/>

        <br/>
        <label for = "zone"> Above or Below the Price: </label>
        <select class = "form-control input" id = "zone" v-model = "newLimit.zone">
            <option selected="selected"> Above </option>
            <option> Below </option>
        </select>
        
        <br/>
        <button type = "button" v-on:click = "addLimit" class = "bttn-jelly bttn-primary">Add Limit</button>
    </form>
</template>


<script>

module.exports = {
  data: function () {
    return {
      limits: [],
      newLimit: {
        id: '_' + Math.random().toString(36).substr(2, 9),
        crypto: undefined,
        price: undefined,
        currency: undefined,
        zone: undefined,
        reached: false
      },
      error: '',
      success: false,
      coinsPriceData: [
        {
          symbol: 'BTC',
          name: 'Bitcoin'
        },
        {
          symbol: 'ETH',
          name: 'Ethereum'
        },
        {
          symbol: 'LTC',
          name: 'Litecoin'
        },
        {
          symbol: 'DOGE',
          name: 'Dogecoin'
        }
      ],
      currencies: [
        'USD',
        'CAD'
      ]
    }
  },

  mounted: function() {
    chrome.storage.local.get(["limits"], (result) => {
      if (result.limits) {
        this.limits = result.limits;
      }
    });
  },

  methods: {
    addLimit: function () {
      this.error = '';
      if (typeof this.newLimit.currency == 'undefined' || typeof this.newLimit.crypto == 'undefined' || typeof this.newLimit.price == 'undefined' || typeof this.newLimit.zone == 'undefined') {
          this.error = 'Please fill out all the fields.';
      } else if (typeof this.newLimit.price != 'string' || isNaN(this.newLimit.price)) {
          this.error = 'Please enter a valid number.';
      } else if (this.newLimit.price <= 0) {
          this.error = 'Please enter a number greater than 0.';
      } else if (this.limits.length == 5) {
          this.error = 'You have 5 limits set. Remove one if you want to add another';
      } else if (!this.error) {
        this.limits.forEach(limit => {
          if (limit.currency == this.newLimit.currency && limit.crypto == this.newLimit.crypto && limit.price == this.newLimit.price) {
            this.error = 'You already have a matching limit set.';
            return;
          }
        });
      }

      if (!this.error) {
        this.success = true;
        this.limits.push(Object.assign({}, this.newLimit));
        chrome.storage.local.set({limits: this.limits});
        // set back to default values
        this.newLimit.crypto = '';
        this.newLimit.price = 0;
        this.newLimit.currency = '';
        this.newLimit.zone = '';
      }

    },

  }
}
</script>

<style>

.add-form label {
  color: grey;
}

.add-form {
  display: flex;
  flex-direction: column;
  width: 75%;
  margin: auto;
}

.add-form .input {
  height: 30px;
  display: inline;
}

.add-form button {
  width: 50%;
}

.errors {
  padding: 0 0 10px 0;
  color: red;
  text-align: center;
}

.success {
  padding: 0 0 10px 0;
  color: green;
  text-align: center;
}

.fields {
  padding: 0 0 0 10px;
}

.sub-title-add {
  color: orange;
}

</style>
