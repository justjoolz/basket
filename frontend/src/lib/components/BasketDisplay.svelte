<script lang="ts">
	import { modalStore, type ModalSettings, TabGroup, Tab } from '@skeletonlabs/skeleton';
	import topFolder from '$lib/assets/top-folder.png';
	import ItemCard from './ItemCard.svelte';
	import { fetchBasketMetadata } from '$lib/flow/actions.client';
	import { get } from 'svelte/store';
	import { user, usersBasketIds, selectedBasketMeta } from '$lib/flow/stores.client';
	import BasketCard from './BasketCard.svelte';
	import ItemDisplay from './ItemDisplay.svelte';
	import BasketItemCard from './BasketItemCard.svelte';

	let nfts: any[] = [];
	let fts: any[] = [];
	let isBasketSelected: boolean = false;
	let selectedBasketId: string = '';
	export let imgSrc: string;
	export let pageTitle: string;

	function basketClick(basket: string) {
		selectedBasketId = basket;
		isBasketSelected = true;
		fetchBasketMetadata(selectedBasketId);
	}
	function modalComponentCreateBasket(): void {
		const modal: ModalSettings = {
			type: 'component',
			component: 'createBasket'
		};
		modalStore.trigger(modal);
	}

	$: {
		let ftNames =
			$selectedBasketMeta.traits.traits.find((trait: any) => trait.name === 'Fungible Tokens')
				?.value ?? [];
		let ftBalances =
			$selectedBasketMeta.traits.traits.find(
				(trait: any) => trait.name === 'Fungible Token Balances'
			)?.value ?? [];
		let nftCollections =
			$selectedBasketMeta.traits.traits.find(
				(trait: any) => trait.name === 'Non-Fungible Token Collections'
			)?.value ?? [];
		let nftIds =
			$selectedBasketMeta.traits.traits.find(
				(trait: any) => trait.name === 'Non-Fungible Token with IDs'
			)?.value ?? [];
		console.log({ ftNames, ftBalances }, { nftCollections, nftIds });
		fts = ftNames.map((name: string, i: number) => {
			return {
				name,
				balance: ftBalances[name]
			};
		});
		nfts = nftCollections.map((name: string, i: number) => {
			return {
				name,
				ids: nftIds[name]
			};
		});
		console.log({ fts, nfts });
	}
</script>

<div class="flex flex-col h-full pb-14 px-10 w-1/2">
	<div class="w-full flex items-center gap-x-3 pb-6 px-6">
		<img src={imgSrc} alt="" class="w-8 pb-1" />
		<div class="flex text-3xl font-b7">
			{pageTitle}
			{#if isBasketSelected && selectedBasketId !== '+'}
				<div class="pl-2 flex relative">
					<p>{selectedBasketId}</p>
					<button
						type="button"
						class="flexRowCenter w-6 h-6 btn-icon text-sm btn-sm variant-filled-error absolute -top-3 -right-7"
						on:click={() => {
							isBasketSelected = false;
						}}>x</button
					>
				</div>
			{/if}
		</div>
	</div>

	<div class="border-l-2 border-b-2 border-primary-500 relative mt-4">
		<img src={topFolder} alt="" class="w-full absolute -top-3" />
		<div class="min-h-[100vh] py-6 px-4 border-r-2 border-primary-500 mt-8">
			{#if !isBasketSelected}
				<div class="grid grid-cols-3 gap-5">
					{#each $usersBasketIds as basket}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div on:click={() => basketClick(basket.toString())}>
							<BasketCard basketId={basket} />
						</div>
					{/each}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div on:click={modalComponentCreateBasket}>
						<BasketCard basketId={'+'} />
					</div>
				</div>
			{:else}
				<div class="grid grid-cols-3 gap-5">
					{#each nfts as nft}
						<BasketItemCard type="nft" {nft} />
					{/each}
					{#each fts as ft}
						<BasketItemCard type="ft" {ft} />
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
