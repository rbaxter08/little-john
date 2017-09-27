<template>
	<div class="stock-action">
		<div class="stock-control">
			<p>Shares to {{getAction()}}:</p>
			<input class="user-input" v-model="numShares" placeholder="# of shares"></input>
		</div>
		<div class="stock-control">
			<p>Order type:</p>
			<select class="user-input" v-model="orderType">
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
			<select class="user-input" v-model="duration">
				<option value="gfd">Until End of Day</option>
				<option value="gtc">Unitl Canceled</option>
			</select>
		</div>
		<div class="stock-control">
			<p>Total:</p>
			<p>${{getTotal()}}</p>
		</div>
		<div v-if="getAction() === 'buy'" class="stock-control">
			<p></p>
			<p>buying power: ${{getBuyPower()}}</p>
		</div>
		<div v-if="getAction() === 'sell'" class="stock-control">
			<p></p>
			<p>Shares Held: {{getNumShares()}}</p>
		</div>
		<div class="stock-control">
			<button type="button" v-on:click="cancel()">Cancel</button>
			<button type="button" v-on:click="order()">Place Order</button>
		</div>
	</div>
</template>

<script>

import RobinHood from '../services/RobinHood.js';

export default {
	name: 'order',
	data() {
		return {
			orderType: 'market',
			duration: 'gtc',
			numShares: '',
			limitPrice: '',
			order: () => {
				this.$router.replace('/loading');
				RobinHood.placeOrder({
					symbol: this.$store.state.ticker.symbol,
					type: this.orderType,
					price: this.limitPrice || 1,
					time_in_force: this.duration,
					trigger: 'immediate',
					quantity: this.numShares,
					side: this.getAction(),
				}).then((resp) => {
					this.cancel();  //return home
				}, (err) => {
					console.log(err);
					this.cancel();  //return home
				});
			},
			getNumShares: () => {
				return this.$store.state.ticker.numHolding;
			},
			getBuyPower: () => {
				return this.$store.state.account.buyPower;
			},
			getTotal: () => {
				return this.orderType === 'market' ? this.$store.state.ticker.price * this.numShares : this.limitPrice * this.numShares;
			},
			getAction: () => {
				return this.$store.state.action;
			},
			cancel: () => {
				this.$router.replace('/home');
			}
		}
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
