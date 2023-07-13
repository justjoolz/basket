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
			title: `Withdraw NFT ${nft.id} ${nft.name} ${nft.collectionName}`,
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

</script>

<button
	class={`flex flex-col items-center justify-start bg-tertiary-900 rounded-md hoverShadow p-4`}
	on:click={() => (isNFT ? addOrRemoveNFTId(nft.id) : addOrRemoveFTToken(ft))}
>
	<span /><span /><span /><span />
	<div class="flex flex-col h-full justify-between">
		<div class="flex flex-col items-center w-full">
			{#if type === 'nft'}
				<p class="text-sm pt-3 text-center">{nft.name}</p>
			{:else if type === 'ft'}
				<h4>{ft.name}</h4>
				<p class="text-sm pt-1 text-center">{ft}</p>
			{/if}
		</div>
		<!-- <button class="font-bold">Deposit</button> -->
	</div>
</button>
