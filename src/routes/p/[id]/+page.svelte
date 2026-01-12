<script lang="ts">
    import type { Paste } from "$lib/models/paste"
    import type { Document } from "$lib/models/document"
    import { codeToHtml } from "shiki"
    import HeaderDiv from "$lib/components/header.svelte"
    import { DEFAULT_SHIKI, extractTypeFromDocument } from "$lib/types"
    import { onMount } from "svelte"
    import DocumentHeader from "$lib/components/document_header.svelte"

    export let data: { paste: Paste; contents: Record<string, string> }

    let documentData = data.paste.documents.map((doc) => ({
        ...doc,
        isCollapsed: false,
    }))

    let informationCollapsed = false

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
    <title>Paste</title>
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
    <h1 id="paste-id-title">Paste</h1>
</HeaderDiv>

<div id="documents">
    <div id="document-information">
        <div id="document-information-title">
            <h2>Information</h2>
            <button
                class="document-header-button-collapse"
                on:click={() => {
                    informationCollapsed = !informationCollapsed
                }}
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
        </div>
        <div
            id="document-information-items"
            class:collapsed={informationCollapsed}
        >
            <div class="document-information-item">
                <h3>ID</h3>
                <span></span>
                <p>{data.paste.id}</p>
            </div>
            <span class="document-information-separator"></span>
            <div class="document-information-item">
                <h3>Created</h3>
                <span></span>
                <p>{formatTimestamp(data.paste.timestamp)}</p>
            </div>
            <span class="document-information-separator"></span>
            <div class="document-information-item">
                <h3>Expiry</h3>
                <span></span>
                {#if data.paste.expiry_timestamp != null}
                    <p>{formatTimestamp(data.paste.timestamp)}</p>
                {:else}
                    <p>Never</p>
                {/if}
            </div>
            {#if data.paste.edited_timestamp != null}
                <span class="document-information-separator"></span>
                <div class="document-information-item">
                    <h3>Edited</h3>
                    <span></span>
                    <p>{formatTimestamp(data.paste.edited_timestamp)}</p>
                </div>
            {/if}
        </div>
    </div>
    {#each documentData as document (document.id)}
        <div id={document.id} class="document">
            <DocumentHeader
                {document}
                content={data.contents[document.id]}
                onCollapse={() => toggleCollapse(document.id)}
            />
            <div
                class="document-content"
                class:collapsed={document.isCollapsed}
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

    #document-information {
        width: 95%;
        background-color: var(--color-header-primary);
        border-radius: var(--radius-xl);
        scroll-margin-top: 80px;
        justify-items: center;
    }

    #document-information-title {
        height: 3rem;
        width: 100%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #document-information-title > h2 {
        font-size: var(--text-3xl);
        font-weight: bolder;
    }

    #document-information-title > button {
        position: absolute;
        right: 1rem;
    }

    #document-information-items {
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
        background-color: var(--color-content-primary);
        border-radius: 0 0 var(--radius-xl) var(--radius-xl);
    }

    span.document-information-separator {
        display: none;
    }

    @media (max-width: 450px) {
        span.document-information-separator {
            display: inline;
            height: 4px;
            width: 90%;
            border-radius: 0.5rem;
            border: var(--color-text);
            background-color: var(--color-text);
        }
    }

    div.document-information-item {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;
        align-content: center;
    }

    div.document-information-item > h3 {
        font-size: var(--text-xl);
        font-weight: 450;
    }

    div.document-information-item > span {
        height: 2px;
        width: 0.5rem;
        border-radius: 0.5rem;
        border: var(--color-text);
        background-color: var(--color-text);
    }

    @media (max-width: 450px) {
        div.document-information-item {
            flex-direction: column;
        }

        div.document-information-item > span {
            display: none;
        }
    }

    div.document-information-item > p {
        font-size: var(--text-lg);
        user-select: all;
    }

    @media (max-width: 450px) {
        #document-information-items {
            gap: 0.75rem;
        }

        div.document-information-item {
            flex-direction: column;
            gap: 0.25rem;
        }

        div.document-information-item > span {
            width: 5rem;
        }
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

    .document-header-button-collapse {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 0;
    }

    .document-header-button-collapse > svg {
        color: var(--color-button-primary);
    }

    :global(.document-copy.copied) {
        background-color: var(--color-button-secondary);
    }

    .document-content {
        background-color: var(--color-content-primary);
        height: max-content;
        padding: 0.25rem;
        overflow-x: auto;
        overflow-y: hidden;
        border-radius: 0 0 var(--radius-xl) var(--radius-xl);
    }

    div.collapsed {
        display: none !important;
        height: 0;
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
