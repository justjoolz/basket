<script>
	import { logIn } from '$lib/flow/actions';
</script>

<div class="h-full mx-auto flex justify-start items-center hero-back">
	<div class="flexColumnCenter w-1/2 pl-28 pr-10">
		<div class="flex flex-col justify-center items-center pb-12 w-full">
			<div class="text-[72px] leading-[72px] font-b9">Manage and Organise</div>
			<div class="flex w-full items-start justify-center mt-[76px] pr-6">
				<div class="-rotate-90 text-[68px] leading-[68px] pl-8 -mr-6">your</div>
				<div class="text-[110px] leading-[110px] hero-text-outline mr-10">NFTs</div>
				<div class="text-[72px] leading-[72px] hero-text-outline pt-8">&</div>
			</div>
			<div class="text-[124px] leading-[124px] hero-text-outline mt-[58px] mb-12">Crypto</div>
			<div class="text-6xl">all in one place</div>
		</div>
		<a href="/"
			><button class="btn-7 custom-btn" on:click={logIn}><span>Get started now</span></button></a
		>
	</div>
</div>
