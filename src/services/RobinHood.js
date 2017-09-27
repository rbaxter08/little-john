import axios from 'axios';
import _ from 'lodash';
import store from '../store.js'

const robinUrl = 'https://api.robinhood.com/';

class RobinHood {
  constructor() {}

  authorize(username, password) {
    return this._http({
      method: 'post',
      url: `${robinUrl}api-token-auth/`,
      data: {
        username: username,
        password: password,
      },
    }).then(data => {
      if (data['mfa_required']) { //to factor auth required
        return {
          username: username,
          password: password,
          mfa: true,
        }
      } else { //no two factor
        store.commit('setAccount', {token: data.token});

        //lets get account while we're at it
        return this.getAccountInfo(username, password);
      }
    });
  }

  confirmMFA(data) {
    return this._http({
      method: 'post',
      url: `${robinUrl}api-token-auth/`,
      data: data,
    }).then(data => {
      store.commit('setAccount', {token: data.token});
      
      //lets get account while we're at it
      return this.getAccountInfo(data.username, data.password);
    });
  }

  getAccountInfo() {
    return this._http({
      method: 'get',
      url: `${robinUrl}accounts/`,
      headers: {
        Authorization: `Token ${store.state.account.token}`,
      }
    }).then(data => {
      let account = data.results[0];
      store.commit('setAccount', {
        url: account.url,
        buyPower: account["buying_power"],
        positionsURL: account.positions,
      });
      this.getPositions();
    });
  }

  placeOrder(orderRequest) {

    _.extend(orderRequest, {
      account: store.state.account.url,
      instrument: store.state.ticker.url,
    });

    //send buy request
    return this._http({
      method: 'post',
      url: `${robinUrl}orders/`,
      data: orderRequest,
      headers: {
        Authorization: `Token ${store.state.account.token}`,
      }
    }).then((resp) => {
      this.getPositions(); //update positions
      this.getAccountInfo(); //update buyPower
      return resp;
    });
  }

  getPositions() {
    return this._http({
      method: 'get',
      url: store.state.account.positionsURL,
      headers: {
        Authorization: `Token ${store.state.account.token}`,
      },
    }).then((resp) => {
      let found = false;
      _.each(resp.results, (stock) => {
        if (stock.instrument === store.state.ticker.url) {
          let numHeld = parseInt(stock.quantity) - parseInt(stock["shares_held_for_sells"]);
          store.commit('setTickerData', {numHolding: numHeld});
          found = true;
          return false;  //break out of each
        }

        if (!found && resp.next) {
          getPosition(resp.next);
        } else {
          store.commit('setTickerData', {numHolding: 0});
        }
      });
    });
  }

  getQuote(ticker) {
    return this._http({
      method: 'get',
      url: `${robinUrl}quotes/?symbols=${ticker}`,
    }).then(data => {
      return data.results[0];
    });
  }

  getTickerInfo(ticker) {
    return this._http({
      method: 'get',
      url: `${robinUrl}instruments/?symbol=${ticker}`,
    }).then(resp => {
      return resp.results[0];
    });
  }

  _http(requestObj) {
    return axios(requestObj)
      .then(resp => {
        return resp.data;
      }).catch(err => {
        console.log(err);
      });
  }
}

export default new RobinHood();