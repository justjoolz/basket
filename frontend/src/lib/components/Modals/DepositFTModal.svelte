<script lang="ts">
	import { basketTxs, fetchBasketMetadata } from '$lib/flow/actions.client';
	import { ftTokens, selectedBasketMeta } from '$lib/flow/stores.client';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { TokenInfo } from 'flow-native-token-registry';

	let ft: FTCatalogEntry = $modalStore[0].meta;
	export let parent: any;
	let amount: number = 0;

	const cButton = 'fixed top-6 right-6 z-50 font-bold shadow-xl';

	let depositBtnClick = () => {
		if (!ft) return;

		console.log(ft.name);
		const contractName = ft.name.split('.')[2];
		const address = '0x' + ft.name.split('.')[1];
		let token = $ftTokens.find(
			(token) => token.contractName === contractName && token.address === address
		);
		console.log(ft, token, $ftTokens);

		const storagePath = token?.path.vault ?? '';
		if (!storagePath) return;

		basketTxs.withdrawFT($selectedBasketMeta.id, storagePath, amount.toString());
		parent.onClose();
	};
</script>

{#if $modalStore[0]}
	<button class="btn-icon variant-filled {cButton}" on:click={parent.onClose}>X</button>
	<div class="card variant-filled-tertiary py-20 px-32">
		<h4 class="pb-4 text-xl">
			Please select the amount you want to withdraw from the basket and deposit in your account
		</h4>
		<input type="number" class="input mb-4" placeholder="Amount" bind:value={amount} />
		<button class="btn variant-filled-primary font-bold" on:click={depositBtnClick}>Deposit</button>
	</div>
{/if}
