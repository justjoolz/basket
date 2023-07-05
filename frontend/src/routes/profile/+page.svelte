<script lang="ts">
	import { AppRail, AppRailTile, modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import favicon from '$lib/assets/favicon.png';
	import { unauthenticate } from '@onflow/fcl';
	import { dictionaryToArray, transactionStatus, user, usersNFTs } from '$lib/flow/stores';

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

	let vaults: NFTCatalogEntry[];
	$: vaults = dictionaryToArray($usersNFTs);
	let currentTile: number = 1;
	$: currentVault = vaults[currentTile - 1];

	$: console.log(vaults);
	$: console.log(currentVault);
</script>

<div class="container flex flex-col justify-center items-center">
	<div class="flex flex-col justify-center items-center space-y-4 w-full">
		<div class="pb-8 w-full">
			<h1 class="text-6xl leading-none font-bold text-center pb-2">My Profile</h1>
			{$transactionStatus}
			{#if $user.loggedIn}<button
					on:click={unauthenticate}
					class="btn variant-filled-primary font-bold">Logout</button
				>{/if}
		</div>
		<div class="flex w-full border">
			<AppRail
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
			</AppRail>
			<div class="flex flex-col items-center min-h-[60vh] w-full p-6">
				<div class="w-full h-full">
					<h4 class="h3 font-bold pb-6">Basket {currentTile}</h4>
					<div class="flex w-full h-full pb-14">
						<div class="flex flex-col p-4 gap-y-4 border w-1/2 h-full">
							<h4 class="h4 font-bold">NFTs</h4>
							<!-- {#each currentVault as nft}
								<div class="flex items-center justify-between border p-4 px-20">
									<div class="flex gap-x-4 items-center">
										<img src={nft.image} alt={nft.name} class="block h-12 w-auto" />
										<div class="flex flex-col items-center justify-center">
											<h4 class="h4 font-bold pb-2">{nft.name}</h4>
											<p>{nft.description}</p>
										</div>
									</div>
									<button
										class="btn variant-filled-primary font-bold ml-12"
										on:click={() => modalComponentWithdrawNft(nft.id)}>Withdraw</button
									>
								</div>
							{/each} -->
						</div>
						<div class="flex flex-col p-4 gap-y-4 border w-1/2 h-full">
							<h4 class="h4 font-bold">FTs</h4>
							<!-- {#each currentVault.fts as ft}
								<div class="flex items-center justify-between border px-20 p-4">
									<div class="flex items-center justify-center">
										<h4 class="h4 font-bold pr-3">{ft.name}</h4>
										<p class="h4 font-bold pr-3">${ft.qty}</p>
									</div>
									<button
										class="btn variant-filled-primary font-bold ml-12"
										on:click={() => modalComponentWithdrawFt(ft.name)}>Withdraw</button
									>
								</div>
							{/each} -->
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="flex gap-x-4 items-center">
			<button class="btn variant-filled-primary font-bold" on:click={modalComponentCreateBasket}
				>Create Empty Basket</button
			>
			<button class="btn variant-filled-primary font-bold" on:click={modalComponentDeposit}
				>Deposit</button
			>
		</div>
	</div>
</div>
