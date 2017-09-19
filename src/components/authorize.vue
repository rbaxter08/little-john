<template>
  <div id="auth">
    <input class="user-input" v-model="username" placeholder=" username">
    <input class="user-input" v-model="password" placeholder=" password" type="password" v-on:keyup.enter="signIn()">
    <div class="sign-in-btn-div">
      <button type="button" v-on:click="signIn()">Sign In</button>
      <button type="button" v-on:click="signUp()">Sign Up</button>
    </div>
  </div>
</template>

<script>
import RobinHood from '../services/RobinHood.js';

export default {
  name: 'auth',
  data() {
    return {
      username: '',
      password: '',
      signIn: () => {
        this.$router.replace('/loading');
        RobinHood.authorize(this.username, this.password).then(() => {
          this.$router.replace('/home');
        });
      },
      signUp: () => {
        chrome.runtime.sendMessage({
          type: 'signup',
        });
      },
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#auth {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
