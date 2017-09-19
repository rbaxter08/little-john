<template>
	<div id="stockinfo">
		<div class="ticker-info">
			<p>{{tickerInfo.name}}</p>
			<p>${{tickerInfo.price}}</p>
			<p>
				{{symbol}}$<span class="price" v-bind:class="{neg: isNegative()}">{{getPriceChange()}}</span>
				[<span class="price" v-bind:class="{neg: isNegative()}">{{symbol}}{{getPercentchange()}}%</span>] today
			</p>
		</div>
	</div>
</template>

<script>
import RobinHood from '../services/RobinHood.js';

export default {
	name: 'stockinfo',
	props: ['ticker'],
	data() {
		return {
			symbol: '+',
			tickerInfo: RobinHood.getTickerInfo(),
			getPriceChange: () => {
				let priceChange = (this.tickerInfo.price - this.tickerInfo.previousPrice).toFixed(2);
				this.symbol = priceChange > 0 ? '+' : '-';
        return priceChange;
			},
			getPercentchange: () => {			
				let change = Math.abs((this.getPriceChange() / this.tickerInfo.price) * 100);
				return change.toFixed(0);
			},
			isNegative: () => {
				return this.symbol !== '+';
			}
		}
	},
	watch: {
		ticker: (newVal) => {
			function quote() {
				RobinHood.getQuote(newVal);
			}

			quote();
			setInterval(quote, 10000);
		}
	}
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
