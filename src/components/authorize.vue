<template>
  <div id="auth">
    <input class="user-input" v-model="username" placeholder=" username">
    <input class="user-input" v-model="password" placeholder=" password" type="password" v-on:keyup.enter="signIn()">
    <input v-if="needMFA === true" class="user-input" v-model="mfaCode" placeholder=" Enter Code" v-on:keyup.enter="signIn()">
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
      needMFA: false,
      mfaCode: '',
      signIn: () => {
        if (this.mfaCode) {
          this.verifyMFA();
        } else {
          this.logIn();
        }
      },
      signUp: () => {
        chrome.runtime.sendMessage({
          type: 'signup',
        });
      },
      logIn: () => {
        RobinHood.authorize(this.username, this.password).then((resp) => {
          if (resp && resp.mfa) {
            this.username = resp.username;
            this.password = resp.password;
            this.needMFA = true;
          } else {
            this.$router.replace('/home');
          }
        }, () => {
          this.$router.replace('/');
        });
      },
      verifyMFA: () => {
        RobinHood.confirmMFA({
          username: this.username,
          password: this.password,
          'mfa_code': this.mfaCode,
        }).then(() => {
          this.$router.replace('/home');
        }, () => {
          this.$router.replace('/');
        })
      }
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
