<template>
<div>
    <div class = "title">
        <h2> Crypto Flux</h2>
    </div>


    <div class = "current-limits">
        <font-awesome-icon icon="sync" class = "sync" v-if="limits.length > 0" v-on:click="syncData"/>
        <button type = "button" class = "clear-all" v-if="limits.length > 0" v-on:click="clear"> Remove All </button>
        
        <h3 class = "sub-title"> Your Current Limits </h3>
        <div class = "current">
        <p> A green checkamrk (<font-awesome-icon icon="check" class = "check-icon"/>) means that the limit was reached. </p>
       
        <div class = "empty">
        <p v-if="limits.length == 0"> You currently do not have any limits set. </p>
        </div>
        <ol>
          <li v-for="limit in limits" v-bind:key="limit">
            {{limit.crypto}} {{limit.zone.toLowerCase()}} {{limit.price}} {{limit.currency}}
            <font-awesome-icon icon="check" v-if="limit.reached" class = "check-icon"/>
            <button class = "remove-limit" v-on:click="removeLimit(limit.id)"> Remove </button>
          </li>

        </ol>
         </div>
    </div>

    <div class = "add-limit">
        <h3 class = "sub-title"> Add a Limit (up to 5) </h3>
        <div class = "fields">
        <div class = "errors" v-if="error">{{error}}</div>

        <label for = "crypto"> Crypto: </label>
        <select id = "crypto" v-model = "newLimit.crypto">
            <option selected="selected"> BTC </option>
            <option> ETH </option>
            <option> LTC </option>
        </select>

        <br/><br/>
        <label for = "currency"> Currency: </label>
        <select id = "currency" v-model = "newLimit.currency">
            <option selected="selected"> USD </option>
            <option> CAD </option>
        </select>

        <br/><br/>
        <label for = "amount">Notification Price: </label>
        <input id = "amount" v-model = "newLimit.price" placeholder = "0.00"/>

      <br/><br/>
        <label for = "zone"> Above or Below the Price: </label>
        <select id = "zone" v-model = "newLimit.zone">
            <option selected="selected"> Above </option>
            <option> Below </option>
        </select>
        
        <br/><br/>
        <button type = "submit" v-on:click = "addLimit">Add Limit</button>
        </div>
    </div>
    <br/>  
  </div>
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
      error: ''
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
        this.limits.push(Object.assign({}, this.newLimit));
        chrome.storage.local.set({limits: this.limits});
        // set back to default values
        this.newLimit.crypto = '';
        this.newLimit.price = 0;
        this.newLimit.currency = '';
        this.newLimit.zone = '';
      }
    },

    removeLimit: function(id) {
      this.limits.splice(this.limits.findIndex( limit => {
        return limit.id === id;
      }), 1);
      chrome.storage.local.set({limits: this.limits});
    },

    clear: function() {
      this.limits = [];
      chrome.storage.local.set({limits: this.limits});
      this.error = '';
    },

    syncData: function() {
      chrome.storage.local.get(["limits"], (result) => {
        this.limits = result.limits;
      });
    }
  }
}
</script>

<style>
html {
  width: 400px;
  height: 300px;
}

body {
  width: 30em;
}

.title {
  text-align: center;
  color: orange;
}

.clear-all, .sync {
    float: right;
}

.sync {
  margin-left: 10px;
  margin-top: 5px;
}

.sync:hover {
  cursor: pointer;
  color: blue;
}

.check-icon {
  color: green;
}

.errors {
  padding: 0 0 10px 0;
  color: red;
}

.current {
  padding: 0 0 0 10px;
}

.fields {
  padding: 0 0 0 10px;
}

.sub-title {
  color: purple;
}

.remove-limit {
  margin: 0 0 0 10px;
}

</style>
