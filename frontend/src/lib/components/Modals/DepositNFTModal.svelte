<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';
	import { basketTxs } from '$lib/flow/actions.client';
	import { nftCatalog, selectedBasketMeta } from '$lib/flow/stores.client';

	export let parent: any;

	const cButton = 'fixed top-6 right-6 z-50 font-bold shadow-xl';

	const depositBtnClick = () => {
		if (!selectedIds.length) {
			alert(
				'please select which nft ids you want to withdraw from the basket and desposit in your accounts'
			);
			return;
		}
		let FQI = $modalStore[0].meta.name; // as NFTCatalogEntry;

		const contractName = FQI.split('.')[2];
		const contractAddress = '0x' + FQI.split('.')[1];

		const catalogEntry = Object.values($nftCatalog).find(
			(entry: any) => entry.contractAddress === contractAddress
		) as any;

		if (!catalogEntry) {
			console.log('no catalog entry found');
			return;
		}

		const storagePath = catalogEntry.collectionData.storagePath.identifier;

		const ids: string[] = $modalStore[0].meta.ids;
		// let contractName = nft.privateLinkedType.type.type.typeID.split('.')[2];
		// let address = '0x' + nft.privateLinkedType.type.type.typeID.split('.')[1];
		// console.log(address);

		// console.log({ contractName, address });

		basketTxs.withdrawNFTs(
			$selectedBasketMeta.id,
			storagePath,
			selectedIds,
			contractName,
			contractAddress
		);
		parent.onClose();
	};

	let selectedIds: string[] = [];

	function toggleId(id: string) {
		const index = selectedIds.indexOf(id);
		if (index === -1) {
			selectedIds = [...selectedIds, id];
		} else {
			selectedIds = selectedIds.filter((i) => i !== id);
		}
	}
</script>

{#if $modalStore[0]}
	<button class="btn-icon variant-filled {cButton}" on:click={parent.onClose}>X</button>
	<div class="card variant-filled-tertiary py-20 px-32">
		<h2>Select the ids you wish to withdraw:</h2>
		{#each $modalStore[0].meta.ids as id}
			<li>
				{id}
				<input type="checkbox" on:click={() => toggleId(id)} />
			</li>
		{/each}
		<button class="btn variant-filled-primary font-bold" on:click={depositBtnClick}>Deposit</button>
	</div>
{/if}
