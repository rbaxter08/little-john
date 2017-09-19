import axios from 'axios';
import _ from 'lodash';

const robinUrl = 'https://api.robinhood.com/';

class RobinHood {
  constructor() {
    this.account = {
      token: '',
      url: '',
    };
    this.tickerInfo = {
      price: 0,
      previousPrice: 0,
      name: '',
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
      this.account.token = data.token;

      //lets get account while we're at it
      return this._http({
        method: 'get',
        url: `${robinUrl}accounts/`,
        headers: {
          Authorization: `Token ${this.account.token}`,
        }
      }).then(data => {
        this.account.url = data.results[0].url;
      });
    });
  }

  placeOrder(orderRequest) {
    
    // get stock url
    return this._http({
      method: 'get',
      url: `${robinUrl}instruments/?symbol=${orderRequest.symbol}`,
    }).then(resp => {

      _.extend(orderRequest, {
        account: this.account.url,
        instrument: resp.results[0].url,
      })

      //send buy request
      this._http({
        method: 'post',
        url: `${robinUrl}orders/`,
        data: orderRequest,
        headers: {
          Authorization: `Token ${this.account.token}`,
        }
      });
    });
  }

  getToken() {
    return this.account.token;
  }

  getTickerInfo() {
    return this.tickerInfo;
  }

  getQuote(ticker) {
    this._http({
      method: 'get',
      url: `${robinUrl}/quotes/?symbols=${ticker}`,
    }).then(data => {
      this.tickerInfo.price = data.results[0]['ask_price'];
      this.tickerInfo.previousPrice = data.results[0]['previous_close'];
      this.tickerInfo.name = data.results[0].name;
    });
  }

  _http(requestObj) {
    return axios(requestObj)
    .then(resp => {
      return resp.data;
    })
    .catch(err => {
      console.log(err);
    });
  }
}

export default new RobinHood();