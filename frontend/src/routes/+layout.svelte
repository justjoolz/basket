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

	const t: ToastSettings = {
		message: 'menu opened'
	};

	function drawerOpen() {
		drawerStore.open();
		toastStore.trigger(t);
	}

	const modalComponentRegistry: Record<string, ModalComponent> = {
		// Custom Modal 1
		card: {
			ref: CardModal
		},
		signIn: {
			ref: SignInModal
		}
	};
</script>

<Toast position="br" />
<Modal components={modalComponentRegistry} />
<Drawer>
	<Navigation />
</Drawer>

<AppShell>
	<svelte:fragment slot="header"
		><AppBar padding="px-10 py-6">
			<svelte:fragment slot="lead">
				<a href="/"><strong class="text-4xl">Basket</strong></a></svelte:fragment
			>
			<!-- Slot: default -->
			<div class=""><Navigation/></div>
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
				<a href="/profile">
					<Avatar
						initials="JD"
						background="bg-primary-500"
						width="w-10"
						class="hidden md:block"
					/>
				</a></svelte:fragment
			>
		</AppBar>
	</svelte:fragment>
	<!-- (sidebarLeft) -->
	<!-- (sidebarRight) -->
	<!-- (pageHeader) -->
	<!-- Router Slot -->
	<div class="container p-10 mx-auto">
		<slot />
	</div>
	<!-- ---- / ---- -->
	<!-- (pageFooter) -->
</AppShell>
