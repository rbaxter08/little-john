<template>
  <div>
    <button type="button" v-on:click="order('buy')">Buy</button>
    <button type="button" v-on:click="order('sell')">Sell</button>
  </div>
</template>

<script>

import {bus} from '../services/eventbus.js';

export default {
  name: 'home',
  data() {
    return {
      order: (type) => {
        bus.$emit('order', type);
        this.$router.replace('/order');
      },
    };
  },
}
</script>

<style>

</style>
