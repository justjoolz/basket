<script lang="ts">
	import {
		walletNFTWithdrawIds,
		walletFTWithdrawIds,
		basketNFTWithdrawIds,
		basketFTWithdrawIds,
		selectedBasketMeta
	} from '$lib/flow/stores.client';
	import { type ModalSettings, modalStore } from '@skeletonlabs/skeleton';
	import { get } from 'svelte/store';

	export let nft: any = {};
	export let ft: any = {};
	export let type: 'nft' | 'ft';
	const isNFT = type === 'nft';

	function modalComponentWithdrawNft(nft: NFTCatalogEntry): void {
		const modal: ModalSettings = {
			type: 'component',
			title: `Withdraw NFT ${nft?.id} ${nft?.name} ${nft?.collectionName}`,
			meta: nft,
			component: 'withdrawNFT'
		};
		modalStore.trigger(modal);
	}
	function modalComponentWithdrawFt(ft: FTCatalogEntry) {
		if ($selectedBasketMeta.id === undefined) {
			alert('Please select a basket first');
			return;
		}
		const modal: ModalSettings = {
			type: 'component',
			title: `Withdraw ${ft.token}`,
			meta: ft,
			component: 'withdrawFT'
		};
		modalStore.trigger(modal);
	}

	function addOrRemoveNFTId(nft: any) {
		modalComponentWithdrawNft(nft);
	}
	function addOrRemoveFTToken(ft: FTCatalogEntry) {
		modalComponentWithdrawFt(ft);
	}
	function extractNameFromId(id: string): string {
		return id.split('.')[2];
	}
	function reduceDecimalsToTwo(amount: string) {
		return amount.slice(0, amount.length - 6);		
	}


	$: console.log(ft, 'ft');
	$: console.log(nft);
	$: console.log($selectedBasketMeta);
</script>

<button
	class={`flex flex-col items-center justify-start bg-tertiary-900 rounded-md hoverShadow p-2 sm:p-4`}
	on:click={() => (isNFT ? addOrRemoveNFTId(nft.id) : addOrRemoveFTToken(ft))}
>
	<div class="flex flex-col justify-between p-3">
		<div class="flex flex-col items-center w-full">
			{#if type === 'nft'}
				<p class="text-xs sm:text-sm">{extractNameFromId(nft.name)}</p>
				<p class="text-sm pt-3 text-center">{JSON.stringify(nft.ids)}</p>
			{:else if type === 'ft'}
				<p class="text-xs sm:text-sm">{extractNameFromId(ft.name)}</p>
				<p class="text-sm pt-1 text-center">{reduceDecimalsToTwo(ft.balance)}</p>
			{/if}
		</div>
	</div>
</button>
