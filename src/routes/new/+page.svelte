<script lang="ts">
    import { goto } from "$app/navigation"
    import HeaderDiv from "$lib/components/header.svelte"
    import autosize from "svelte-autosize"

    import { DEFAULT_TYPE, extractNameFromName, getAllTypes } from "$lib/types"

    import { uploadPaste } from "$lib/backend"
    import { PasteResponseError } from "$lib/errors"
    import type { NewDocument } from "$lib/models/new"
    import Slider from "$lib/components/slider.svelte"
    import type { Config } from "$lib/models/config"
    export let data: { config: Config }

    function generateDefaultExpiry(
        default_hours: number | null = null,
    ): string {
        var time = new Date()

        if (default_hours != null) {
            time = new Date(time.getTime() + default_hours * 3600 * 1000)
        }

        var utcString = time.toISOString().substring(0, 19)
        var year = time.getFullYear()
        var month = time.getMonth() + 1
        var day = time.getDate()
        var hour = time.getHours()
        var minute = time.getMinutes()
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

    let expiryState: string = ""
    let expiryOptions: string[] = []
    let expiry: string = ""
    if (
        data.config.default_expiry != null &&
        data.config.maximum_expiry != null
    ) {
        expiryState = "on"
        expiryOptions = ["on"]
        expiry = generateDefaultExpiry(data.config.default_expiry)
    } else if (
        data.config.default_expiry == null &&
        data.config.maximum_expiry == null
    ) {
        expiryState = "off"
        expiryOptions = ["off", "on"]
        expiry = generateDefaultExpiry()
    } else if (
        data.config.default_expiry != null &&
        data.config.maximum_expiry == null
    ) {
        expiryState = "on"
        expiryOptions = ["off", "on"]
        expiry = generateDefaultExpiry(data.config.default_expiry)
    } else if (
        data.config.default_expiry == null &&
        data.config.maximum_expiry != null
    ) {
        expiryState = "on"
        expiryOptions = ["on"]
        expiry = generateDefaultExpiry()
    }
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
                type: DEFAULT_TYPE,
                name: "new.txt",
                oldName: "new.txt",
                content: "",
            },
        ]
    }

    function updateDocumentType(document: NewDocument) {
        if (document.name == document.oldName) return

        const pattern = RegExp("\.+\\.(?<ext>\\w+)$")
        const nameRegex = pattern.exec(document.name)
        const oldNameRegex = pattern.exec(document.oldName)

        let newType = document.type
        if (
            nameRegex != null &&
            nameRegex.groups != null &&
            oldNameRegex != null &&
            oldNameRegex.groups != null
        ) {
            const ext = nameRegex.groups["ext"]
            const oldExt = oldNameRegex.groups["ext"]

            if (ext != oldExt) {
                const extractedType = extractNameFromName(document.name)

                if (extractedType != null) {
                    newType = extractedType
                }
            }
        }

        documents = documents.map((d) =>
            d.id === document.id ? { ...d, type: newType, oldName: d.name } : d,
        )
    }

    function deleteDocument(docId: number) {
        documents = documents.filter((doc) => doc.id !== docId)
    }

    function validateDocuments(): boolean {
        return documents.every(
            (doc) =>
                doc.name.trim().length > 0 && doc.content.trim().length > 0,
        )
    }

    let errorMessage = ""
    $: errorIsEmpty = errorMessage.trim() === ""

    async function submitPaste() {
        if (!validateDocuments()) return

        let exp: number | null | undefined = undefined
        if (expiryState === "on") {
            const localDate = new Date(expiry)

            exp = Math.floor(localDate.getTime() / 1000)
        } else if (expiryState === "off") {
            exp = null
        }

        try {
            let paste = await uploadPaste(documents, { expiry: exp })

            goto(`/p/${paste.id}`)
        } catch (err) {
            errorMessage = "Unknown Error"

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
    <meta property="og:title" content="New" />
    <meta property="og:description" content="Make a new paste!" />
    <meta property="og:site_name" content="Platy Paste" />
    <meta property="og:image" content="/logo.png" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:alt" content="Platy Paste logo" />
    <meta name="theme-color" content="#1D7C8C" />
</svelte:head>

<HeaderDiv>
    <h1>New Paste</h1>
</HeaderDiv>

<div id="paste">
    <p id="upload-error-message" style:display={errorIsEmpty ? "none" : "flex"}>
        {errorMessage}
    </p>
    <div id="paste-settings">
        <h2 id="paste-settings-header">Paste Settings</h2>
        <div id="expiry-div" class="paste-setting">
            <h3 id="paste-setting-expiry-header" class="paste-setting-header">
                Expiry
            </h3>
            <label id="paste-expiry-toggle">
                <Slider options={expiryOptions} bind:value={expiryState} />
            </label>
            <input
                id="paste-expiry"
                type="datetime-local"
                bind:value={expiry}
                readonly={expiryState != "on"}
            />
        </div>
    </div>

    {#each documents as doc (doc.id)}
        <div class="document">
            <div class="document-header">
                <div class="document-header-title">
                    <input
                        class="document-header-title-name-input"
                        title="The name of the document."
                        type="text"
                        defaultValue="new.txt"
                        maxlength="50"
                        size="15"
                        bind:value={doc.name}
                        on:change={() => {
                            updateDocumentType(doc)
                        }}
                    />

                    <select
                        class="document-header-title-type-input"
                        title="The type of the document."
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
        <button
            on:click={newDocument}
            disabled={documents.length >= data.config.maximum_document_count}
            >add</button
        >
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
        margin-bottom: 2.5rem;
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

    #paste-expiry {
        color: var(--color-text);
        border: none;
        border-radius: var(--radius-md);
        background-color: var(--color-gray-500);
        align-items: center;
        height: 95%;
        -webkit-transition: 0.2s;
        transition: 0.2s;
    }

    #paste-expiry:hover:not(:read-only) {
        filter: brightness(95%);
    }

    #paste-expiry:read-only {
        background-color: var(--color-gray-600);
        pointer-events: none;
        opacity: 0.6;
    }

    .document {
        width: 95%;
        background-color: var(--color-header-primary);
        border-radius: var(--radius-xl);
        overflow: hidden;
    }

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

    .document-header-title-name-input,
    .document-header-title-type-input {
        background-color: var(--color-content-primary);
        color: var(--color-text);
        border: none;
        border-radius: var(--radius-md);
        align-items: center;
        font-size: var(--text-lg);
        transition: 0.2s;
    }

    .document-header-title-name-input:hover,
    .document-header-title-type-input:hover {
        filter: brightness(120%);
    }

    .document-header-title-name-input:focus,
    .document-header-title-type-input:focus,
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
        font-size: var(--code-size);
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
