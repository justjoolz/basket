<script lang="ts">
	import {
		AppRail,
		AppRailTile,
		modalStore,
		type ModalSettings,
		TabGroup,
		Tab
	} from '@skeletonlabs/skeleton';
	import basketIcon from '$lib/assets/basket-icon.svg';

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
	let tabSet: number = 0;
	let walletNFTs: NFTCatalogEntry[][];
	let walletFTs: FTCatalogEntry[];
	$: walletNFTs = dictionaryToArray($usersNFTs);
	$: walletFTs = ftDictionaryToArray($usersFTs);

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
			title: `Withdraw ${name}`,
			component: 'withdraw'
		};
		modalStore.trigger(modal);
	}

	let vaults: NFTCatalogEntry[][];
	$: vaults = dictionaryToArray($usersNFTs);
	let currentTile: number = 1;
	$: currentVault = vaults[currentTile - 1];

	// $: console.log(vaults);
	// $: console.log(currentVault);
</script>

<div class="flex flex-col justify-center items-center">
	<div class="flex flex-col justify-center items-center space-y-4 w-full">
		<h1 class="text-6xl leading-none font-bold text-center pb-2">My Profile</h1>
		<div class="flex justify-between pb-2 w-full">
			{$transactionStatus}
			<div class="flex gap-x-4 items-center">
				<button class="btn variant-filled-primary font-bold" on:click={modalComponentCreateBasket}
					>Create Empty Basket</button
				>
				<button class="btn variant-filled-primary font-bold" on:click={modalComponentDeposit}
					>Deposit</button
				>
			</div>
		</div>
		<div class="flex w-full border">
			<div class="flex flex-col items-center min-h-[60vh] w-full p-6">
				<div class="w-full h-full">
					<div class="flex w-full">
						<div class="w-1/2 border-r-4">
							<h4 class="h3 font-bold pb-6 underline">My Wallet</h4>
							<ContentDisplay nfts={walletNFTs} fts={walletFTs} />
						</div>
						<div class="w-1/2 flex flex-col pl-6">
							<div class="flex">
								<TabGroup>
									{#each $usersBasketIds as basket}
										<Tab bind:group={tabSet} name="tab1" value={basket}>
											<svelte:fragment
												><div class="flex items-center gap-x-3">
													<img src={basketIcon} alt="" class="w-10 h-10" />
													<p class="text-2xl font-bold">{basket}</p>
												</div></svelte:fragment
											>
										</Tab>
									{/each}
								</TabGroup>
								<div class="ml-2 pt-2">
									<button
										class="btn-icon variant-filled-primary"
										on:click={modalComponentCreateBasket}
									>
										<span class="text-3xl !leading-none font-bold pb-[6px] pr-[2px]">+</span>
									</button>
								</div>
							</div>
							<!-- Tab Panels --->
							<div>
								<!-- <ContentDisplay currentVault={$selectedBasketMeta} /> -->

								<!-- {#each basketCollection as basket}
									{#if tabSet === basket.position}
									{/if}
								{/each} -->
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
