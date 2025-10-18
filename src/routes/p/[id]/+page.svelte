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
    import { onMount } from "svelte"
    export let data: { paste: Paste; contents: Record<string, string> }

    let documentData = data.paste.documents.map((doc) => ({
        ...doc,
        isCollapsed: false,
    }))

    let htmlContents: Record<string, string> = {}

    async function convertContent(
        document: Document,
        content: string,
    ): Promise<string> {
        return await codeToHtml(content, {
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

    onMount(async () => {
        for (const doc of documentData) {
            htmlContents[doc.id] = await convertContent(
                doc,
                data.contents[doc.id],
            )
        }
    })

    function formatTimestamp(timestamp: Date): String {
        const local = new Date(timestamp)

        const day = local.getDate()
        const month = local.toLocaleString(undefined, { month: "long" })
        const year = local.getFullYear()

        const hours = local.getHours().toString().padStart(2, "0")
        const minutes = local.getMinutes().toString().padStart(2, "0")
        const seconds = local.getSeconds().toString().padStart(2, "0")

        const suffix =
            day % 10 === 1 && day !== 11
                ? "st"
                : day % 10 === 2 && day !== 12
                  ? "nd"
                  : day % 10 === 3 && day !== 13
                    ? "rd"
                    : "th"

        return `${day}${suffix} of ${month} ${year} at ${hours}:${minutes}:${seconds}`
    }

    function toggleCollapse(id: string) {
        documentData = documentData.map((doc) =>
            doc.id === id ? { ...doc, isCollapsed: !doc.isCollapsed } : doc,
        )
    }
</script>

<svelte:head>
    <title>Paste: {data.paste.id}</title>
    <meta property="og:title" content="Paste: {data.paste.id}" />
    <meta
        property="og:description"
        content="This paste contains {data.paste.documents
            .length} document(s){data.paste.edited_timestamp
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
    <div id="timestamps">
        <p class="timestamp">
            Created • {formatTimestamp(data.paste.timestamp)}
        </p>
        <span id="timestamps-extra">
            {#if data.paste.expiry_timestamp != null}
                <p class="timestamp">
                    Expiry • {formatTimestamp(data.paste.expiry_timestamp)}
                </p>
            {:else}
                <p class="timestamp">No Expiry</p>
            {/if}
            {#if data.paste.edited_timestamp != null}
                <p class="timestamp">
                    Last Edited • {formatTimestamp(data.paste.edited_timestamp)}
                </p>
            {/if}
        </span>
    </div>
</HeaderDiv>

<div id="documents">
    {#each documentData as document (document.id)}
        <div id={document.id} class="document">
            <div class="document-header">
                <div class="document-information">
                    <p class="document-information-name">{document.name}</p>
                    <p class="document-information-type">
                        {extractNameFromDocument(document) || DEFAULT_TYPE}
                    </p>
                    <p class="document-information-id">{document.id}</p>
                </div>
                <div class="document-header-buttons">
                    <button
                        class="document-header-button-collapse"
                        on:click={() => toggleCollapse(document.id)}
                        type="button"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="30"
                            width="30"
                            viewBox="0 0 448 512"
                            ><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path
                                fill="currentColor"
                                d="M0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32z"
                            /></svg
                        >
                    </button>
                    <button
                        class="document-header-button-copy"
                        on:click={(event: MouseEvent) => {
                            const button =
                                event.currentTarget as HTMLButtonElement
                            navigator.clipboard
                                .writeText(data.contents[document.id])
                                .then(() => {
                                    button.classList.add("copied")
                                    setTimeout(
                                        () => button.classList.remove("copied"),
                                        500,
                                    )
                                })
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            width="24"
                            viewBox="0 0 512 512"
                            ><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path
                                fill="currentColor"
                                d="M288 448l-224 0 0-224 48 0 0-64-48 0c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l224 0c35.3 0 64-28.7 64-64l0-48-64 0 0 48zm-64-96l224 0c35.3 0 64-28.7 64-64l0-224c0-35.3-28.7-64-64-64L224 0c-35.3 0-64 28.7-64 64l0 224c0 35.3 28.7 64 64 64z"
                            /></svg
                        >
                    </button>
                </div>
            </div>
            <div
                class="document-content {document.isCollapsed
                    ? 'collapsed'
                    : ''}"
            >
                {@html htmlContents[document.id]}
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

    #timestamps {
        position: relative;
        margin-left: 1rem;
        display: inline-block;
    }

    #timestamps #timestamps-extra {
        visibility: hidden;
        width: 500px;
        text-align: center;
        padding: 5px 0;
        border-radius: 6px;

        position: absolute;
        z-index: 1;

        width: 330px;
        top: 125%;
        left: 50%;
        transform: translateX(-165px);
    }

    #timestamps-extra {
        position: relative;
        display: inline-block;
        background-color: var(--color-background-header);
    }

    #timestamps:hover #timestamps-extra {
        visibility: visible;
    }

    .timestamp {
        font-weight: 600;
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

    .document-header-buttons {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .document-header-buttons > button {
        color: var(--color-text);
        border-radius: var(--radius-md);
        height: 2rem;
        margin: 0 0.5rem;
    }

    .document-header-buttons > button > svg {
        display: block;
    }

    .document-header-button-collapse {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 0;
    }

    .document-header-button-collapse > svg {
        color: var(--color-button-primary);
    }

    .document-header-button-copy {
        color: var(--color-text);
        transition: background-color 0.25s ease-out;
    }

    .document-header-button-copy > svg {
        color: var(--color-button-primary);
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

    .document-content.collapsed {
        height: 0 !important;
        padding: 0;
        font-size: 0;
    }

    :global(.shiki-pre:focus) {
        outline: none;
    }

    @layer utilities {
        .document-content::-webkit-scrollbar {
            height: 1rem;
            width: 1rem;
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
