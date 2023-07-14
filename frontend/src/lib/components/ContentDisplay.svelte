<script lang="ts">
	import BasketDisplay from './BasketDisplay.svelte';
	import ItemDisplay from './ItemDisplay.svelte';
	import walletIcon from '$lib/assets/wallet-icon.svg';
	import basketIcon from '$lib/assets/basket-icon.svg';
	import {
		dictionaryToArray,
		usersNFTs,
		usersFTs,
		ftDictionaryToArray
	} from '$lib/flow/stores.client';
	export let pageTitle: string;

	let walletNFTs: NFTCatalogEntry[][];
	let walletFTs: FTCatalogEntry[];
	$: walletNFTs = dictionaryToArray($usersNFTs);
	$: walletFTs = [...ftDictionaryToArray($usersFTs)];

	const isWallet = pageTitle === 'Wallet';
</script>

{#if isWallet}
	<ItemDisplay nfts={walletNFTs} fts={walletFTs} imgSrc={walletIcon} {pageTitle} />
{:else}
	<BasketDisplay imgSrc={basketIcon} {pageTitle} />
{/if}
