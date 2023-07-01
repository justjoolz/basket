<script lang="ts">
	import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';

	function modalComponentSignIn(): void {
		const modal: ModalSettings = {
			type: 'component',
			component: 'signIn'
		};
		modalStore.trigger(modal);
	}

	const descriptions = [
		{
			id: 1,
			headline: 'What is it?',
			description:
				'Basket is like an NFT MEGAvault. It gives you the ability to store all of your NFTs and Fungible tokens in one place.'
		},
		{
			id: 2,
			headline: 'How does it work?',
			description: 'It works by creating a vault that is a collection of other smaller vaults.'
		},
		{
			id: 3,
			headline: 'Why is it cool?',
			description:
				'As you collect more and more NFTs, it becomes harder to manage them. Basket makes it easy to manage your NFTs and Fungible tokens.'
		}
	];
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="flex flex-col justify-center items-center space-y-5 min-h-[80vh] w-full">
		<div class="pb-12 w-full">
			<h1 class="text-[140px] leading-none font-bold text-start pb-10 -ml-2">Basket</h1>
			<p class="text-lg">
				Basket is a collection of NFT Vaults for keeping all of your collectibles in one location!
			</p>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full pb-10">
			{#each descriptions as description}
				<div class="card p-6 variant-ghost-tertiary flex flex-col gap-2 relative w-full">
					<div class="h5 font-bold uppercase">{description.headline}</div>
					<p>{description.description}</p>
				</div>
			{/each}
		</div>
		<a href="/"
			><button class="btn variant-filled-primary font-bold" on:click={modalComponentSignIn}
				>Create Empty Basket</button
			></a
		>
	</div>
</div>
