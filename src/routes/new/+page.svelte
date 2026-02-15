<script lang="ts">
    import { beforeNavigate, goto } from "$app/navigation"
    import HeaderDiv from "$lib/components/header.svelte"

    import { DEFAULT_TYPE, extractNameFromName, getAllTypes } from "$lib/types"

    import { uploadPaste } from "$lib/backend"
    import { PasteResponseError } from "$lib/errors"
    import type { NewDocument } from "$lib/models/new"
    import Slider from "$lib/components/slider.svelte"
    import type { Config } from "$lib/models/config"
    import Loader from "$lib/components/loader.svelte"
    export let data: { config: Config }

    let settingsCollapsed = false

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

    let name: string | null = data.config.defaults.paste_name
    let maximumViews: number | null = data.config.defaults.maximum_views
    let expiryState: string = ""
    let expiryOptions: string[] = []
    let expiry: string = ""
    if (
        data.config.defaults.expiry_hours != null &&
        (data.config.size_limits.minimum_expiry_hours != null ||
            data.config.size_limits.maximum_expiry_hours != null)
    ) {
        expiryState = "on"
        expiryOptions = ["on"]
        expiry = generateDefaultExpiry(data.config.defaults.expiry_hours)
    } else if (
        data.config.defaults.expiry_hours == null &&
        (data.config.size_limits.minimum_expiry_hours == null ||
            data.config.size_limits.maximum_expiry_hours == null)
    ) {
        expiryState = "off"
        expiryOptions = ["off", "on"]
        expiry = generateDefaultExpiry()
    } else if (
        data.config.defaults.expiry_hours != null &&
        (data.config.size_limits.minimum_expiry_hours == null ||
            data.config.size_limits.maximum_expiry_hours == null)
    ) {
        expiryState = "on"
        expiryOptions = ["off", "on"]
        expiry = generateDefaultExpiry(data.config.defaults.expiry_hours)
    } else if (
        data.config.defaults.expiry_hours == null &&
        (data.config.size_limits.minimum_expiry_hours != null ||
            data.config.size_limits.maximum_expiry_hours != null)
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
                isCollapsed: false,
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

    function toggleDocumentCollapsed(document: NewDocument) {
        documents = documents.map((d) =>
            d.id === document.id ? { ...d, isCollapsed: !d.isCollapsed } : d,
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

        let exp: Date | null | undefined = undefined
        if (expiryState === "on") {
            exp = new Date(expiry)
        } else if (expiryState === "off") {
            exp = null
        }

        try {
            let paste = await uploadPaste(documents, {
                name: name,
                expiry: exp,
                max_views: maximumViews,
            })

            goto(`/p/${paste.id}`, {
                state: {
                    paste_token: paste.token,
                },
            })
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

    function autoResizeTextarea(event: Event) {
        const textarea = event.target as HTMLTextAreaElement
        if (textarea.closest(".collapsed")) return
        textarea.style.height = "0.5rem"
        textarea.style.height = textarea.scrollHeight + 5 + "px"
    }

    beforeNavigate((nav) => {
        let emptyDocuments = documents.every(
            (doc) => doc.content.trim().length == 0,
        )

        if (emptyDocuments) return

        if (nav.type === "goto") return

        if (nav.type === "leave") nav.cancel()

        if (
            !confirm("You will lose all documents if you leave without saving.")
        ) {
            nav.cancel()
        }
    })
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

<p id="upload-error-message" style:display={errorIsEmpty ? "none" : "flex"}>
    {errorMessage}
</p>

{#if !data}
    <Loader />
{:else}
    <div id="paste">
        <div id="paste-settings">
            <div id="paste-settings-header">
                <h2 id="paste-settings-header">Paste Settings</h2>
                <button
                    on:click={() => {
                        settingsCollapsed = !settingsCollapsed
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="30"
                        width="30"
                        viewBox="0 0 448 512"
                        ><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path
                            fill="currentColor"
                            d="M0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32z"
                        />
                    </svg>
                </button>
            </div>
            <div id="paste-settings-items" class:collapsed={settingsCollapsed}>
                <div class="paste-setting">
                    <h3 class="paste-setting-header">Name</h3>
                    <div class="paste-setting-content">
                        <input
                            type="text"
                            minlength={data.config.size_limits
                                .minimum_paste_name_size}
                            maxlength={data.config.size_limits
                                .maximum_paste_name_size}
                            bind:value={name}
                        />
                    </div>
                </div>
                <span class="paste-setting-separator"></span>
                <div class="paste-setting">
                    <h3 class="paste-setting-header">Expiry</h3>
                    <div class="paste-setting-content">
                        <label class="paste-setting-toggle">
                            <Slider
                                options={expiryOptions}
                                bind:value={expiryState}
                            />
                        </label>
                        <input
                            type="datetime-local"
                            bind:value={expiry}
                            readonly={expiryState != "on"}
                        />
                    </div>
                </div>
                <span class="paste-setting-separator"></span>
                <div class="paste-setting">
                    <h3 class="paste-setting-header">Maximum Views</h3>
                    <div class="paste-setting-content">
                        <input
                            type="number"
                            min="1"
                            bind:value={maximumViews}
                        />
                    </div>
                </div>
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
                            minlength={data.config.size_limits
                                .minimum_document_name_size}
                            maxlength={data.config.size_limits
                                .maximum_document_name_size}
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
                            class="document-header-button-collapse"
                            on:click={() => toggleDocumentCollapsed(doc)}
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
                            class="document-header-button-delete"
                            on:click={() => deleteDocument(doc.id)}
                            disabled={documents.length === 1}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="30"
                                width="30"
                                viewBox="0 0 384 512"
                                ><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path
                                    fill="currentColor"
                                    d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"
                                /></svg
                            >
                        </button>
                    </div>
                </div>
                <div class="document-content">
                    <textarea
                        class:collapsed={doc.isCollapsed}
                        bind:value={doc.content}
                        on:input={(event) => autoResizeTextarea(event)}
                    ></textarea>
                </div>
            </div>
        {/each}
        <div id="buttons">
            <button
                on:click={newDocument}
                disabled={documents.length >=
                    data.config.size_limits.maximum_total_document_count}
                >add</button
            >
            <button
                on:click={submitPaste}
                disabled={!validateDocuments() ||
                    documents.length <
                        data.config.size_limits.minimum_total_document_count}
                >save</button
            >
        </div>
    </div>
{/if}

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
        justify-self: center;
        align-self: center;
        align-items: center;
        background-color: var(--color-danger-primary);
        font-family: quicksand, sans-serif;
        border-radius: var(--radius-xl);
        margin-top: 1.5rem;
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
        border-radius: var(--radius-xl);
        overflow: hidden;
    }

    #paste-settings-header {
        height: 3rem;
        width: 100%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #paste-settings-header > h2 {
        align-self: center;
        font-size: var(--text-xl);
        font-weight: 700;
        padding: 0.5rem 0;
    }

    #paste-settings-header > button {
        position: absolute;
        right: 1rem;
        color: var(--color-button-primary);
    }

    #paste-settings-items {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding: 0.25rem 0;
        background-color: var(--color);
        background-color: var(--color-content-primary);
        gap: 1rem;
    }

    #paste-settings-items.collapsed {
        display: none;
    }

    .paste-setting {
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 100%;
        padding: 0.25rem;
        gap: 1rem;
    }

    @media (max-width: 450px) {
        .paste-setting {
            flex-direction: column;
            justify-content: center;
            align-items: normal;
        }
    }

    .paste-setting-header {
        align-self: center;
        font-size: var(--text-lg);
        font-weight: 600;
    }

    .paste-setting-content {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 100%;
        gap: 0.25rem;
    }

    .paste-setting-content > input {
        border: none;
        border-radius: var(--radius-md);
        background-color: var(--color-gray-500);
        align-items: center;
        height: 100%;
        width: min(80%, fit-content);
        color: var(--color-text);
        font-size: var(--text-lg);
        font-family: var(--main-font);
        font-weight: 500;
        padding: 0.1rem 0.25rem;
    }

    @media (max-width: 450px) {
        .paste-setting-content > input {
            font-size: var(--text-base);
        }
    }

    .paste-setting-content > input:hover:not(:read-only) {
        filter: brightness(95%);
    }

    .paste-setting-content > input:read-only {
        background-color: var(--color-gray-600);
        pointer-events: none;
        opacity: 0.6;
    }

    .paste-setting-separator {
        display: inline;
        height: 4px;
        width: 90%;
        border-radius: 0.5rem;
        border: var(--color-text);
        background-color: var(--color-text);
    }

    .paste-setting-toggle {
        height: 100%;
    }

    .document {
        width: 95%;
        background-color: var(--color-header-primary);
        border-radius: var(--radius-xl);
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
        width: 50%;
    }

    .document-header-title-name-input:hover,
    .document-header-title-type-input:hover {
        filter: brightness(120%);
    }

    .document-header-title-name-input:focus,
    .document-header-title-type-input:focus,
    .paste-setting-content > input:focus {
        outline: none;
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

    .document-header-button-delete > svg {
        color: var(--color-danger-primary);
    }

    .document-header-button-delete:disabled > svg {
        color: var(--color-danger-disabled);
    }

    /* Document content */
    .document-content {
        background-color: var(--color-content-primary);
        display: flex;
        border-radius: 0 0 var(--radius-xl) var(--radius-xl);
    }

    .document-content > textarea {
        flex-direction: column;
        font-size: var(--code-size);
        height: 3rem;
        width: 100%;
        padding: 0.25rem 0 1rem;
        margin: auto 0.25rem;
        line-height: 1.5em;
        resize: none;
        white-space: pre;
        overflow-wrap: normal;
        overflow-y: hidden;
        overflow-x: auto;
    }

    .document-content > textarea.collapsed {
        height: 0 !important;
        padding: 0;
        font-size: 0;
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

    @layer utilities {
        .document-content > textarea::-webkit-scrollbar {
            height: 1rem;
            width: 1rem;
        }

        .document-content > textarea::-webkit-scrollbar-track {
            border-radius: var(--radius-xl);
        }

        .document-content > textarea::-webkit-scrollbar-thumb {
            background: var(--color-button-secondary);
            border-radius: var(--radius-xl);
        }

        .document-content > textarea::-webkit-scrollbar-thumb:hover {
            background: var(--color-button-primary);
        }
    }
</style>
