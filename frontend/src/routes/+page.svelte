<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import infoImage from '$lib/assets/info-image.jpg';

	function modalComponentSignIn(): void {
		const modal: ModalSettings = {
			type: 'component',
			component: 'signIn'
		};
		modalStore.trigger(modal);
	}	
</script>

<Hero />
<div class="info-back p-32">
	<div class="flex w-full">
		<div class="flex flex-col w-3/5">
			<div class="text-6xl font-b9">What is</div>
			<div class="text-primary-500 text-[200px] leading-[180px] font-b9">Basket</div>
			<div class="text-3xl leading-10 w-4/5">
				<p class="pb-8">
					Basket is like an NFT MEGAvault. It gives you the ability to store all of your NFTs and
					Fungible tokens in one place.
				</p>
				<p>
					By creating smaller vaults you can easily organise all your NFTs and Fungible tokens in a
					way that makes it more manageable for you.
				</p>
			</div>
		</div>
		<div class="w-2/5 flexColumnCenter">
			<img src={infoImage} alt="" class="shadow-[0_2px_10px_-2.5px] shadow-primary-600 w-4/5" />
		</div>
	</div>
	<div class="flex flex-col w-full mt-32 pb-10">
		<div class="flex items-center gap-4 pb-4">
			<div class="h-2 w-32 bg-primary-500 mr" />
			<p class="font-b9 text-6xl">WHY IS IT COOL?</p>
		</div>
		<div class="text-3xl leading-10">
			<p class="w-3/4">
				As you collect more and more NFT and Fungible tokens, it becomes harder to manage them.
				Basket makes it easy to manage your NFTs and Fungible tokens.
			</p>
		</div>
	</div>
</div>
