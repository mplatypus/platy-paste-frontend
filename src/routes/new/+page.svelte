<script lang="ts">
    import { goto } from "$app/navigation"
    import HeaderDiv from "$lib/components/header.svelte"
    import autosize from "svelte-autosize"

    import { getAllTypes } from "$lib/types"

    import type { Document } from "$lib/models/document"
    import { uploadPaste } from "$lib/backend"
    import { PasteResponseError } from "$lib/errors"

    let documents: Document[] = []

    // This is run to add a default document to the page.
    newDocument()

    function newDocument() {
        const newId =
            documents.length > 0
                ? (
                      Math.max(...documents.map((d) => Number(d.id))) + 1
                  ).toString()
                : "1"

        documents = [
            ...documents,
            {
                id: newId,
                paste_id: "-1",
                type: "txt",
                name: "new.txt",
                content: "",
            },
        ]
    }

    function deleteDocument(docId: string) {
        documents = documents.filter((doc) => doc.id !== docId)
    }

    function validateDocuments(): boolean {
        return documents.every((doc) => doc.content.trim().length > 0)
    }

    let err
    let errorMessage = ""
    $: errorIsEmpty = !errorMessage.trim()

    async function submitPaste() {
        if (!validateDocuments()) return

        try {
            let paste = await uploadPaste(documents)

            goto(`/p/${paste.id}`)
        } catch (err) {
            let message = "Unknown Error"

            if (err instanceof Error) message = err.message

            if (err instanceof PasteResponseError) {
                if (err.trace) message = err.trace
                message = err.reason
            }
        }
    }
</script>

<svelte:head>
    <title>New Paste</title>
    <meta property="og:title" content="Platy Paste" />
    <meta property="og:description" content="Create a new paste!" />
</svelte:head>

<HeaderDiv content="New Paste"></HeaderDiv>

<div id="documents">
    <p
        id="upload-error-message"
        class:error-is-empty={errorIsEmpty}
        bind:this={err}
    ></p>
    {#each documents as doc (doc.id)}
        <div class="document">
            <div class="document-header">
                <div class="document-header-title">
                    <p id="document-header-title-name">Title:</p>
                    <input
                        id="document-header-title-name-input"
                        type="text"
                        defaultValue="new.txt"
                        max="50"
                        bind:value={doc.name}
                    />
                    <p id="document-header-title-type">Type:</p>
                    <select
                        id="document-header-title-type-input"
                        bind:value={doc.type}
                    >
                        {#each getAllTypes() as validType}
                            <option>{validType}</option>
                        {/each}
                    </select>
                </div>
                <div class="document-header-buttons">
                    <button
                        class="document-header-button-delete"
                        on:click={() => deleteDocument(doc.id)}
                        disabled={documents.length === 1}>delete</button
                    >
                </div>
            </div>
            <div class="document-content">
                <textarea use:autosize bind:value={doc.content}></textarea>
            </div>
        </div>
    {/each}
    <div id="buttons">
        <button on:click={newDocument}>add</button>
        <button on:click={submitPaste} disabled={!validateDocuments()}
            >save</button
        >
    </div>
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

    #upload-error-message {
        color: var(--color-red-400);
        font-family: quicksand, sans-serif;
        border-radius: var(--radius-md);
        padding: 0.25rem 0.5rem;
    }

    .error-is-empty {
        margin: 0;
        padding: 0;
        height: 0;
        width: 0;
        display: none;
        visibility: none;
    }

    .document {
        width: 95%;
        background-color: var(--color-gray-700);
        border-radius: var(--radius-md);
        border: 0.25rem solid var(--color-white);
        margin-bottom: 2.5%;
    }

    /* Document Header */
    .document-header {
        height: 2.5rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .document-header-title {
        background-color: var(--color-gray-700);
        border-radius: var(--radius-md);
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .document-header-title > * {
        margin-right: 1rem;
    }

    .document-header-title > p {
        color: var(--color-white);
    }

    #document-header-title-name-input,
    #document-header-title-type-input {
        color: var(--color-white);
        border: none;
        border-radius: var(--radius-md);
        background-color: var(--color-gray-500);
        align-items: center;
        height: 95%;
    }

    #document-header-title-name-input:focus {
        outline: none;
    }

    .document-header-button-delete {
        border-radius: var(--radius-md);

        color: white;
        height: 2rem;
        margin: 0 0.5rem;
        padding: 0 0.5rem;
    }

    .document-header-button-delete:disabled {
        background-color: var(--color-red-400);
    }

    /* Document content */
    .document-content {
        background-color: var(--color-black);
        height: max-content;
    }

    .document-content > textarea {
        border-radius: var(--radius-md);
        color: white;
        width: 100%;
        min-height: 3em;
        resize: none;
        overflow-y: hidden;
        padding: 0.5rem;
        box-sizing: border-box;
        line-height: 1.5em;
    }

    .document-content > textarea:focus {
        outline: none;
    }

    /* Buttons */

    #buttons > button {
        border-radius: var(--radius-md);
        background-color: var(--color-red-600);
        color: white;
        height: 2rem;
        margin: 0 0.5rem;
        padding: 0 0.5rem;
    }

    #buttons > button:disabled {
        background-color: var(--color-red-400);
    }
</style>
