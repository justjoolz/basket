<script lang="ts">
	import { basketTxs, fetchBasketMetadata } from '$lib/flow/actions.client';
	import { ftTokens, selectedBasketMeta } from '$lib/flow/stores.client';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { TokenInfo } from 'flow-native-token-registry';

	export let parent: any;

	let ft: FTCatalogEntry = $modalStore[0].meta;
	let token: TokenInfo | undefined;
	let amount: number = 0;

	$: token = $ftTokens.find((token) => token.symbol === ft.token);

	let withdrawBtnClick = () => {
		const storagePath = token?.path.vault ?? '';
		if (!storagePath) return;

		basketTxs.depositFT($selectedBasketMeta.id, storagePath, amount.toString());
		parent.onClose();
		fetchBasketMetadata($selectedBasketMeta.id);
	};

	const cButton = 'fixed top-6 right-6 z-50 font-bold shadow-xl';
</script>

{#if $modalStore[0]}
	<button class="btn-icon variant-filled {cButton}" on:click={parent.onClose}>X</button>
	<div class="card flex flex-col items-center variant-filled-tertiary py-20 px-32">
		<h1 class="pb-4 text-2xl font-bold">{$modalStore[0].title}</h1>
		<h4 class="pb-4 text-xl">Please select the amount you want to withdraw</h4>
		<input type="number" class="input mb-4" placeholder="Amount" bind:value={amount} />
		<h4 class="pb-4 text-xl">
			Depositing to basket #{$selectedBasketMeta.id}
		</h4>
		<button class="btn variant-filled-primary font-bold" on:click={withdrawBtnClick}
			>Withdraw {amount} / {ft.balance}</button
		>
	</div>
{/if}
