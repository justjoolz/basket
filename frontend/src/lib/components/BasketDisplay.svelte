<script lang="ts">
	import { modalStore, type ModalSettings, TabGroup, Tab } from '@skeletonlabs/skeleton';
	import topFolder from '$lib/assets/top-folder.png';
	import ItemCard from './ItemCard.svelte';
	import { getBasketMetadata } from '$lib/flow/actions.client';
	import { get } from 'svelte/store';
	import { user, usersBasketIds, selectedBasketMeta } from '$lib/flow/stores.client';
	import BasketCard from './BasketCard.svelte';

	let nfts: NFTCatalogEntry[][];
	let fts: FTCatalogEntry[];
	let userBaskets = get(usersBasketIds);
	export let imgSrc: string;
	export let pageTitle: string;

	function basketClick(basket: string) {
		console.log('basket click');

		const basketMeta = getBasketMetadata(get(user).addr ?? '', basket);
	}
	function modalComponentCreateBasket(): void {
		const modal: ModalSettings = {
			type: 'component',
			component: 'createBasket'
		};
		modalStore.trigger(modal);
	}

	let traits: string;
	$: traits = JSON.stringify($selectedBasketMeta.traits)?.split(',').join(',\n');
	$: console.log(traits);
</script>

<div class="flex flex-col h-full pb-14 px-10 w-1/2">
	<div class="w-full flex items-center gap-x-3 pb-6 px-6">
		<img src={imgSrc} alt="" class="w-8 pb-1" />
		<p class="text-3xl font-b7">{pageTitle}</p>
	</div>
	<pre>{traits}</pre>
	<div class="border-l-2 border-b-2 border-primary-500 relative mt-4">
		<img src={topFolder} alt="" class="w-full absolute -top-3" />
		<div class="min-h-[100vh] py-6 px-4 border-r-2 border-primary-500 mt-8">
			<div class="grid grid-cols-3 gap-5">
				{#each userBaskets as basket}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div on:click={() => basketClick(basket.toString())}>
						<BasketCard basketId={basket} />
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
