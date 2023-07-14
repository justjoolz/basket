<script lang="ts">
	import { basketTxs } from '$lib/flow/actions.client';
	import {
		walletNFTWithdrawIds,
		walletFTWithdrawIds,
		basketNFTWithdrawIds,
		basketFTWithdrawIds,
		ftTokens,
		selectedBasketMeta
	} from '$lib/flow/stores.client';
	import { type ModalSettings, modalStore } from '@skeletonlabs/skeleton';
	import { get } from 'svelte/store';

	export let nft: any = {};
	export let ft: any = {};
	export let type: 'nft' | 'ft';
	export let location: string;

	let _walletNFTWithdrawIds = get(walletNFTWithdrawIds);
	let _walletFTWithdrawIds = get(walletFTWithdrawIds);
	let _basketNFTWithdrawIds = get(basketNFTWithdrawIds);
	let _basketFTWithdrawIds = get(basketFTWithdrawIds);

	const isWallet = location === 'Wallet';
	const isNFT = type === 'nft';

	function modalComponentWithdrawNft(nft: NFTCatalogEntry): void {
		const modal: ModalSettings = {
			type: 'component',
			title: `Withdraw NFT ${nft.id} ${nft.name} ${nft.collectionName}`,
			meta: nft,
			component: 'withdrawNFT'
		};
		modalStore.trigger(modal);
	}
	function modalComponentWithdrawFt(ft: FTCatalogEntry) {
		const modal: ModalSettings = {
			type: 'component',
			title: `Withdraw ${ft.token}`,
			meta: ft,
			component: 'withdrawFT'
		};
		modalStore.trigger(modal);
	}

	function handleClick(id: number) {
		if (type === 'nft') {
			console.log('send data to modal, then fire tx', { type, nft, location });
			addOrRemoveId(id);
		} else {
			console.log('send data to modal, then fire tx', { type, ft, location });
			if (location === 'Basket') withdrawFT(id, ft);
			else addOrRemoveFT(id, ft);
		}
	}

	function withdrawFT(id: number, ft: FTCatalogEntry) {
		const storagePath = $ftTokens.find((token) => token.symbol === ft.token)?.path.vault;
		console.log(storagePath, $ftTokens, ft.token);
		if (!storagePath) throw new Error('No storage path found for FT');
		// .storagePath;
		const selectedBasketId = 0;
		const amount = 0.00001;
		basketTxs.withdrawFT(selectedBasketId.toString(), storagePath, amount.toString());
	}

	function addOrRemoveFT(id: number, ft: FTCatalogEntry) {
		console.log('to do add or remove amount of ft');
	}

	let nftArray: number[] = [];
	let ftArray: FTCatalogEntry[] = [];

	let isSelected: boolean = isNFT ? nftArray.includes(nft.id) : ftArray.includes(ft);

	function addOrRemoveId(id: number) {
		isSelected = !isSelected;
		if (!isSelected) {
			walletNFTWithdrawIds.update((ids) => ids.filter((i) => i !== id));
		}
		if (isWallet) {
			if (isNFT) {
				nftArray = _walletNFTWithdrawIds;
			} else {
				ftArray = _walletFTWithdrawIds;
			}
		} else {
			if (isNFT) {
				nftArray = _basketNFTWithdrawIds;
			} else {
				ftArray = _basketFTWithdrawIds;
			}
		}
	}

	function addOrRemoveNFTId(id: number) {
		isSelected = !isSelected;
		modalComponentWithdrawNft(nft);
		if (!isSelected && isWallet) {
			walletNFTWithdrawIds.update((ids) => ids.filter((i) => i !== id));
		} else if (isSelected && isWallet) {
			walletNFTWithdrawIds.update((ids) => [...ids, id]);
		} else if (!isSelected && !isWallet) {
			basketNFTWithdrawIds.update((ids) => ids.filter((i) => i !== id));
		} else if (isSelected && !isWallet) {
			basketNFTWithdrawIds.update((ids) => [...ids, id]);
		}
	}
	function addOrRemoveFTToken(token: FTCatalogEntry) {
		isSelected = !isSelected;
		modalComponentWithdrawFt(ft);
		if (!isSelected && isWallet) {
			walletFTWithdrawIds.update((tokens) => tokens.filter((t) => t !== token));
		} else if (isSelected && isWallet) {
			walletFTWithdrawIds.update((tokens) => [...tokens, token]);
		} else if (!isSelected && !isWallet) {
			basketFTWithdrawIds.update((tokens) => tokens.filter((t) => t !== token));
		} else if (isSelected && !isWallet) {
			basketFTWithdrawIds.update((tokens) => [...tokens, token]);
		}
	}

	function handleClick() {
		if (!$selectedBasketMeta.id) {
			alert('Please select a basket first');
			return;
		}
		if (isNFT) {
			addOrRemoveNFTId(nft.id);
		} else {
			addOrRemoveFTToken(ft);
		}
	}

	function convertUrl(url: string) {
		if (url.startsWith('ipfs://')) {
			const ipfsGateway = 'https://ipfs.io';
			return `${ipfsGateway}/ipfs/${url.slice(7)}`;
		}
		return url;
	}
</script>

<button
	class={`flex flex-col items-center justify-start bg-tertiary-900 rounded-md hoverShadow p-4 `}
	on:click={handleClick}

>
	<div class="flex flex-col h-full justify-between">
		<div class="flex flex-col items-center w-full">
			{#if type === 'nft'}
				<img src={convertUrl(nft.thumbnail)} alt={nft.name} class="h-12" />
				<p class="text-sm pt-3 text-center">{nft.name}</p>
			{:else if type === 'ft'}
				<h4>{ft.token}</h4>
				<p class="text-sm pt-3 text-center">{ft.balance}</p>
			{/if}
		</div>
		<!-- <button class="font-bold">Deposit</button> -->
	</div>
</button>
