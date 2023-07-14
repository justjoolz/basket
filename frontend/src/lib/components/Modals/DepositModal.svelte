<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';

	export let parent: any;

	const cButton = 'fixed top-6 right-6 z-50 font-bold shadow-xl';
</script>

{#if $modalStore[0]}
	<button class="btn-icon variant-filled {cButton}" on:click={parent.onClose}>X</button>
	<div class="card variant-filled-tertiary p-10 sm:p-16 md:py-20 md:px-32">
		<button class="btn variant-filled-primary font-bold">Deposit</button>
	</div>
{/if}
