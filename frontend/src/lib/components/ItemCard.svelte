<script lang="ts">
	import {
		walletNFTWithdrawIds,
		walletFTWithdrawIds,
		basketNFTWithdrawIds,
		basketFTWithdrawIds
	} from '$lib/flow/stores.client';
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

	let isSelected: boolean = isWallet
		? _walletNFTWithdrawIds.includes(nft.id) || _walletFTWithdrawIds.includes(ft.token)
		: _basketNFTWithdrawIds.includes(nft.id) || _basketFTWithdrawIds.includes(ft.token);

	function handleClick(id: number) {
		if (type === 'nft') {
			console.log('send data to modal, then fire tx', { type, nft, location });
			addOrRemoveId(id);
		} else {
			console.log('send data to modal, then fire tx', { type, ft, location });
			if (location === 'Basket') addOrRemoveFT(id);
		}
	}

	function addOrRemoveFT(id: number) {
		console.log('to do add or remove amount of ft');
	}

	function addOrRemoveId(id: number) {
		isSelected = !isSelected;
		if (!isSelected) {
			walletNFTWithdrawIds.update((ids) => ids.filter((i) => i !== id));
		} else {
			walletNFTWithdrawIds.update((ids) => [...ids, id]);
		}
	}
</script>

<button
	class={`flex flex-col items-center justify-start bg-tertiary-900 rounded-md hoverShadow p-4 ${
		isSelected && 'selectionCard'
	}`}
	on:click={() => handleClick(nft.id)}
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
