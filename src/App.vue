<template>
  <div id="app">
    <div class="header">
      <p class="title">{{state.ticker}}</p>
      <button class="donate" type="button" v-on:click="donate()">Donate&nbsp;♥</button>
    </div>
    <stockinfo v-bind:ticker="state.ticker"></stockinfo>
    <router-view v-bind:ticker="state.ticker" v-bind:action="state.action">
    </router-view>
  </div>
</template>

<script>
import stockinfo from './components/stockinfo.vue';
import RobinHood from './services/RobinHood.js';
import { bus } from './services/eventbus.js';

const store = {
  state: {
    ticker: 'Little John',
    action: '',
  }
}

bus.$on('order', (type) => {
  store.state.action = type;
});

export default {
  name: 'App',
  components: {
    stockinfo,
  },
  data() {
    return {
      state: store.state,
      donate: () => {
        chrome.runtime.sendMessage({
          type: 'donate',
        });
      },
    };
  },
  mounted: () => {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === 'tickerInfo') {
        store.state.ticker = msg.ticker.match(/-\$?(.*)-/)[1];
      }
    });

    chrome.runtime.sendMessage({
      type: 'tickerRequest',
    });
  },
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
