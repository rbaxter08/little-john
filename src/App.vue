<template>
  <div id="app">
    <div class="header">
      <p class="title">{{symbol}}</p>
    </div>
    <stockinfo></stockinfo>
    <router-view></router-view>
  </div>
</template>

<script>
import stockinfo from './components/stockinfo.vue';
import RobinHood from './services/RobinHood.js';

export default {
  name: 'App',
  components: {
    stockinfo,
  },
  methods: {
    getQuote() {
				RobinHood.getQuote(this.$store.state.ticker.symbol).then((resp) => {
					this.$store.commit('setTickerData', {
						price: resp['ask_price'],
						previousPrice: resp['previous_close'],
					});
				});
			},
			getInfo() {
				RobinHood.getTickerInfo(this.$store.state.ticker.symbol).then((resp) => {
					this.$store.commit('setTickerData', {
						url: resp.url,
						name: resp.name,
          });
				});
      },
  },
  mounted () {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === 'tickerInfo') {
        let symbol = msg.ticker.match(/-\$?(.*)-/)[1];
        this.$store.commit('clear');
        this.$store.commit('setTickerData', {symbol: symbol});
        this.getQuote();
        this.getInfo();
        if (this.$store.state.account.token) {
          this.$router.replace('/home');
          RobinHood.getPositions();
        } else {
          this.$router.replace('/');
        }
      }
    });

    chrome.runtime.sendMessage({
      type: 'tickerRequest',
    });
  },
  computed: {
    symbol () {
      return this.$store.state.ticker.symbol;
    }
  }
}
</script>

<style>
html,
body {
  position: relative;
  max-width: 400px;
  width: 400;
  height: 496;
  margin: 0;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin: 0px;
  height: 100%;
  width: 100%;
}

body {
  font-family: "Catamaran", sans-serif;
}

.header {
  background-color: #28E2FF;
  display: flex;
  justify-content: center;
  flex-direction: column;
  font-size: 20px;
}


.main-box {
  display: flex;
  flex-direction: column;
  margin-right: 0px;
  margin-left: 0px;
}


.header button {
  position: absolute;
  align-self: flex-end;
  font-weight: bold;
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
  border: 1px solid #cccccc;
  width: 200px;
  max-width: 195px !important;
  color: #757575;
  -ms-box-sizing: content-box;
  -moz-box-sizing: content-box;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
}

.user-input:focus {
  outline: none;
}

.title {
  color: white;
  font-weight: bold;
  margin: 10px;
}

button {
  background-color: #28E2FF;
  cursor: pointer;
  border: none;
  color: white;
  border-radius: 5px;
  height: 20px;
  outline: none;
}

.workspace button:hover {
  background-color: #2877ff;
}

.sign-in-btn-div {
  display: flex;
  align-items: baseline;
  justify-content: center;
}

.sign-in-btn-div button {
  margin: 5px;
}
</style>
