<template>
  <div class="main-box">
    <div class="header">
      <p class="title">{{ticker}}</p>
    </div>
    <div class="content">
      <!-- Work Space -->
      <div class="workspace">
        <div class="ticker-info">
          <p>${{price.price}}</p>
          <p class="price-history">temp: +$0.09 [+0.72%] Sep 15, 2017</p>
        </div>
        <div v-if="!action">
          <button type="button" v-on:click="buy()">buy</button>
          <button type="button" v-on:click="sell()">sell</button>
        </div>

        <!-- placing order -->
        <div class="stock-action" v-if="(action && action !== 'auth')">
          <div class="stock-control">
            <p>Shares to {{action}}:</p> 
            <input class="user-input" v-model="numShares" placeholder="# of shares"></input>
          </div>
          <div class="stock-control">
            <p>Order type:</p> 
            <select v-model="orderType">
              <option value="market">Market</option>
              <option value="limit">Limit</option>
            </select>
          </div>
          <div class="stock-control" v-if="orderType === 'limit'">
            <p>Limit Price:</p>
            <input class="user-input" v-model="limitPrice" placeholder="$0.00"></input>
          </div>
          <div class="stock-control" v-if="orderType === 'limit'">
            <p>Duration:</p> 
            <select v-model="duration">
              <option value="gfd">Until End of Day</option>
              <option value="gtc">Unitl Canceled</option>
            </select>
          </div>
          <div class="stock-control">
            <p>Total: ${{getTotal()}}</p> 
          </div>
          <div class="stock-control">
            <button type="button" v-on:click="order()">Place Order</button>
            <button type="button" v-on:click="action = ''">Cancel</button>
          </div>
        </div>

        <!-- sign in -->
        <div class="workspace" v-if="action === 'auth'">
          <input class="user-input" v-model="username" placeholder="username">
          <input class="user-input" v-model="password" placeholder="password" type="password" v-on:keyup.enter="signIn()">
          <div class="stock-control">
            <button type="button" v-on:click="signIn()">Sign In</button>
            <button type="button" v-on:click="signUp()">Sign Up</button>
          </div>
        </div>

      </div>
    </div>
    <div class="footer">
      <p>donate to me!  :)</p>
    </div>
  </div>
</template>

<script>
import RobinHood from './RobinHood.js';
import VueRouter from 'vue-router';

export default {
  props: ['ticker'],
  data() {
    return {
      action: '',
      username: '',
      password: '',
      orderType: 'market',
      duration: 'gtc',
      numShares: '',
      limitPrice: '',
      price: RobinHood.getPrice(),
      token: RobinHood.getToken(),
      signIn: () => {
        RobinHood.authorize(this.username, this.password).then(() => {
          this.order();
        });
      },
      signUp: () => {
        console.log('not done yet');
      },
      buy: () => {
        this.action = 'buy';
      },
      sell: () => {
        this.action = 'sell';
      },
      order: () => {
        if (this.token.token) {
          RobinHood.placeOrder({            
            symbol: this.ticker,
            type: this.orderType,
            price: this.limitPrice || 1,
            time_in_force: this.duration,
            trigger: 'immediate',
            quantity: this.numShares,
            side: this.action,
          });
          this.action = '';
        } else {
          this.action = 'auth';
        }
      },
      getTotal: () => {
        return this.orderType === 'market' ? this.price.price * this.numShares : this.limitPrice * this.numShares;
      }
    }
  },
  watch: {
    ticker: (newVal) => {
      console.log(newVal);
      RobinHood.getQuote(newVal);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main-box {
  display: flex;
  flex-direction: column;
  margin-right: 0px;
  margin-left: 0px;
}

.header {
  background-color: #28E2FF;
}

.content {
  flex: 4;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  zoom: 130%;
}

.workspace {
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.user-input {
  margin-bottom: 20px;
  border-radius: 5px;
  border:1px solid #cccccc;
}

.user-input:focus {
  outline: none;
}

.title {
  color: white;
  font-weight: bold;
}

.workspace button {
  background-color: #28E2FF;
  cursor:pointer;
  border: none;
  color: white;
  border-radius: 5px;
  height: 20px;
  outline:none;
}

.workspace button:hover {
  background-color: #16ADFF;
}

.price-history {
  font-size: 9px;
}

.stock-action {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.stock-control {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
</style>
