<script>
    import { logIn, unauthenticate } from '$lib/flow/actions.client';
    import { user } from '$lib/flow/stores.client';
    import { drawerStore, toastStore } from '@skeletonlabs/skeleton';
    function drawerClose() {
        drawerStore.close();
    }

    function drawerOpen() {
        drawerStore.open();
    }
</script>

<div class="flex flex-col items-end py-6 px-2 relative">
    <div class="flex pl-8 absolute left-0">
        <button
            type="button"
            on:click={drawerClose}
            class="btn-icon variant-filled font-bold font-b9 text-lg text-primary-500"
            ><span class="pt-[2px]">X</span></button
        >
    </div>
    {#if $user.loggedIn}
        <button class="btn text-lg">{$user.addr}</button>
        <a href="/profile" on:click={drawerClose}>
            <button class=" btn text-lg hover:variant-ringed-primary">Profile</button>
        </a>
        <button class=" text-lg btn hover:variant-ringed-primary" on:click={unauthenticate}
            >Log Out
        </button>
    {:else}
        <button class="btn text-lg hover:variant-ringed-primary" on:click={logIn}>Log In</button>
    {/if}
</div>
