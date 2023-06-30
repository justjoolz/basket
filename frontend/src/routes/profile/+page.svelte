<script lang="ts">
	import { AppRail, AppRailTile } from "@skeletonlabs/skeleton";
    import favicon from '$lib/assets/favicon.png';

    const vaults = [
		{
			id: 1,
			nfts: [
                {
                    id: 1,
                    name: "NFT 1",
                    description: "This is an NFT",
                    image: favicon
                },
                {
                    id: 2,
                    name: "NFT 2",
                    description: "This is a 2nd NFT",
                    image: favicon
                },
                {
                    id: 3,
                    name: "NFT 3",
                    description: "This is a 3rd NFT",
                    image: favicon
                }
            ],
            fts: [
                {
                    id: 1,
                    name: "FUSD",
                    qty: 500
                },
                {
                    id: 2,
                    name: "USDC",
                    qty: 50
                },
                {
                    id: 3,
                    name: "FLOW",
                    qty: 100
                }
            ]
            
		},
		{
			id: 2,
			nfts: [
                {
                    id: 1,
                    name: "NFT 4",
                    description: "This is an NFT",
                    image: favicon
                },
                {
                    id: 2,
                    name: "NFT 5",
                    description: "This is a 2nd NFT",
                    image: favicon
                }
            ],
            fts: [
                {
                    id: 1,
                    name: "FUSD",
                    qty: 300
                }
            ]
            
		},
		{
			id: 3,
			nfts: [],
            fts: [
                {
                    id: 1,
                    name: "FUSD",
                    qty: 5000
                },
                {
                    id: 3,
                    name: "FLOW",
                    qty: 1000
                }
            ]
            
		},
	];
    let currentTile: number = 1;
    $: currentVault = vaults[currentTile - 1];
</script>

<div class="container flex flex-col justify-center items-center">
    <div class="flex flex-col justify-center items-center space-y-4 w-full">
		<div class="pb-8 w-full">
			<h1 class="text-6xl leading-none font-bold text-center pb-2">My Profile</h1>			
		</div>
        <div class="flex w-full border">
            <AppRail border='border-r-2' height="full" width="w-32" background="bg-tertiary-100-800-token" active="bg-secondary-active-token">  
                {#each vaults as vault}              
                <AppRailTile bind:group={currentTile} name={`Basket ${vault.id}`} value={vault.id} title={`Basket ${vault.id}`}>
                    <svelte:fragment slot="lead">(icon)</svelte:fragment>
                    <span>{`Basket ${vault.id}`}</span>
                </AppRailTile>   
			{/each}

            </AppRail>
            <div class="flex flex-col items-center min-h-[60vh] w-full p-6">
                <div class="w-full h-full">
                    <h4 class="h3 font-bold pb-6">Basket {currentTile}</h4> 
                    <div class="flex w-full h-full pb-14">
                        <div class="flex flex-col p-4 gap-y-4 border w-1/2 h-full">
                            <h4 class="h4 font-bold">NFTs</h4> 
                            {#each currentVault.nfts as nft}
                                <div class="flex items-center justify-between border p-4 px-20">
                                    <div class="flex gap-x-4 items-center">
                                        <img src={nft.image} alt={nft.name} class="block h-12 w-auto"/>
                                        <div class="flex flex-col items-center justify-center">
                                            <h4 class="h4 font-bold pb-2">{nft.name}</h4>
                                            <p>{nft.description}</p>
                                        </div>
                                    </div>
                                    <button class="btn variant-filled-primary font-bold ml-12" >Withdraw</button>
                                </div>
                            {/each}
                        </div>
                        <div class="flex flex-col p-4 gap-y-4 border w-1/2 h-full">
                            <h4 class="h4 font-bold">FTs</h4> 
                            {#each currentVault.fts as ft}
                            <div class="flex items-center justify-between border px-20 p-4">
                                <div class="flex items-center justify-center">
                                    <h4 class="h4 font-bold pr-3">{ft.name}</h4> 
                                    <p class="h4 font-bold pr-3">${ft.qty}</p>
                                </div>
                                <button class="btn variant-filled-primary font-bold ml-12" >Withdraw</button>
                            </div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        </div>			
		<div class="flex gap-x-4 items-center">
            <button class="btn variant-filled-primary font-bold" >Create Empty Basket</button>
            <button class="btn variant-filled-primary font-bold" >Deposit</button>
        </div>
	</div>
</div>

<!-- on:click={modalComponentImage} -->