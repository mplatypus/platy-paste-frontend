<script lang="ts">
    import type { Paste } from "$lib/models/paste"
    import type { Document } from "$lib/models/document"
    import { codeToHtml } from "shiki"
    import HeaderDiv from "$lib/components/header.svelte"
    import {
        DEFAULT_SHIKI,
        DEFAULT_TYPE,
        extractNameFromDocument,
        extractTypeFromDocument,
    } from "$lib/types"
    export let data: { paste: Paste }

    async function convertContent(document: Document): Promise<string> {
        return await codeToHtml(document.content, {
            lang: extractTypeFromDocument(document)?.shiki || DEFAULT_SHIKI,
            theme: "dracula",
            transformers: [
                {
                    pre(node) {
                        node.properties.class =
                            (node.properties.class || "") + "shiki-pre"
                        const existing = node.properties.style || ""
                        node.properties.style =
                            `${existing}; background-color: var(--color-content-primary); color: white;`.trim()
                    },
                    line(hast, _) {
                        const existing = hast.properties.style || ""
                        hast.properties.style =
                            `${existing}; font-family: var(--code-font); font-size: var(--code-size);`.trim()
                    },
                },
            ],
        })
    }
</script>

<svelte:head>
    <title>Paste: {data.paste.id}</title>
    <meta property="og:title" content="Paste: {data.paste.id}" />
    <meta
        property="og:description"
        content="This paste contains {data.paste.documents
            .length} document(s){data.paste.edited
            ? '\n\nThis paste has been modified.'
            : ''}"
    />
    <meta property="og:site_name" content="Platy Paste" />
    <meta property="og:image" content="/logo.png" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:alt" content="Platy Paste logo" />
    <meta name="theme-color" content="#1D7C8C" />
</svelte:head>

<HeaderDiv>
    <h1>
        Paste ID: <span style="user-select: all;">{String(data.paste.id)}</span>
    </h1>
</HeaderDiv>

<div id="documents">
    {#each data.paste.documents as document}
        <div id={document.id} class="document">
            <div class="document-header">
                <div class="document-information">
                    <p class="document-information-name">{document.name}</p>
                    <p class="document-information-type">
                        {extractNameFromDocument(document) || DEFAULT_TYPE}
                    </p>
                    <p class="document-information-id">{document.id}</p>
                </div>
                <button
                    class="document-copy"
                    onclick={(event: MouseEvent) => {
                        const button = event.currentTarget as HTMLButtonElement
                        navigator.clipboard
                            .writeText(document.content)
                            .then(() => {
                                button.classList.add("copied")
                                setTimeout(
                                    () => button.classList.remove("copied"),
                                    500,
                                )
                            })
                    }}>copy</button
                >
            </div>
            <div class="document-content">
                {#await convertContent(document) then val}
                    {@html val}
                {/await}
            </div>
        </div>
    {/each}
</div>

<style lang="postcss">
    @reference "tailwindcss";

    :global(html) {
        background-color: var(--color-background);
        overflow-x: hidden;
    }

    :global(h1, h2, h3, p, a) {
        font-family: var(--main-font);
        color: var(--color-text);
    }

    #documents {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 1.5rem;
        gap: 2.5rem;
        margin-bottom: 5rem;
    }

    .document {
        width: 95%;
        background-color: var(--color-header-primary);
        border-radius: var(--radius-xl);
        scroll-margin-top: 80px;
    }

    .document-header {
        height: 3rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.5rem;
    }

    .document-information {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1rem;
    }

    .document-information-name,
    .document-information-id {
        font-size: var(--text-lg);
        font-weight: 500;
        user-select: all;
    }

    .document-information-type {
        padding: 0.125rem 0.5rem;
        border-radius: var(--radius-sm);
        background-color: var(--color-content-primary);
    }

    .document-copy {
        border-radius: var(--radius-md);
        background-color: var(--color-button-primary);
        color: var(--color-text);
        height: 2rem;
        margin: 0 0.5rem;
        padding: 0 0.5rem;
        transition: background-color 0.25s ease-out;
    }

    :global(.document-copy.copied) {
        background-color: var(--color-button-secondary);
    }

    .document-information > p {
        font-family: quicksand, sans-serif;
        color: var(--color-text);
    }

    .document-content {
        background-color: var(--color-content-primary);
        height: max-content;
        padding: 0.25rem;
        overflow-x: auto;
        overflow-y: hidden;
        border-radius: 0 0 var(--radius-xl) var(--radius-xl);
    }

    :global(.shiki-pre:focus) {
        outline: none;
    }

    @layer utilities {
        .document-content::-webkit-scrollbar {
            height: 20px;
        }

        .document-content::-webkit-scrollbar-track {
            border-radius: var(--radius-xl);
        }

        .document-content::-webkit-scrollbar-thumb {
            background: var(--color-button-secondary);
            border-radius: var(--radius-xl);
        }

        .document-content::-webkit-scrollbar-thumb:hover {
            background: var(--color-button-primary);
        }
    }
</style>
