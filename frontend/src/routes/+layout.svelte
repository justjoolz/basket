<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '../theme.postcss';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
	import {
		AppBar,
		AppShell,
		Avatar,
		Drawer,
		Toast,
		drawerStore,
		toastStore,
		type ToastSettings,
		Modal,
		type ModalComponent
	} from '@skeletonlabs/skeleton';
	import Navigation from '$lib/components/Navigation.svelte';
	import CardModal from '$lib/components/Modals/CardModal.svelte';
	import SignInModal from '$lib/components/Modals/SignInModal.svelte';
	import WithdrawModal from '$lib/components/Modals/WithdrawModal.svelte';
	// import WithdrawFTModal from '$lib/components/Modals/WithdrawFTModal.svelte';
	import WithdrawNFTModal from '$lib/components/Modals/WithdrawNFTModal.svelte';
	import CreateBasketModal from '$lib/components/Modals/CreateBasketModal.svelte';
	import DepositModal from '$lib/components/Modals/DepositModal.svelte';
	import DepositFTModal from '$lib/components/Modals/DepositFTModal.svelte';
	import DepositNFTModal from '$lib/components/Modals/DepositNFTModal.svelte';
	import { handleUserChange, logIn, unauthenticate } from '$lib/flow/actions.client';
	import { transactionStatus, user } from '$lib/flow/stores.client';
	import WithdrawFtModal from '$lib/components/Modals/WithdrawFTModal.svelte';
	import { onMount } from 'svelte';
	import { setupFCL } from '$lib/flow/config.client';
	import * as fcl from '@onflow/fcl';
	import type { CurrentUser } from '@onflow/typedefs';
	import { onDestroy } from 'svelte';

	function drawerOpen() {
		drawerStore.open();
	}

	const modalComponentRegistry: Record<string, ModalComponent> = {
		card: {
			ref: CardModal
		},
		signIn: {
			ref: SignInModal
		},
		createBasket: {
			ref: CreateBasketModal
		},
		withdraw: {
			ref: WithdrawModal
		},
		withdrawNFT: {
			ref: WithdrawNFTModal
		},
		withdrawFT: {
			ref: WithdrawFtModal
		},
		depositFT: {
			ref: DepositFTModal
		},
		depositNFT: {
			ref: DepositNFTModal
		}
	};

	let txUnsub: Function;
	let userUnsub: Function;

	onMount(() => {
		setupFCL();
		fcl.currentUser.subscribe((data: CurrentUser) => user.set(data));
		userUnsub = user.subscribe(handleUserChange);
		txUnsub = transactionStatus.subscribe((value) => {
			console.log('transactionStatus changed', { value });
		});
	});

	onDestroy(() => {
		if (userUnsub) userUnsub();
		if (txUnsub) txUnsub();
	});
</script>

<Toast position="br" />
<Modal width="w-full" components={modalComponentRegistry} />
<Drawer position="right">
	<Navigation />
</Drawer>

<AppShell>
	<svelte:fragment slot="header"
		><AppBar padding="px-12 py-4 nav-shadow !bg-surface-900">
			<svelte:fragment slot="lead">
				<a href="/" class="flex items-start justify-start"
					><strong class="text-4xl !leading-8">Basket</strong></a
				></svelte:fragment
			>
			<!-- Slot: default -->
			<svelte:fragment slot="trail">
				<button class="md:hidden btn btn-sm" on:click={drawerOpen}>
					<span>
						<svg viewBox="0 0 100 100" class="fill-token w-4 h-4">
							<rect width="100" height="20" />
							<rect y="40" width="100" height="20" />
							<rect y="80" width="100" height="20" />
						</svg>
					</span>
				</button>
				{#if $user.loggedIn}
					<a href="/profile">
						<button class="hidden md:block btn text-lg hover:variant-ringed-primary"
							>{$user.addr}</button
						></a
					><button
						class="hidden md:block text-lg btn hover:variant-ringed-primary"
						on:click={unauthenticate}>Log Out</button
					>
				{:else}
					<button class="hidden md:block btn text-lg hover:variant-ringed-primary" on:click={logIn}
						>Log In
					</button>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- (sidebarLeft) -->
	<!-- (sidebarRight) -->
	<!-- (pageHeader) -->
	<!-- Router Slot -->
	<div class="w-full">
		<slot />
	</div>
	<!-- ---- / ---- -->
	<!-- (pageFooter) -->
</AppShell>
