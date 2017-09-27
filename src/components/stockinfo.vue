<template>
	<div id="stockinfo">
		<div class="ticker-info">
			<p>{{name}}</p>
			<p>${{price}}</p>
			<p>
				<span class="price" v-bind:class="{neg: isNegative()}">{{priceDirection}}${{getPriceChange()}} [{{priceDirection}}{{getPercentchange()}}%]</span> Today
			</p>
		</div>
	</div>
</template>

<script>
import RobinHood from '../services/RobinHood.js';

export default {
	name: 'stockinfo',
	data() {
		return {
			priceDirection: '+',
			getPriceChange: () => {
				let price = this.$store.state.ticker.price;
				let previousPrice = this.$store.state.ticker.previousPrice;

				let priceChange = (price - previousPrice).toFixed(2);
				this.priceDirection = priceChange > 0 ? '+' : '-';
				return priceChange;
			},
			getPercentchange: () => {
				let price = this.$store.state.ticker.price;
				let change = Math.abs((this.getPriceChange() / price) * 100);
				return change.toFixed(0);
			},
			isNegative: () => {
				return this.priceDirection !== '+';
			},
		};
	},
	methods: {

	},
	computed: {
		price() {
			return this.$store.state.ticker.price;
		},
		name() {
			return this.$store.state.ticker.name;
		},
		symbol() {
			return this.$store.state.ticker.symbol;
		}
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.price {
	color: #1faa00;
}

.neg {
	color: #ff4528;
}
</style>
