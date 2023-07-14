<script lang="ts">
	import { createEmptyBasket } from '$lib/flow/actions.client';
	import { modalStore } from '@skeletonlabs/skeleton';

	export let parent: any;

	const handleClick = (e: any) => {
		createEmptyBasket();
		if (e.target === e.currentTarget) {
			parent.onClose();
		}
	};

	const cButton = 'fixed top-6 right-6 z-50 font-bold shadow-xl';
</script>

{#if $modalStore[0]}
	<button class="btn-icon variant-filled {cButton}" on:click={parent.onClose}>X</button>
	<div class="card variant-filled-tertiary py-20 px-32">
		<button class="btn variant-filled-primary font-bold" on:click={handleClick}
			>Create Empty Basket</button
		>
	</div>
{/if}
