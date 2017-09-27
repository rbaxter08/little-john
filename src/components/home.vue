<template>
  <div>
    <button type="button" v-on:click="order('buy')">Buy</button>
    <button type="button" v-on:click="order('sell')">Sell</button>
  </div>
</template>

<script>

import RobinHood from '../services/RobinHood.js';

export default {
  name: 'home',
  data() {
    return {
      order: (type) => {
        this.$store.commit('setAction', type);
        this.$router.replace('/order');
      },
    };
  },
}
</script>

<style>

</style>
