<script lang="ts">
    import { goto } from "$app/navigation"
    import HeaderDiv from "$lib/components/header.svelte"
    import autosize from "svelte-autosize"

    import { DEFAULT_TYPE, extractNameFromName, getAllTypes } from "$lib/types"

    import { uploadPaste } from "$lib/backend"
    import { PasteResponseError } from "$lib/errors"
    import type { NewDocument } from "$lib/models/new"

    import linkSymbolLight from "$lib/assets/linkSymbolLight.svg"

    function generateDefaultExpiry(): string {
        var now = new Date()
        var utcString = now.toISOString().substring(0, 19)
        var year = now.getFullYear()
        var month = now.getMonth() + 1
        var day = now.getDate()
        var hour = now.getHours()
        var minute = now.getMinutes()
        var second = now.getSeconds()
        var localDatetime =
            year +
            "-" +
            (month < 10 ? "0" + month.toString() : month) +
            "-" +
            (day < 10 ? "0" + day.toString() : day) +
            "T" +
            (hour < 10 ? "0" + hour.toString() : hour) +
            ":" +
            (minute < 10 ? "0" + minute.toString() : minute) +
            utcString.substring(16, 19)

        return localDatetime
    }

    let enableExpiry: boolean = false
    let expiry: string = generateDefaultExpiry()
    let documents: NewDocument[] = []

    // This is run to add a default document to the page.
    newDocument()

    function newDocument() {
        const newId =
            documents.length > 0
                ? Math.max(...documents.map((d) => Number(d.id))) + 1
                : 1

        documents = [
            ...documents,
            {
                id: newId,
                overrideType: false,
                type: DEFAULT_TYPE,
                name: "new.txt",
                content: "",
            },
        ]
    }

    function updateDocumentType(document: NewDocument) {
        if (document.overrideType) {
            return
        }

        const newType = extractNameFromName(document.name)
        if (!newType) return

        documents = documents.map((d) =>
            d.id === document.id ? { ...d, type: newType } : d,
        )
    }

    function deleteDocument(docId: number) {
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

        let exp: number | undefined = undefined
        if (enableExpiry) {
            const localDate = new Date(expiry)

            exp = Math.floor(localDate.getTime() / 1000)
        }

        try {
            let paste = await uploadPaste(documents, { expiry: exp })

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

<p
    id="upload-error-message"
    class:error-is-empty={errorIsEmpty}
    bind:this={err}
></p>

<div id="paste">
    <div id="paste-settings">
        <h2 id="paste-settings-header">Paste Settings</h2>
        <div id="expiry-div" class="paste-setting">
            <h3 id="paste-setting-expiry-header" class="paste-setting-header">
                Expiry
            </h3>
            <div id="expiry-settings">
                <p>Enable Expiry</p>
                <input
                    id="paste-expiry-enable"
                    type="checkbox"
                    bind:checked={enableExpiry}
                />
                <p>Set Expiry</p>
                <input
                    id="paste-expiry"
                    type="datetime-local"
                    bind:value={expiry}
                />
            </div>
        </div>
    </div>

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
                        on:change={() => updateDocumentType(doc)}
                    />
                    <p id="document-header-title-type">Type:</p>
                    <select
                        id="document-header-title-type-input"
                        bind:value={doc.type}
                        on:change={() => {
                            doc.overrideType = true
                        }}
                    >
                        {#each getAllTypes() as validType}
                            <option>{validType}</option>
                        {/each}
                    </select>
                    <button
                        class="document-link-type"
                        on:click={() => {
                            doc.overrideType = false
                            updateDocumentType(doc)
                        }}
                    >
                        <img alt="Link type." src={linkSymbolLight} />
                    </button>
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

    :global(h1, h2, h3, p, input) {
        font-family: quicksand, sans-serif;
        color: var(--color-white);
    }

    :global(html) {
        background-color: theme(--color-black);
        overflow-x: hidden;
    }

    #upload-error-message {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
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

    #paste {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 2rem;
    }

    #paste-settings {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 95%;
        gap: 0.5rem;
        padding: 1rem 0;
        background-color: var(--color-gray-700);
        border-radius: var(--radius-md);
        border: 0.25rem solid var(--color-white);
    }

    #paste-settings-header {
        font-size: var(--text-xl);
        font-weight: 700;
    }

    .paste-setting {
        gap: 1rem;
    }

    .paste-setting-header {
        font-size: var(--text-lg);
        font-weight: 600;
    }

    #expiry-div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    #expiry-settings {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
    }

    #paste-expiry-enable {
        color: var(--color-white);
        border: none;
        border-radius: var(--radius-md);
        background-color: var(--color-gray-500);
        align-items: center;
        height: 95%;
    }

    #paste-expiry {
        color: var(--color-white);
        border: none;
        border-radius: var(--radius-md);
        background-color: var(--color-gray-500);
        align-items: center;
        height: 95%;
    }

    .document {
        width: 95%;
        background-color: var(--color-gray-700);
        border-radius: var(--radius-md);
        border: 0.25rem solid var(--color-white);
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

    #document-header-title-name-input,
    #document-header-title-type-input {
        color: var(--color-white);
        border: none;
        border-radius: var(--radius-md);
        background-color: var(--color-gray-500);
        align-items: center;
        height: 95%;
    }

    .document-link-type {
        height: 1.5rem;
        width: 1.5rem;
    }

    .document-link-type > img {
        height: 100%;
        width: 100%;
        object-fit: contain;
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
