import axios from 'axios';
import _ from 'lodash';

const robinUrl = 'https://api.robinhood.com/';

class RobinHood {
  constructor() {
    this.account = {
      token: '',
      url: '',
      buyPower: 0,
    };
    this.tickerInfo = {
      price: 0,
      previousPrice: 0,
      name: '',
      url: '',
    }
    this.price = {
      price: 0,
    }
  }

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
        this.account.token = data.token;

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
      this.account.token = data.token;
      
      //lets get account while we're at it
      return this.getAccountInfo(data.username, data.password);
    });
  }

  getAccountInfo() {
    return this._http({
      method: 'get',
      url: `${robinUrl}accounts/`,
      headers: {
        Authorization: `Token ${this.account.token}`,
      }
    }).then(data => {
      this.account.url = data.results[0].url;
      this.account.buyPower = data.results[0]["buying_power"];
    });
  }

  placeOrder(orderRequest) {

    _.extend(orderRequest, {
      account: this.account.url,
      instrument: this.tickerInfo.url,
    })

    //send buy request
    return this._http({
      method: 'post',
      url: `${robinUrl}orders/`,
      data: orderRequest,
      headers: {
        Authorization: `Token ${this.account.token}`,
      }
    });
  }

  getToken() {
    return this.account.token;
  }

  getTickerInfo() {
    return this.tickerInfo;
  }

  getAccount() {
    return this.account;
  }

  getQuote(ticker) {
    this._http({
      method: 'get',
      url: `${robinUrl}/quotes/?symbols=${ticker}`,
    }).then(data => {
      this.tickerInfo.price = data.results[0]['ask_price'];
      this.tickerInfo.previousPrice = data.results[0]['previous_close'];
    });

    // get stock url
    return this._http({
      method: 'get',
      url: `${robinUrl}instruments/?symbol=${ticker}`,
    }).then(resp => {
      this.tickerInfo.url = resp.results[0].url;
      this.tickerInfo.name = resp.results[0].name;

    });
  }

  _http(requestObj) {
    return axios(requestObj)
      .then(resp => {
        return resp.data;
      });
  }
}

export default new RobinHood();