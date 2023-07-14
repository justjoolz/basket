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

	function basketClick(basket: string) {
		return () => {
			fetchBasketMetadata(basket);
			console.log(basket);
		};
	}

	let traits: string;
	$: traits = JSON.stringify($selectedBasketMeta.traits)?.split(',').join(',\n');
</script>

<div class="flexColumnCenter pb-10">
	<p class="text-3xl leading-[60px] sm:text-5xl sm:leading-[140px] lg:text-[64px] lg:leading-[160px] py-6 hero-text-outline">My Profile</p>
	<div class="flex flex-col lg:flex-row justify-center items-start w-full">
		<ContentDisplay pageTitle={'Wallet'} />
		<ContentDisplay pageTitle={'Basket'} />
	</div>
	<!-- <TradeSection /> -->
</div>
