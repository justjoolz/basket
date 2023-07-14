<script lang="ts">
	export let walletNFTWithdrawIds: number[];
	export let walletFTWithdrawIds: FTCatalogEntry[];
</script>

<div class="flex w-2/5 items-center justify-evenly">
	<div class="flexColumnCenter w-1/2 min-h-[48px]">
		{#if walletNFTWithdrawIds.length > 0}
			<p>NFT Ids Selected:</p>
			<div class="flexRowCenter w-full items-center flex-wrap">
				{#each walletNFTWithdrawIds as nftId}
					<p class="px-1">{nftId}{walletNFTWithdrawIds.length > 1 ? ',' : ''}</p>
				{/each}
			</div>
		{/if}
	</div>
	<div class="flexColumnCenter w-1/2 min-h-[48px]">
		{#if walletFTWithdrawIds.length > 0}
			<p>FTs Selected:</p>
			<div class="flexRowCenter w-full items-center flex-wrap gap-x-2">
				{#each walletFTWithdrawIds as ftId}
					<div class="flexRowCenter gap-x-2">
						<p>{ftId.token}</p>
						<p>QTY: {ftId.balance}</p>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
