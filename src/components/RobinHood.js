import axios from 'axios';

const robinUrl = 'https://api.robinhood.com/';

class RobinHood {
  constructor() {
    this.token = {
      token: '',
      account: '',
    };
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
      this.token.token = data.token;

      //lets get account while we're at it
      return this._http({
        method: 'get',
        url: `${robinUrl}accounts/`,
        headers: {
          Authorization: `Token ${this.token.token}`,
        }
      }).then(data => {
        this.token.account = data.results[0].url;
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
        account: this.token.account,
        instrument: resp.results[0].url,
      })

      //send buy request
      this._http({
        method: 'post',
        url: `${robinUrl}orders/`,
        data: orderRequest,
        headers: {
          Authorization: `Token ${this.token.token}`,
        }
      });
    });
  }

  getToken() {
    return this.token;
  }

  getPrice() {
    return this.price;
  }

  getQuote(ticker) {
    this._http({
      method: 'get',
      url: `${robinUrl}/quotes/?symbols=${ticker}`,
    }).then(data => {
      this.price.price = data.results[0]['ask_price'];
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