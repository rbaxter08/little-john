import Vue from 'vue'
import VueRouter from 'vue-router'
import order from './components/order.vue'
import loading from './components/loading.vue'
import auth from './components/authorize.vue'
import home from './components/home.vue'

Vue.use(VueRouter);

export default new VueRouter({
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
});