<script lang="ts">
	import { selectedBasketMeta } from '$lib/flow/stores.client';
	import { modalStore, type ModalSettings, TabGroup, Tab } from '@skeletonlabs/skeleton';
	import topFolder from '$lib/assets/top-folder.png';
	import ItemCard from './ItemCard.svelte';

	export let nfts: NFTCatalogEntry[][];
	export let fts: FTCatalogEntry[];
	export let imgSrc: string;
	export let title: string;

	function modalComponentWithdrawNft(nft: NFTCatalogEntry): void {
		const modal: ModalSettings = {
			type: 'component',
			title: `Withdraw NFT ${nft.id} ${nft.name} ${nft.collectionName}`,
			meta: nft,
			component: 'withdrawNFT'
		};
		modalStore.trigger(modal);
	}
	let folder = true;
	function updateFolder() {
		folder = !folder;
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

<div class="flex flex-col h-full pb-14 px-10 w-1/2">
	<div class="w-full flex items-center gap-x-3 pb-6 px-6">
		<img src={imgSrc} alt="" class="w-8 pb-1" />
		<p class="text-3xl font-b7">{title}</p>
	</div>
	<div class="border-l-2 border-b-2 border-primary-500 relative mt-4">
		<img src={topFolder} alt="" class="w-full absolute -top-3" />
		<div class="absolute -top-4 left-20 w-1/4 px-4 py-2">
			<div class="flex w-full items-start justify-between">
				<button class="hover:scale-[1.02] hover:text-primary-100 transition-all"
					>{folder === true ? 'NFTs' : 'FTs'}</button
				>
				<button
					class="pt-[10px] hover:scale-[1.02] hover:text-primary-100 transition-all"
					on:click={updateFolder}
				>
					{folder === true ? 'FTs' : 'NFTs'}
				</button>
			</div>
		</div>
		<div class="w-full py-6 flex flex-col gap-y-4 border-r-2 border-primary-500 mt-8 min-h-[100vh]">
			{#if folder === true}
				{#each nfts as nftCollection}
					<div>
						<p class="h3 font-bold px-4">{nftCollection[0]?.collectionName}</p>
						<div class="gridDisplay p-4">
							{#each nftCollection as nft}
								<ItemCard type="nft" {nft} location={title} />
							{/each}
						</div>
					</div>
				{/each}
			{:else if folder === false}
				<p class="h3 font-bold px-4">Fungible Tokens</p>
				<div class="gridDisplay px-4">
					{#each fts as ft}
						<ItemCard type="ft" {ft} location={title} />
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
