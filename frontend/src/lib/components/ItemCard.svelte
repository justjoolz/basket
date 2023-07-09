<script lang="ts">
	export let nft: any = {};
	export let ft: any = {};
	export let type: 'nft' | 'ft';
</script>

<div class="flex flex-col items-center justify-between bg-tertiary-900 rounded-md p-4 hoverShadow">
	<div class="flex flex-col items-center w-full">
		{#if type === 'nft'}
			<img src={nft.thumbnail} alt={nft.name} class="h-12" />
			<p class="text-sm pt-3 pb-6 text-center">{nft.name}</p>
		{:else if type === 'ft'}
			<h4>{ft.token}</h4>
			<p>{ft.balance}</p>
		{/if}
	</div>
	<button class="font-bold">Deposit</button>
</div>
