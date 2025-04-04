<script lang="ts">
    import type { Paste } from "$lib/models/paste"
    import { codeToHtml } from "shiki"
    import HeaderDiv from "$lib/components/header.svelte"
    import {
        DEFAULT_SHIKI,
        DEFAULT_TYPE,
        mimeToShiki,
        mimeToType,
    } from "$lib/types"
    export let data: { paste: Paste }
</script>

<svelte:head>
    <title>Paste: {data.paste.id}</title>
    <meta property="og:title" content="Platy Paste" />
    <meta
        property="og:description"
        content="A new paste with {data.paste.documents.length} document(s)"
    />
</svelte:head>

<HeaderDiv content="Paste ID: {String(data.paste.id)}"></HeaderDiv>

<div id="documents">
    {#each data.paste.documents as document}
        <div class="document">
            <div class="document-information">
                <p class="document-information-name">{document.name}</p>
                <p class="document-information-type">
                    {mimeToType(document.type) || DEFAULT_TYPE}
                </p>
            </div>
            <div class="document-content">
                {#await codeToHtml( document.content, { lang: mimeToShiki(document.type) || DEFAULT_SHIKI, theme: "dracula" }, ) then val}
                    {@html val}
                {/await}
            </div>
        </div>
    {/each}
</div>

<style lang="postcss">
    @reference "tailwindcss";

    :global(html) {
        background-color: theme(--color-black);
        overflow-x: hidden;
    }

    #documents {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .document {
        width: 95%;
        background-color: var(--color-gray-700);
        border-radius: var(--radius-md);
        border: 0.25rem solid var(--color-white);
        margin-bottom: 2.5%;
    }

    .document-information {
        padding: 0.5rem;
        background-color: var(--color-gray-700);
        border-radius: var(--radius-md);
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .document-information-name {
        color: var(--color-gray-300);
    }

    .document-information-type {
        margin-left: 1rem;
        padding: 0.125rem 0.5rem;

        border-radius: var(--radius-sm);
        background-color: var(--color-gray-500);
    }

    .document-information > p {
        font-family: quicksand, sans-serif;
        color: var(--color-white);
    }

    .document-content {
        padding: 0 0.25rem;
        overflow: auto;
        background-color: var(--color-black);
        border-radius: var(--radius-sm);
    }

    @layer utilities {
        .document-content::-webkit-scrollbar {
            height: 20px;
        }

        .document-content::-webkit-scrollbar-track {
            border-radius: var(--radius-md);
            background: var(--color-black);
            border: 3px solid var(--color-white);
        }

        .document-content::-webkit-scrollbar-thumb {
            background: var(--color-white);
            border-radius: var(--radius-md);
        }

        .document-content::-webkit-scrollbar-thumb:hover {
            background: var(--color-gray-400);
        }
    }
</style>
