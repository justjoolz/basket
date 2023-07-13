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
	export let location: string;
	let _walletNFTWithdrawIds = get(walletNFTWithdrawIds);
	let _walletFTWithdrawIds = get(walletFTWithdrawIds);
	let _basketNFTWithdrawIds = get(basketNFTWithdrawIds);
	let _basketFTWithdrawIds = get(basketFTWithdrawIds);

	const isWallet = location === 'Wallet';
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

	let nftArray: number[] = [];
	let ftArray: FTCatalogEntry[] = [];
	if (isWallet) {
		if (isNFT) {
			nftArray = _walletNFTWithdrawIds;
		} else {
			ftArray = _walletFTWithdrawIds;
		}
	} else {
		if (isNFT) {
			nftArray = _basketNFTWithdrawIds;
		} else {
			ftArray = _basketFTWithdrawIds;
		}
	}

	let isSelected: boolean = isNFT ? nftArray.includes(nft.id) : ftArray.includes(ft);

	function addOrRemoveNFTId(id: number) {
		isSelected = !isSelected;
		modalComponentWithdrawNft(nft);
		if (!isSelected && isWallet) {
			walletNFTWithdrawIds.update((ids) => ids.filter((i) => i !== id));
		} else if (isSelected && isWallet) {
			walletNFTWithdrawIds.update((ids) => [...ids, id]);
		} else if (!isSelected && !isWallet) {
			basketNFTWithdrawIds.update((ids) => ids.filter((i) => i !== id));
		} else if (isSelected && !isWallet) {
			basketNFTWithdrawIds.update((ids) => [...ids, id]);
		}
	}
	function addOrRemoveFTToken(token: FTCatalogEntry) {
		isSelected = !isSelected;
		modalComponentWithdrawFt(ft);
		if (!isSelected && isWallet) {
			walletFTWithdrawIds.update((tokens) => tokens.filter((t) => t !== token));
		} else if (isSelected && isWallet) {
			walletFTWithdrawIds.update((tokens) => [...tokens, token]);
		} else if (!isSelected && !isWallet) {
			basketFTWithdrawIds.update((tokens) => tokens.filter((t) => t !== token));
		} else if (isSelected && !isWallet) {
			basketFTWithdrawIds.update((tokens) => [...tokens, token]);
		}
	}
</script>

<button
	class={`flex flex-col items-center justify-start bg-tertiary-900 rounded-md hoverShadow p-4 ${
		isSelected && 'selectionCard'
	}`}
	on:click={() => (isNFT ? addOrRemoveNFTId(nft.id) : addOrRemoveFTToken(ft))}
>
	<span /><span /><span /><span />
	<div class="flex flex-col h-full justify-between">
		<div class="flex flex-col items-center w-full">
			{#if type === 'nft'}
				<img src={nft.thumbnail} alt={nft.name} class="h-12" />
				<p class="text-sm pt-3 text-center">{nft.name}</p>
			{:else if type === 'ft'}
				<h4>{ft.token}</h4>
				<p class="text-sm pt-1 text-center">{ft.balance}</p>
			{/if}
		</div>
		<!-- <button class="font-bold">Deposit</button> -->
	</div>
</button>
