<script lang="ts">
    import { goto } from "$app/navigation"
    import { page } from "$app/state"
    import HeaderDiv from "$lib/components/header.svelte"
    import { PasteResponseError } from "$lib/errors"
    //import { PasteResponseError } from "$lib/errors"

    let error = page.error

    let status = page.status
    let message = "Unknown Error"
    let trace = null
    let time = null

    if (error == null) {
        goto("/")
    }

    if (error != null) {
        message = error.message
        trace = error.trace
        if (error.timestamp != null) {
            time = Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            }).format(Number(error.timestamp))
        }
    }
</script>

<svelte:head>
    <title>Error {status}</title>
</svelte:head>

<HeaderDiv content="Error {status}"></HeaderDiv>

<div id="error-div">
    <p id="error" class="error-information">{message}</p>
    {#if time != null}
        <p id="time-error" class="error-information">Occurred at - {time}</p>
    {/if}
    {#if trace != null}
        <p id="trace-error" class="error-information">{trace}</p>
    {/if}
    {#if error?.paste_id != null}
        <div id="paste-id-error-div">
            <p class="error-information">Related paste ID:</p>
            <p id="paste-id-error" class="error-information">
                {error?.paste_id}
            </p>
        </div>
    {/if}
</div>

<style lang="postcss">
    @reference "tailwindcss";

    :global(html) {
        overflow-x: hidden;
    }

    #error-div {
        height: 90vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
    }

    .error-information {
        font-family: quicksand, sans-serif;
        color: var(--color-white);
    }

    #error {
        font-size: large;
        font-weight: 700;
    }

    #paste-id-error-div {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
    }

    #paste-id-error {
        user-select: all;
    }
</style>
