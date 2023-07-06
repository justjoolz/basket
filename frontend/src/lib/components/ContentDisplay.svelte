<script lang="ts">
	import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';

	export let currentVault: any;
	function modalComponentWithdrawNft(id: string): void {
		const modal: ModalSettings = {
			type: 'component',
			title: `Withdraw NFT ${id}`,
			component: 'withdraw'
		};
		modalStore.trigger(modal);
	}
	function modalComponentWithdrawFt(name: string) {
		const modal: ModalSettings = {
			type: 'component',
			title: `Withdraw ${name}`,
			component: 'withdraw'
		};
		modalStore.trigger(modal);
	}
	console.log(currentVault, 'currentVault');
</script>

<div class="flex flex-col w-full h-full pb-14">
	<div class="flex flex-col p-4 gap-y-4 w-full">
		<h4 class="h4 font-bold">NFTs</h4>
		{#each currentVault as nft}
			<div class="flex items-center justify-between border p-4 px-20">
				<div class="flex gap-x-4 items-center">
					<img src={nft.thumbnail} alt={nft.name} class="block h-12 w-auto" />
					<div class="flex flex-col items-center justify-center">
						<h4 class="h4 font-bold pb-2">{nft.name}</h4>
						<p>{nft.description}</p>
					</div>
				</div>
				<button
					class="btn variant-filled-primary font-bold ml-12"
					on:click={() => modalComponentWithdrawNft(nft.id)}>Withdraw</button
				>
			</div>
		{/each}
	</div>
	<div class="flex flex-col p-4 gap-y-4 w-full">
		<h4 class="h4 font-bold">FTs</h4>
		<!-- {#each currentVault.fts as ft}
            <div class="flex items-center justify-between border px-20 p-4">
                <div class="flex items-center justify-center">
                    <h4 class="h4 font-bold pr-3">{ft.name}</h4>
                    <p class="h4 font-bold pr-3">${ft.qty}</p>
                </div>
                <button
                    class="btn variant-filled-primary font-bold ml-12"
                    on:click={() => modalComponentWithdrawFt(ft.name)}>Withdraw</button
                >
            </div>
        {/each} -->
	</div>
</div>
