<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import infoImage from '$lib/assets/info-image.jpg';	
</script>

<Hero />
<div class="info-back p-8 sm:p-16 md:p-24 lg:p-32">
	<div class="flex flex-col-reverse justify-center items-center lg:flex-row w-full">
		<div class="flex flex-col w-full lg:w-3/5">
			<div class="text-2xl md:text-4xl xl:text-6xl font-b9">What is</div>
			<div class="text-primary-500 text-6xl md:text-9xl xl:text-[200px] xl:leading-[180px] font-b9">
				Basket
			</div>
			<div class="text-lg md:text-xl xl:text-3xl xl:leading-10 lg:w-4/5">
				<p class="pb-8">
					Basket is like an NFT MEGAvault. It gives you the ability to store your NFTs and Fungible
					tokens in one place.
				</p>
				<p>
					By creating smaller baskets you can easily organise your NFTs and Fungible tokens in a way
					that makes it more manageable for you.
				</p>
			</div>
		</div>
		<div class="w-full sm:w-3/5 lg:w-2/5 flex items-start justify-center pb-10 lg:pb-0">
			<img src={infoImage} alt="" class="shadow-[0_2px_10px_-2.5px] shadow-primary-600 xl:w-4/5" />
		</div>
	</div>
	<div class="flex flex-col w-full mt-10 sm:mt-20 md:mt-32 pb-10">
		<div class="flex items-center gap-4 pb-4">
			<div class="h-1 md:h-2 w-10 md:w-24 lg:w-32 bg-primary-500" />
			<p class="font-b9 text-2xl md:text-4xl xl:text-6xl">WHY IS IT COOL?</p>
		</div>
		<div class="text-lg md:text-xl xl:text-3xl xl:leading-10">
			<p class="lg:w-3/4">
				As you collect more and more NFTs and Fungible tokens, it becomes harder to manage them.
				Basket makes it easy. You can create a basket for each collection you own, or you can split
				them up even more. The choice is yours.
			</p>
		</div>
	</div>
</div>
