<script lang="ts">
	import {
		AppRail,
		AppRailTile,
		modalStore,
		type ModalSettings,
		TabGroup,
		Tab,
		toastStore
	} from '@skeletonlabs/skeleton';

	import {
		dictionaryToArray,
		transactionStatus,
		user,
		usersNFTs,
		usersFTs,
		ftDictionaryToArray,
		usersBasketIds,
		selectedBasketMeta,
		walletNFTWithdrawIds,
		walletFTWithdrawIds,
		basketNFTWithdrawIds,
		basketFTWithdrawIds
	} from '$lib/flow/stores.client';
	import ContentDisplay from '$lib/components/ContentDisplay.svelte';
	import { fetchBasketMetadata } from '$lib/flow/actions.client';
	import { get } from 'svelte/store';
	import TradeSection from '$lib/components/Trade/TradeSection.svelte';

	function transactionStatusToast(transactionStatus: string): void {
		const t = {
			message: transactionStatus,
			background: 'variant-filled-success'
		};
		toastStore.trigger(t);
	}

	let tabSet: number = 0;
	let walletNFTs: NFTCatalogEntry[][];
	let walletFTs: FTCatalogEntry[];
	let userBaskets: NFTCatalogEntry[][] = [];
	$: walletNFTs = dictionaryToArray($usersNFTs);
	$: walletFTs = [...ftDictionaryToArray($usersFTs)];
	$: console.log(walletFTs, 'walletFTs');

	function modalComponentWithdrawNft(id: string): void {
		const modal: ModalSettings = {
			type: 'component',
			title: `Withdraw NFT ${id}`,
			component: 'withdraw'
		};
		modalStore.trigger(modal);
	}
	function modalComponentWithdrawFt(name: string) {
		const modal: ModalSettings = {
			type: 'component',
			title: `Withdraw FT ${name}`,
			component: 'withdraw'
		};
		modalStore.trigger(modal);
	}

	let vaults: NFTCatalogEntry[][];
	$: vaults = dictionaryToArray($usersNFTs);
	let currentTile: number = 1;
	$: currentVault = vaults[currentTile - 1];

	function basketClick(basket: string) {
		return () => {
			fetchBasketMetadata(basket);
			console.log(basket);
		};
	}

	let traits: string;
	$: traits = JSON.stringify($selectedBasketMeta.traits)?.split(',').join(',\n');
</script>

<div class="w-full">
	<div class="flexColumnCenter pb-10 max-w-[1920px] mx-auto">
		<p
			class="text-3xl leading-[60px] sm:text-5xl sm:leading-[140px] lg:text-[64px] lg:leading-[160px] py-6 hero-text-outline"
		>
			My Profile
		</p>
		<div class="flex flex-col lg:flex-row justify-center items-start w-full">
			<ContentDisplay pageTitle={'Wallet'} />
			<ContentDisplay pageTitle={'Basket'} />
		</div>
		<!-- <TradeSection /> -->
	</div>
</div>
