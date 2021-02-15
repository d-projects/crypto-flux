<template>
  <div>
      <div class = "title">
          <img class = "icon" src = "icons/all_sizes.png">
          <h1> Crypto Flux</h1>
      </div>

      <nav>
        <button class="bttn-material-flat bttn-sm bttn-primary nav-bttn" v-on:click="changeState('limits')"> Your Limits </button>
        <button class="bttn-material-flat bttn-sm bttn-success nav-bttn" v-on:click="changeState('add')"> Add a Limit </button>
        <button class="bttn-material-flat bttn-sm bttn-royal nav-bttn" v-on:click="changeState('prices')"> Crypto Prices </button>
      </nav>

      <current-limits v-if="tab.limits"></current-limits>

      <add-limit v-if="tab.add"></add-limit>
        
      <prices class = "crypto-prices" v-if="tab.prices"></prices>
  </div>
</template>

<script>

module.exports = {
  data: function () {
    return {
      tab: {
        limits: true,
        add: false,
        prices: false
      }
    }
  },

  methods: {
    changeState: function(state) {
      this.tab.limits = false; this.tab.add = false; this.tab.prices = false;
      this.error = false; this.success = false;
      this.tab[state] = true;
    }
  }
}
</script>

<style>
html {
  width: 450px;
  height: 300px;
}

body {
  width: 450px;
  font-family: 'Roboto', sans-serif;
  padding: 0 0 10px 0;
}

.icon {
  width: 30px;
  display: inline;
  margin-bottom: 15px;
}

.title {
  text-align: center;
  margin-top: 10px;
  color: orange;
}

.title h1 {
  display: inline;
}

.sync-limits {
  margin-right: 25px;
}

nav {
  text-align: center;
}

.nav-bttn {
  margin: 0 5px;
}

.nav-bttn:focus {
  opacity: 75%;
  color: black;
}

.sync {
  margin-top: 5px;
  float: right;
  display: flex;
  width: 40px;
  justify-content: space-between;
  color: black;
}

.sync-icon:hover {
  cursor: pointer;
  color: blue;
}

</style>
