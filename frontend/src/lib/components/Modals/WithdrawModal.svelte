<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';

	export let parent: any;

	const cButton = 'fixed top-6 right-6 z-50 font-bold shadow-xl';
</script>

{#if $modalStore[0]}
	<button class="btn-icon variant-filled {cButton}" on:click={parent.onClose}>X</button>
	<div class="card flex flex-col items-center variant-filled-tertiary py-20 px-32">
		<h1 class="pb-4 text-xl">{$modalStore[0].title}</h1>
		<button class="btn variant-filled-primary font-bold">Withdraw</button>
	</div>
{/if}
