<script lang="ts">
	export let nft: any = {};
	export let ft: any = {};
	export let type: 'nft' | 'ft';

	let isSelected: boolean = false;
    function updateSelected() {
        isSelected = !isSelected;
    }
</script>

<button
	class={`flex flex-col items-center justify-between bg-tertiary-900 rounded-md hoverShadow p-4 ${
		isSelected && 'selectionCard'
	}`}
    on:click={updateSelected}
>
	<span /><span /><span /><span />
	<div class="flex flex-col items-center w-full">
		{#if type === 'nft'}
			<img src={nft.thumbnail} alt={nft.name} class="h-12" />
			<p class="text-sm pt-3 pb-6 text-center">{nft.name}</p>
		{:else if type === 'ft'}
			<h4>{ft.token}</h4>
			<p class="text-sm pt-1 pb-6 text-center">{ft.balance}</p>
		{/if}
	</div>
	<button class="font-bold">Deposit</button>
</button>
