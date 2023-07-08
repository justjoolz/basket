<script lang="ts">
	import { selectedBasketMeta } from '$lib/flow/stores.client';
	import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';

	export let nfts: NFTCatalogEntry[][];
	export let fts: FTCatalogEntry[];

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

	console.log(nfts, 'nfts');
	console.log(fts, 'fts');
</script>

<div class="flex flex-col w-full h-full pb-14">
	<div class="flex flex-col p-4 gap-y-4 w-full">
		<h4 class="h4 font-bold">NFTs</h4>
		{#each nfts as nftCollection}
			<div class="flex flex-col border p-4 gap-y-2">
				<p class="h3 font-bold">{nftCollection[0]?.collectionName}</p>
				{#each nftCollection as nft}
					<div class="flex items-center border rounded-md p-4 px-20 gap-x-6">
						<div class="flex gap-x-4 items-center w-1/3">
							<img src={nft.thumbnail} alt={nft.name} class="block h-12 w-auto" />
						</div>
						<div class="flex w-1/3">
							<h4 class="h4 font-bold pb-2">{nft.name}</h4>
						</div>
						<button
							class="btn variant-filled-primary font-bold ml-12"
							on:click={() => modalComponentWithdrawNft(nft)}>Withdraw</button
						>
					</div>
				{/each}
			</div>
		{/each}
	</div>
	<div class="flex flex-col p-4 gap-y-4 w-full">
		<h4 class="h4 font-bold">FTs</h4>
		{#each fts as ftCollection}
			<div class="flex items-center border rounded-md p-4 px-20 gap-x-6">
				<div class="flex items-center w-1/3">
					<h4 class="h4 font-bold pr-3">{ftCollection.token}</h4>
				</div>
				<div class="flex w-1/3">
					<p class="h4 font-bold pr-3">${ftCollection.balance}</p>
				</div>
				<button
					class="btn variant-filled-primary font-bold ml-12"
					on:click={() => modalComponentWithdrawFt(ftCollection)}>Withdraw</button
				>
			</div>
		{/each}
	</div>
</div>
