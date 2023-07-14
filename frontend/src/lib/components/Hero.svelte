<script>
	import { logIn } from '$lib/flow/actions.client';
	import { user } from '$lib/flow/stores.client';
	import { goto } from '$app/navigation';

	function getStarted() {
		if ($user.loggedIn) {		
			goto('/profile');
		} else {
			logIn().then(() => {
				goto('/profile');
			});
		}
	}
</script>

<div class="h-full mx-auto flex justify-start items-center hero-back relative">
	<div class="block sm:hidden w-full h-full absolute top-0 left-0 bg-[rgba(0,0,0,0.85)]" />
	<div class="flex flex-col items-center justify-center md:w-1/2 lg:pl-28 lg:pr-10 z-10">
		<div class="flex flex-col justify-center items-center pb-12 w-full px-5">
			<div class=" text-3xl xl:text-7xl font-b9">Manage and Organise</div>
			<div class="flex w-full items-start justify-center mt-8 lg:mt-12 xl:mt-[76px] pr-6">
				<div
					class="text-3xl lg:text-5xl -rotate-90 xl:text-[68px] xl:leading-[68px] pl-5 lg:pl-8 -mr-3 lg:-mr-6"
				>
					your
				</div>
				<div
					class="text-5xl lg:text-7xl xl:text-[110px] xl:leading-[110px] hero-text-outline mr-6 xl:mr-10"
				>
					NFTs
				</div>
				<div
					class="text-4xl lg:text-6xl xl:text-[72px] xl:leading-[72px] hero-text-outline pt-2 lg:pt-4 xl:pt-8"
				>
					&
				</div>
			</div>
			<div
				class="text-6xl lg:text-8xl xl:text-[124px] xl:leading-[124px] hero-text-outline mt-9 lg:mt-[58px] mb-5 lg:mb-12"
			>
				Crypto
			</div>
			<div class="text-2xl lg:text-5xl xl:text-6xl">all in one place</div>
		</div>
		<button class="btn-7 custom-btn" on:click={getStarted}><span>Get started now</span></button>
	</div>
</div>
