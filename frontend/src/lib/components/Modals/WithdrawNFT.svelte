<script lang="ts">
	import { basketTxs } from '$lib/flow/actions.client';
	import { selectedBasketMeta } from '$lib/flow/stores.client';
	import { modalStore } from '@skeletonlabs/skeleton';

	export let parent: any;

	const cButton = 'fixed top-6 right-6 z-50 font-bold shadow-xl';

	const withdrawBtnClick = () => {
		let nft = $modalStore[0].meta as NFTCatalogEntry;
		const storagePath = nft.storagePath.identifier;
		const ids: string[] = [$modalStore[0].meta.id];
		console.log({ ids });
		console.log({ $selectedBasketMeta }, $selectedBasketMeta.id);
		console.log({ nft });
		let contractName = nft.privateLinkedType.type.type.typeID.split('.')[2];
		let address = '0x' + nft.privateLinkedType.type.type.typeID.split('.')[1];
		console.log(address);
		basketTxs.depositNFTs($selectedBasketMeta.id, storagePath, ids, contractName, address);
		parent.onClose();
	};
</script>

{#if $modalStore[0]}
	<button class="btn-icon variant-filled {cButton}" on:click={parent.onClose}>X</button>
	<div class="card flex flex-col items-center variant-filled-tertiary py-20 px-32">
		<h1 class="pb-4 text-xl">{$modalStore[0].title}</h1>
		<h4 class="pb-4 text-xl">
			Depositing to basket #{$selectedBasketMeta.id}
		</h4>
		<button on:click={withdrawBtnClick} class="btn variant-filled-primary font-bold"
			>Withdraw</button
		>
	</div>
{/if}
