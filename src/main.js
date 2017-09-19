import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import order from './components/order.vue'
import loading from './components/loading.vue'
import auth from './components/authorize.vue'
import home from './components/home.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: auth,
    }, {
      path: '/order',
      component: order,
    }, {
      path: '/home',
      component: home,
    }, {
      path: '/loading',
      component: loading,
    }
  ]
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
