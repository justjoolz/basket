<script lang="ts">
	import { selectedBasketMeta } from '$lib/flow/stores.client';
	import { modalStore, type ModalSettings, TabGroup, Tab } from '@skeletonlabs/skeleton';

	export let nfts: NFTCatalogEntry[][];
	export let fts: FTCatalogEntry[];
	export let imgSrc: string;
	export let title: string;
	let tabSet: string = 'nfts';

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

<div class="flex flex-col h-full pb-14 px-10 w-1/2">
	<div class="w-full flex items-center gap-x-3 pb-8">
		<img src={imgSrc} alt="" class="w-8 pb-1" />
		<p class="text-3xl font-b7">{title}</p>
	</div>
	<div class="border-primary p-6">
		<TabGroup>
			<Tab bind:group={tabSet} name="tab1" value={'nfts'}>
				<span>NFTs</span>
			</Tab>
			<Tab bind:group={tabSet} name="tab2" value={'fts'}>FTs</Tab>
		</TabGroup>
		<div class="w-full border py-6 flex flex-col gap-y-4">
			{#if tabSet === 'nfts'}
				{#each nfts as nftCollection}
					<div>
						<p class="h3 font-bold px-4">{nftCollection[0]?.collectionName}</p>
						<div class="gridDisplay p-4">
							{#each nftCollection as nft}
								<div
									class="flex flex-col items-center justify-between bg-tertiary-900 rounded-md p-4 hoverShadow"
								>
									<div class="flex flex-col items-center w-full">
										<img src={nft.thumbnail} alt={nft.name} class="w-12" />
										<p class="text-sm pt-2 pb-6 text-center">{nft.name}</p>
									</div>
									<button class="btn font-bold" on:click={() => modalComponentWithdrawNft(nft)}
										>Deposit</button
									>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			{:else if tabSet === 'fts'}
				<div class="gridDisplay p-4 pt-12">
					{#each fts as ftCollection}
						<div
							class="flex flex-col items-center justify-between bg-tertiary-900 rounded-md p-4 hoverShadow"
						>
							<div class="flex flex-col items-center w-full">
								<h4>{ftCollection.token}</h4>
								<p>{ftCollection.balance}</p>
							</div>
							<button class="btn font-bold" on:click={() => modalComponentWithdrawFt(ftCollection)}
								>Deposit</button
							>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
