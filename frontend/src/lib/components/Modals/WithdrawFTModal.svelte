<script lang="ts">
	import { basketTxs, fetchTokenBalances } from '$lib/flow/actions.client';
	import { basket, ftTokens, selectedBasketMeta, user } from '$lib/flow/stores.client';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { TokenInfo } from 'flow-native-token-registry';
	import { get } from 'svelte/store';

	export let parent: any;

	let ft: FTCatalogEntry = $modalStore[0].meta;
	let token: TokenInfo | undefined;
	let amount: number = 0;

	$: token = $ftTokens.find((token) => token.symbol === ft.token);
	$: console.log(token, 'token');

	let withdrawBtnClick = () => {
		console.log({ $selectedBasketMeta }, $selectedBasketMeta.id, 'selectedBasketMeta.id');
		if ($selectedBasketMeta.id === undefined) {
			alert('Please select a basket first');
			return;
		}
		const storagePath = token?.path.vault ?? '';
		if (!storagePath) return;
		basketTxs.depositFT($selectedBasketMeta.id, storagePath, amount.toString());
		parent.onClose();
	};

	const cButton = 'fixed top-6 right-6 z-50 font-bold shadow-xl';
</script>

{#if $modalStore[0]}
	<button class="btn-icon variant-filled {cButton}" on:click={parent.onClose}>X</button>
	<div class="card flex flex-col items-center variant-filled-tertiary py-20 px-32">
		<pre>
			{JSON.stringify(token).split(',').join(',\n')}
		</pre>
		<h1 class="pb-4 text-xl">{$modalStore[0].title}</h1>
		<input type="number" class="input" placeholder="Amount" bind:value={amount} />
		<h2>
			Depositing to basked #{$selectedBasketMeta.id}
		</h2>
		<button class="btn variant-filled-primary font-bold" on:click={withdrawBtnClick}
			>Withdraw {amount} / {ft.balance} {ft.token}</button
		>
	</div>
{/if}
