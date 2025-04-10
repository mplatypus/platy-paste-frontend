<script lang="ts">
    import { goto } from "$app/navigation"
    import HeaderDiv from "$lib/components/header.svelte"
    import autosize from "svelte-autosize"

    import { getAllTypes } from "$lib/types"

    import type { Document } from "$lib/models/document"
    import { uploadPaste } from "$lib/backend"
    import { PasteResponseError, PasteUploadError } from "$lib/errors"

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
                type: "text",
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
    $: errorIsEmpty = errorMessage.trim() === ""

    async function submitPaste() {
        if (!validateDocuments()) return

        let exp: number | undefined = undefined
        if (enableExpiry) {
            const localDate = new Date(expiry)
            const utcTimestamp = Date.UTC(
                localDate.getFullYear(),
                localDate.getMonth(),
                localDate.getDate(),
                localDate.getHours(),
                localDate.getMinutes(),
                localDate.getSeconds(),
            )

            exp = Math.floor(utcTimestamp / 1000)
        }

        try {
            let paste = await uploadPaste(documents, { expiry: exp })

            goto(`/p/${paste.id}`)
        } catch (err) {
            errorMessage = "Unknown Error"

            console.log("msg", err)

            if (err instanceof PasteResponseError) {
                if (err.trace) {
                    errorMessage = err.trace
                } else {
                    errorMessage = err.reason
                }
            } else if (err instanceof Error) errorMessage = err.message
        }
    }
</script>

<svelte:head>
    <title>New Paste</title>
    <meta property="og:title" content="Platy Paste" />
    <meta property="og:description" content="Create a new paste!" />
</svelte:head>

<HeaderDiv content="New Paste"></HeaderDiv>

<div id="paste">
    <p
        id="upload-error-message"
        style:display={errorIsEmpty ? "none" : "flex"}
        bind:this={err}
    >
        {errorMessage}
    </p>
    <div id="paste-settings">
        <h2 id="paste-settings-header">Paste Settings</h2>
        <div id="expiry-div" class="paste-setting">
            <h3 id="paste-setting-expiry-header" class="paste-setting-header">
                Expiry
            </h3>
            <input
                id="paste-expiry-enable"
                type="checkbox"
                bind:checked={enableExpiry}
            />
            <input
                id="paste-expiry"
                type="datetime-local"
                bind:value={expiry}
                readonly={!enableExpiry}
            />
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
                    />
                    <p id="document-header-title-type">Type:</p>
                    <select
                        id="document-header-title-type-input"
                        bind:value={doc.type}
                    >
                        {#each getAllTypes() as validType}
                            <option selected={doc.type == "txt"}
                                >{validType}</option
                            >
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

    :global(h1, h2, h3, p) {
        font-family: var(--main-font);
        color: var(--color-text);
    }

    :global(textarea, input, select, option) {
        font-family: var(--code-font);
        color: var(--color-text);
    }

    :global(html) {
        background-color: var(--color-background);
        overflow-x: hidden;
    }

    #paste {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 1.5rem;
        gap: 2.5rem;
    }

    #upload-error-message {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: var(--color-danger-primary);
        font-family: quicksand, sans-serif;
        border-radius: var(--radius-xl);
        padding: 0.25rem 0.5rem;

        width: 95%;
        font-size: var(--text-xl);
        font-weight: 600;
    }

    #paste-settings {
        background-color: var(--color-header-primary);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 95%;
        gap: 0.5rem;
        border-radius: var(--radius-xl);
        overflow: hidden;
    }

    .paste-setting {
        background-color: var(--color-content-primary);
        width: 100%;
        padding: 0.5rem;
    }

    #paste-settings-header {
        font-size: var(--text-xl);
        font-weight: 700;
        padding-top: 0.5rem;
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
        flex-direction: row;
        justify-content: start;
        align-items: center;
        gap: 0.5rem;
    }

    #paste-expiry-enable {
        width: 1.5rem;
        height: 1.5rem;
        appearance: none;
        -webkit-appearance: none;
        background-color: var(--color-button-secondary);
        border-radius: 0.25rem;
        cursor: pointer;
        position: relative;
    }

    #paste-expiry-enable:checked {
        background-color: var(--color-button-primary);
    }

    #paste-expiry-enable::after {
        position: absolute;
        top: 0.25rem;
        left: 0.45rem;
        width: 0.25rem;
        height: 0.5rem;
        border: none;
        transform: rotate(45deg);
        opacity: 0;
    }

    #paste-expiry-enable:checked::after {
        opacity: 1;
    }

    #paste-expiry:read-only {
        background-color: var(--color-gray-600);
        pointer-events: none;
        opacity: 0.6;
    }

    #paste-expiry {
        color: var(--color-text);
        border: none;
        border-radius: var(--radius-md);
        background-color: var(--color-gray-500);
        align-items: center;
        height: 95%;
    }

    .document {
        width: 95%;
        background-color: var(--color-header-primary);
        border-radius: var(--radius-xl);
        overflow: hidden;
    }

    /* Document Header */
    .document-header {
        height: 3rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.5rem;
    }

    .document-header-title {
        border-radius: var(--radius-md);
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .document-header-title > * {
        margin-right: 1rem;
    }

    .document-header-title > p {
        font-size: var(--text-lg);
        font-weight: 400;
    }

    #document-header-title-name-input,
    #document-header-title-type-input {
        background-color: var(--color-content-primary);
        color: var(--color-text);
        border: none;
        border-radius: var(--radius-md);
        align-items: center;
        font-size: var(--text-lg);
    }

    #document-header-title-name-input:focus,
    #document-header-title-type-input:focus,
    #paste-expiry:focus {
        outline: none;
    }

    .document-header-button-delete {
        background-color: var(--color-danger-primary);
        color: var(--color-text);
        border-radius: var(--radius-md);
        height: 2rem;
        margin: 0 0.5rem;
        padding: 0 0.5rem;
    }

    .document-header-button-delete:disabled {
        background-color: var(--color-danger-disabled);
        cursor: not-allowed;
    }

    /* Document content */
    .document-content {
        background-color: var(--color-content-primary);
        height: max-content;
    }

    .document-content > textarea {
        font-size: var(--text-base);
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

    #buttons {
        margin-bottom: 2.5rem;
    }

    #buttons > button {
        border-radius: var(--radius-md);
        background-color: var(--color-button-primary);
        color: var(--color-text);
        height: 2rem;
        margin: 0 0.5rem;
        padding: 0 0.5rem;
    }

    #buttons > button:disabled {
        background-color: var(--color-button-disabled);
    }
</style>
