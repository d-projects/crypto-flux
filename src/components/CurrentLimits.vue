<template>
    <div>       
        <h3 class = "sub-title-current"> Your Current Limits </h3>
        
        <div class = "current">
            <p v-if="limits.length > 0"> <font-awesome-icon icon="check" class = "check-icon"/> = Limit Reached </p>
            <div class = "empty">
            <p v-if="limits.length == 0"> You currently do not have any limits set. </p>
            </div>
            <ul class="list-group">
                <li v-for="limit in limits" v-bind:key="limit" class="list-group-item" :class="limit.reached ? 'current-success' : ''">
                    {{limit.crypto}} {{limit.zone.toLowerCase()}} ${{limit.price}} {{limit.currency}}
                    <font-awesome-icon icon="check" v-if="limit.reached" class = "check-icon"/>
                    <font-awesome-icon icon="trash" v-on:click="removeLimit(limit.id)" class = "trash-icon"/>
                </li>

            </ul>
            <button type = "button" class = "clear-all bttn-jelly bttn-sm bttn-danger nav-bttn" v-if="limits.length > 0" v-on:click="clear"> Remove All </button>
            <div v-if="limits.length > 0" class = "notifications-note">
              <p> Notifications can be delayed by up to 30 seconds </p>
            </div>
        </div>
    </div>
</template>

<script>

export default {
  data: function () {
    return {
      limits: [],
      error: '',
      success: false,
    }
  },
  mounted: function() {
    chrome.storage.local.get(["limits"], (result) => {
      if (result.limits) {
        this.limits = result.limits;
      }
    });
    let tooltips = document.querySelectorAll('[data-toggle="tooltip"]');
    tooltips.forEach(t => t.tooltip());
  },

  methods: {

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

  }
}

</script>

<style>

.notifications-note {
  margin-top: -20px; /* TODO: Refactor to remove the negative */
}

.notifications-note p {
  color: grey;
  float: right;
  font-size: 12px;
}

.check-icon {
  color: green;
}

.current {
  margin: 0 30px;
}

.sub-title-current {
  color: orange;
  margin: 20px 30px;
}

.remove-limit {
  margin: 0 0 0 10px;
}

.trash-icon {
  margin-left: 5px;
  float: right;
}

.trash-icon:hover {
  color: red;
  cursor: pointer;
}

.icon {
  width: 30px;
  display: inline;
  margin-bottom: 15px;
}

.current-success {
  background-color: lightgreen;
}

</style>