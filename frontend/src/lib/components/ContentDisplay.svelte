<script lang="ts">
	import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';

	export let nfts: NFTCatalogEntry[];
	export let fts: FTCatalogEntry[];
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
	console.log(nfts, 'nfts');
	console.log(fts, 'fts');
</script>

<div class="flex flex-col w-full h-full pb-14">
	<div class="flex flex-col p-4 gap-y-4 w-full">
		<h4 class="h4 font-bold">NFTs</h4>
		{#each nfts as nftCollection}
			<div class="flex flex-col border p-4 gap-y-2">
				<p class="h3 font-bold">{nftCollection[0].collectionName}</p>
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
							on:click={() => modalComponentWithdrawNft(nft.id)}>Withdraw</button
						>
					</div>
				{/each}
			</div>
		{/each}
	</div>
	<div class="flex flex-col p-4 gap-y-4 w-full">
		<h4 class="h4 font-bold">FTs</h4>
		{#each fts as ftCollection}
			<div class="flex items-center justify-between border px-20 p-4">
				<div class="flex items-center justify-center">
					<h4 class="h4 font-bold pr-3">{ftCollection.token}</h4>
					<p class="h4 font-bold pr-3">${ftCollection.balance}</p>
				</div>
				<button
					class="btn variant-filled-primary font-bold ml-12"
					on:click={() => modalComponentWithdrawFt(ftCollection.token)}>Withdraw</button
				>
			</div>
		{/each}
	</div>
</div>
