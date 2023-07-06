<script lang="ts">
	import {
		AppRail,
		AppRailTile,
		modalStore,
		type ModalSettings,
		TabGroup,
		Tab
	} from '@skeletonlabs/skeleton';
	import basket from '$lib/assets/basket-icon.svg';
	import { unauthenticate } from '@onflow/fcl';
	import { dictionaryToArray, transactionStatus, user, usersNFTs } from '$lib/flow/stores';
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
	let vaults: NFTCatalogEntry[];
	$: vaults = dictionaryToArray($usersNFTs);
	console.log(usersNFTs, 'usersNFTs');
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
			<!-- <AppRail
				border="border-r-2"
				height="full"
				width="w-32"
				background="bg-tertiary-100-800-token"
				active="bg-secondary-active-token"
			>
				{#each vaults as vault}
					<AppRailTile
						bind:group={currentTile}
						name={`${vault.collectionName}`}
						value={vault.id}
						title={`${vault.collectionDescription}`}
					>
						<svelte:fragment slot="lead">(icon)</svelte:fragment>
						<span>{`Basket ${vault.id}`}</span>
					</AppRailTile>
				{/each}
			</AppRail> -->
			<div class="flex flex-col items-center min-h-[60vh] w-full p-6">
				<div class="w-full h-full">
					<div class="flex w-full">
						<div class="w-1/2 border-r-2">
							<h4 class="h3 font-bold pb-6 underline">My Wallet</h4>
							<ContentDisplay currentVault={vaults} />
						</div>
						<div class="w-1/2 flex flex-col pl-6">
							<div class="flex">
								<TabGroup>
									<Tab bind:group={tabSet} name="tab1" value={0}>
										<svelte:fragment slot="lead"
											><div class="flex items-center gap-x-3">
												<img src={basket} alt="" class="w-10 h-10" />
												<p class="text-2xl font-bold">1</p>
											</div></svelte:fragment
										>
									</Tab>
									<Tab bind:group={tabSet} name="tab2" value={1}
										><div class="flex items-center gap-x-3">
											<img src={basket} alt="" class="w-10 h-10" />
											<p class="text-2xl font-bold">2</p>
										</div></Tab
									>
									<Tab bind:group={tabSet} name="tab3" value={2}
										><div class="flex items-center gap-x-3">
											<img src={basket} alt="" class="w-10 h-10" />
											<p class="text-2xl font-bold">3</p>
										</div></Tab
									>
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
								<ContentDisplay currentVault={vaults} />
								{#if tabSet === 0}
									(Basket 1 contents)
								{:else if tabSet === 1}
									(Basket 2 contents)
								{:else if tabSet === 2}
									(Basket 3 contents)
								{/if}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
