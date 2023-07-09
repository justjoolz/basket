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
	import walletIcon from '$lib/assets/wallet-icon.svg';
	import basketIcon from '$lib/assets/basket-icon.svg';
	import tradeIcon from '$lib/assets/trade-arrow.svg';

	import {
		dictionaryToArray,
		transactionStatus,
		user,
		usersNFTs,
		usersFTs,
		ftDictionaryToArray,
		usersBasketIds,
		selectedBasketMeta
	} from '$lib/flow/stores.client';
	import ContentDisplay from '$lib/components/ContentDisplay.svelte';
	import { getBasketMetadata } from '$lib/flow/actions.client';
	import { get } from 'svelte/store';

	function modalComponentDeposit(): void {
		const modal: ModalSettings = {
			type: 'component',
			component: 'deposit'
		};
		modalStore.trigger(modal);
	}
	function modalComponentCreateBasket(): void {
		const modal: ModalSettings = {
			type: 'component',
			component: 'createBasket'
		};
		modalStore.trigger(modal);
	}
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
	function modalComponentTrade(name: string) {
		const modal: ModalSettings = {
			type: 'component',
			title: `Withdraw ${name}`,
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
			getBasketMetadata(get(user).addr ?? '', basket);
			console.log(basket);
		};
	}

	let traits: string;
	$: traits = JSON.stringify($selectedBasketMeta.traits).split(',').join(',\n');

	// $: console.log(vaults);
	// $: console.log(currentVault);
</script>

<div class="flexColumnCenter pb-10">
	<p class="text-[64px] leading-[160px] pt-6 hero-text-outline">My Profile</p>
	<div class="flex justify-center items-start w-full">
		<ContentDisplay title={'Wallet'} imgSrc={walletIcon} nfts={walletNFTs} fts={walletFTs} />
		<ContentDisplay title={'Basket'} imgSrc={basketIcon} nfts={walletNFTs} fts={walletFTs} />

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
	<div class="flexColumnCenter w-full fixed bottom-0 bg-surface-900">
		<div class="w-full h-2 flex px-[44px] gap-x-20">
			<div class="border-t-2 border-primary-500 w-1/2" />
			<div class="border-t-2 border-primary-500 w-1/2" />
		</div>
		<div
			class="flex w-full justify-center items-center gap-x-5 py-8 hover:scale-105 transition-all duration-300"
		>
			<img src={tradeIcon} alt="trade arrow" class="w-6" />
			<div>
				<button class="text-2xl font-bold" on:click={() => modalComponentTrade('nfts')}
					>TRADE</button
				>
			</div>
			<img src={tradeIcon} alt="trade arrow" class="rotate-180 w-6" />
		</div>
	</div>
</div>
