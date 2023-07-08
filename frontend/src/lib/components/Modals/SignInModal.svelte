<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';
	import { logIn } from '$lib/flow/actions.client';

	export let parent: any;

	const cButton = 'fixed top-6 right-6 z-50 font-bold shadow-xl';
</script>

{#if $modalStore[0]}
	<button class="btn-icon variant-filled {cButton}" on:click={parent.onClose}>X</button>
	<div class="card variant-filled-tertiary py-20 px-32">
		<button class="btn variant-filled-primary font-bold" on:click={logIn}>Sign In</button>
	</div>
{/if}
