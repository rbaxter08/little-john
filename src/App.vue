<template>
  <div id="app">
    <little-john v-bind:ticker="ticker.ticker"></little-john>
  </div>
</template>

<script>
import littleJohn from './components/littleJohn';
import lodash from 'lodash';
import replaceDom from 'findandreplacedomtext';


const store = {
  ticker: ''
}

export default {
  name: 'app',
  components: {
    littleJohn
  },
  data() {
    return {
      ticker: store,
    }
  },
  mounted: () => {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === 'tickerInfo') {
        store.ticker = msg.ticker;
      }
    });

    chrome.runtime.sendMessage({
      type: 'tickerRequest',
    });
  }
}
</script>

<style>

html, body {
  position: relative;
  max-width: 500px;
  max-height: 500px;
  margin: 0;
}
.lj-ticker {
  color: #28E2FF;
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
</style>
