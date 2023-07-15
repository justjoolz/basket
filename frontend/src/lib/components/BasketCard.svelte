<script lang="ts">
	import { onMount } from 'svelte';	
	import image1 from '$lib/assets/basket-image1.jpg';
	import image2 from '$lib/assets/basket-image2.jpg';
	import image3 from '$lib/assets/basket-image3.jpg';
	import image4 from '$lib/assets/basket-image4.jpg';
	import image5 from '$lib/assets/basket-image5.jpg';
	import image6 from '$lib/assets/basket-image6.jpg';
	import image7 from '$lib/assets/basket-image7.jpg';
	import image8 from '$lib/assets/basket-image8.jpg';
	import image9 from '$lib/assets/basket-image9.jpg';
	import image10 from '$lib/assets/basket-image10.jpg';
	
	export let basketId: number | string;
	let newBasketCard = basketId === '+';

	const allImages = [
		image1,
		image2,
		image3,
		image4,
		image5,
		image6,
		image7,
		image8,
		image9,
		image10
	];
	function getRandomImages() {
		const shuffledImages = allImages.sort(() => Math.random() - 0.5);
		const selectedSmallImages = shuffledImages.slice(0, 3);
		const selectedLargeImages = shuffledImages.slice(3, 5);
		return { selectedSmallImages, selectedLargeImages };
	}	

  
  let selectedSmallImages: any[] = [];
  let selectedLargeImages: any[] = [];

  onMount(() => {
	const { selectedSmallImages: smallImages, selectedLargeImages: largeImages } = getRandomImages();
	selectedSmallImages = smallImages;
	selectedLargeImages = largeImages;
    
  });
</script>

<button
	class="flex flex-col items-center justify-center bg-tertiary-900 rounded-md hoverShadow p-2 w-full relative"
>
	<div class="grid grid-cols-3 gap-2 pb-2 justify-between w-full">
		{#each selectedSmallImages as image }

		<img src={image} alt="Random nft example" />
		
		{/each}
	</div>
	<div class="grid grid-cols-2 gap-2 justify-between w-full">
		{#each selectedLargeImages as image }

		<img src={image} alt="Random nft example" />
		{/each}
	</div>
	<div
		class={`flex flex-col w-full rounded-b-md border-[rgba(0,0,0,0.1)] border-2 bg-[rgba(39,39,39,0.1)] shadow-[0_-4px_8px_-4px_rgba(0,0,0,0.5)] backdrop-blur-2xl py-5 absolute bottom-0 ${
			newBasketCard && 'h-full rounded-t-md justify-center'
		}`}
	>
		<div class="flex flex-col items-center w-full">
			<p class="font-bold text-primary-500 text-center uppercase tracking-wide">
				Basket {basketId}
			</p>
		</div>
	</div>
</button>
