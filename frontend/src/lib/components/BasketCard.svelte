<script lang="ts">
	import {
		walletNFTWithdrawIds,
		walletFTWithdrawIds,
		basketNFTWithdrawIds,
		basketFTWithdrawIds
	} from '$lib/flow/stores.client';
	import { get } from 'svelte/store';

	export let basketId: number;
</script>

<button
	class="flex flex-col items-center justify-center bg-tertiary-900 rounded-md hoverShadow p-2 w-full relative"
>
	<div class="grid grid-cols-3 gap-2 pb-2 justify-between w-full">
		<div class="w-full aspect-square bg-teal-200" />
		<div class="w-full aspect-square bg-purple-700" />
		<div class="w-full aspect-square bg-slate-700" />
	</div>
	<div class="grid grid-cols-2 gap-2 justify-between w-full">
		<div class="w-full aspect-square bg-emerald-900" />
		<div class="w-full aspect-square bg-pink-600" />
	</div>
	<div
		class="flex flex-col w-full rounded-b-md border-[rgba(0,0,0,0.1)] border-2 bg-[rgba(39,39,39,0.1)] shadow-[0_-4px_8px_-4px_rgba(0,0,0,0.5)] backdrop-blur-2xl py-5 justify-between absolute bottom-0"
	>
		<div class="flex flex-col items-center w-full">
			<p class="font-bold text-primary-500 text-center uppercase tracking-wide">
				Basket {basketId}
			</p>
		</div>
	</div>
</button>
