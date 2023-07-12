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
	import { getBasketMetadata } from '$lib/flow/actions.client';
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
			getBasketMetadata(get(user).addr ?? '', basket);
			console.log(basket);
		};
	}

	let traits: string;
	$: traits = JSON.stringify($selectedBasketMeta.traits)?.split(',').join(',\n');

</script>

<div class="flexColumnCenter pb-10">
	<p class="text-[64px] leading-[160px] pt-6 hero-text-outline">My Profile</p>
	<div class="flex justify-center items-start w-full">
		<ContentDisplay pageTitle={'Wallet'} />
		<ContentDisplay pageTitle={'Basket'} />

		<!-- <div class="w-1/2 flex flex-col pl-6">
			<div class="flex">
				<TabGroup>
					{#each $usersBasketIds as basketId}
						<Tab bind:group={tabSet} name="tab1" value={basketId}>
							<svelte:fragment
								><div class="flex items-center gap-x-3" on:click={basketClick(basketId.toString())}>
									<img src={basketIcon} alt="" class="w-10 h-10" />
									<p class="text-2xl font-bold">{basketId}</p>
								</div></svelte:fragment
							>
						</Tab>
					{/each}
				</TabGroup>
				<div class="ml-2 pt-2">
					<button class="btn-icon variant-filled-primary" on:click={modalComponentCreateBasket}>
						<span class="text-3xl !leading-none font-bold pb-[6px] pr-[2px]">+</span>
					</button>
				</div>
			</div>
			<div>
				{$selectedBasketMeta.id}

				 <pre class="text-sm">
									{JSON.stringify($selectedBasketMeta).split(',').join(',\n')}
								</pre> -->

		<!-- <pre>
									{traits}
								</pre> -->
		<!-- <ContentDisplay currentVault={$selectedBasketMeta} /> -->

		<!-- {#each basketCollection as basket}
									{#if tabSet === basket.position}
									{/if}
								{/each} -->
		<!-- </div>
		</div> -->
	</div>
	<TradeSection />
</div>
