<script lang="ts">
    import { DEFAULT_TYPE, extractNameFromDocument } from "$lib/types"

    let { document, content = "", onCollapse = () => {} } = $props()

    let menuCollapsed = $state(true)

    function copyContent(event: MouseEvent, data: string) {
        const button = event.currentTarget as HTMLButtonElement
        navigator.clipboard.writeText(data).then(() => {
            button.classList.add("copied")
            setTimeout(() => button.classList.remove("copied"), 500)
        })
    }
</script>

<div class="document-header">
    <div class="document-information">
        <p class="document-information-name">{document.name}</p>
        <p class="document-information-type">
            {extractNameFromDocument(document) || DEFAULT_TYPE}
        </p>
    </div>
    <div class="document-header-buttons">
        <button
            class="document-header-button-collapse"
            onclick={() => {
                menuCollapsed = !menuCollapsed
            }}
            type="button"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="30"
                width="30"
                viewBox="0 0 640 640"
                ><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path
                    fill="currentColor"
                    d="M96 320C96 289.1 121.1 264 152 264C182.9 264 208 289.1 208 320C208 350.9 182.9 376 152 376C121.1 376 96 350.9 96 320zM264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320zM488 264C518.9 264 544 289.1 544 320C544 350.9 518.9 376 488 376C457.1 376 432 350.9 432 320C432 289.1 457.1 264 488 264z"
                />
            </svg>
        </button>
        <button
            class="document-header-button-collapse"
            onclick={() => {
                onCollapse()
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
    <div class="document-header-menu" class:collapsed={menuCollapsed}>
        <button
            class="document-header-menu-button"
            onclick={(event: MouseEvent) => {
                copyContent(event, document.id)
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
            <p>Copy ID</p>
        </button>
        <button
            class="document-header-menu-button"
            onclick={(event: MouseEvent) => {
                copyContent(event, content)
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
                />
            </svg>
            <p>Copy Content</p>
        </button>
    </div>
</div>

<style lang="postcss">
    .document-header {
        height: 3rem;
        position: relative;
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

    .document-information-name {
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

    .document-information > p {
        font-family: quicksand, sans-serif;
        color: var(--color-text);
    }

    div.document-header-menu {
        position: absolute;
        width: 15rem;
        height: fit-content;
        right: 0;
        top: 3rem;
        margin: 0.25rem;
        padding: 0.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        background-color: var(--color-header-primary);
        border-radius: var(--radius-xl);
    }

    @media (max-width: 450px) {
        div.document-header-menu {
            width: calc(100% - calc(0.25rem * 2));
        }
    }

    div.document-header-menu.collapsed {
        display: none;
    }

    button.document-header-menu-button {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
    }

    button.document-header-menu-button > svg,
    button.document-header-menu-button > p {
        color: var(--color-button-primary);
        /*transition: color 1s ease-out;*/
    }

    :global(.copied > svg, .copied > p) {
        color: var(--color-button-secondary);
    }
</style>
