<script lang="ts">
	import {
		walletNFTWithdrawIds,
		walletFTWithdrawIds,
		basketNFTWithdrawIds,
		basketFTWithdrawIds,
		selectedBasketMeta
	} from '$lib/flow/stores.client';
	import { type ModalSettings, modalStore } from '@skeletonlabs/skeleton';

	export let nft: any = {};
	export let ft: any = {};
	export let type: 'nft' | 'ft';
	const isNFT = type === 'nft';

	function modalComponentDepositFT(ft: FTCatalogEntry) {
		if ($selectedBasketMeta.id === undefined) {
			alert('Please select a basket first');
			return;
		}
		const modal: ModalSettings = {
			type: 'component',
			title: `Withdraw ${ft.token} from basket and deposit in your account`,
			meta: ft,
			component: 'depositFT'
		};
		modalStore.trigger(modal);
	}
	function modalComponentDepositNFT(nft: any) {
		if ($selectedBasketMeta.id === undefined) {
			alert('Please select a basket first');
			return;
		}
		const modal: ModalSettings = {
			type: 'component',
			title: `Withdraw ${nft.name} ${nft.ids} from basket and deposit in your account`,
			meta: nft,
			component: 'depositNFT'
		};
		modalStore.trigger(modal);
	}

	const clickHandler = () => {
		console.log({ isNFT });
		if (isNFT) {
			modalComponentDepositNFT(nft);
		} else {
			modalComponentDepositFT(ft);
		}
		// let isNFT ? addOrRemoveNFTId(nft.id) : addOrRemoveFTToken(ft)
		// console.log({isNFT})
	};
</script>

<button
	class={`flex flex-col items-center justify-start bg-tertiary-900 rounded-md hoverShadow p-4`}
	on:click={clickHandler}
>
	<div class="flex flex-col justify-between p-3">
		<div class="flex flex-col items-center w-full">
			{#if type === 'nft'}
				<p class="text-xs sm:text-sm">{nft.name}</p>
				<p class="text-sm pt-3 text-center">{JSON.stringify(nft.ids)}</p>
			{:else if type === 'ft'}
				<p class="text-xs sm:text-sm">{ft.name}</p>
				<p class="text-sm pt-1 text-center">{ft.balance}</p>
			{/if}
		</div>
	</div>
</button>
