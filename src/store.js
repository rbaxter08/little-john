import Vuex from 'vuex'
import Vue from 'vue'
import _ from 'lodash'
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ticker: {
      price: 0,
      previousPrice: 0,
      name: '',
      url: '',
      numHolding: 0,
    },
    account: {
      token: '',
      url: '',
      buyPower: 0,
      positionURL: '',
    },
    action: '',
  },
  mutations: {
    clear(state) {
      state.ticker = {
        price: 0,
        previousPrice: 0,
        name: '',
        url: '',
        numHolding: 0,
      };
    },
    setAction(state, action) {
      state.action = action;
    },
    setTickerData(state, payload) {
      _.extend(state.ticker, payload);
    },
    setAccount(state, payload) {
      _.extend(state.account, payload);
    }
  },
});