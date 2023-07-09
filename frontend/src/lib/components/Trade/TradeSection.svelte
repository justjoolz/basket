<script lang='ts'>
	import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import {
		walletNFTWithdrawIds,
		walletFTWithdrawIds,
		basketNFTWithdrawIds,
		basketFTWithdrawIds
	} from '$lib/flow/stores.client';
	import tradeIcon from '$lib/assets/trade-arrow.svg';
	import TradeDisplay from './TradeDisplay.svelte';


	function modalComponentTrade(name: string) {
		const modal: ModalSettings = {
			type: 'component',
			title: `Withdraw ${name}`,
			component: 'withdraw'
		};
		modalStore.trigger(modal);
	}
</script>

<div class="flex flex-col w-full fixed bottom-0 bg-surface-900">
	<div class="w-full h-2 flex px-[44px] gap-x-20">
		<div class="border-t-2 border-primary-500 w-1/2" />
		<div class="border-t-2 border-primary-500 w-1/2" />
	</div>
	<div class="flex w-full px-10 py-8">
		<TradeDisplay walletNFTWithdrawIds={$walletNFTWithdrawIds} walletFTWithdrawIds={$walletFTWithdrawIds} />
		<div
			class="flex gap-x-5 w-1/5 hover:scale-105 transition-all duration-300 items-center justify-center"
		>
			<img src={tradeIcon} alt="trade arrow" class="w-6" />
			<div>
				<button class="text-2xl font-bold" on:click={() => modalComponentTrade('nfts')}
					>TRADE</button
				>
			</div>
			<img src={tradeIcon} alt="trade arrow" class="rotate-180 w-6" />
		</div>
		<TradeDisplay walletNFTWithdrawIds={$basketNFTWithdrawIds} walletFTWithdrawIds={$basketFTWithdrawIds} />
	</div>
</div>
