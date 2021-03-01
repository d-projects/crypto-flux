import Vue from 'vue'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import CurrentLimits from '@/components/CurrentLimits.vue'
import AddLimit from '@/components/AddLimit.vue'
import Prices from '@/components/Prices.vue'

library.add(faCheck)
library.add(faSync)
library.add(faInfoCircle)
library.add(faTrash)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('prices', Prices)
Vue.component('current-limits', CurrentLimits)
Vue.component('add-limit', AddLimit)

new Vue({
  el: '#app',
  render: h => h(App)
})