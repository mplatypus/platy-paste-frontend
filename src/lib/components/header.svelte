<script lang="ts">
    import { goto } from "$app/navigation"

    function new_paste() {
        goto("/new")
    }

    function beta_redirect() {
        location.href =
            "https://github.com/mplatypus/platy-paste-frontend?tab=readme-ov-file#beta"
    }
</script>

<div id="paste-header-div">
    <div id="paste-header-div-main-items" class="paste-header-div-item">
        <a href="/">
            <img id="paste-header-home-img" src="/logo.png" alt="Logo home" />
        </a>
        <div id="paste-header-div-main-content">
            <slot id="paste-header-div-content" />
        </div>
    </div>
    <div id="paste-header-div-button-items" class="paste-header-div-item">
        <button id="beta-tag" onclick={beta_redirect}> beta </button>
        <button
            id="paste-header-div-button-item-new-paste"
            class="paste-header-div-button-item"
            onclick={new_paste}>new</button
        >
    </div>
</div>

<style lang="postcss">
    :global(button) {
        font-family: var(--main-font);
        color: var(--color-text);
        font-weight: 600;
    }

    #paste-header-div {
        padding: 0.5rem;
        background-color: var(--color-background-header);
        border-radius: var(--radius-md);
        position: sticky;
        top: 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .paste-header-div-item {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    /* header-div-main-items */

    #paste-header-home-img {
        max-width: 80px;
        max-height: 80px;
        margin: 0;
        padding: 0 1rem;
    }

    #paste-header-div-main-content {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    #paste-header-div-main-content > :global(h1) {
        font-family: var(--main-font);
        color: var(--color-text);
        font-size: var(--text-2xl);
        font-weight: 700;
    }

    /* header-div-button-items */

    #paste-header-div-button-items {
        display: flex;
        flex-direction: row;
        gap: 0.75rem;
    }

    .paste-header-div-button-item {
        width: 3rem;
        height: 2rem;
        border-radius: var(--radius-md);
        border-style: solid;
        background-color: var(--color-button-primary);
        font-size: large;
    }

    #beta-tag {
        width: 3rem;
        height: 2rem;
        text-align: center;
    }

    #beta-tag {
        border-radius: var(--radius-md);
        border-style: solid;
        border-width: 0.25rem;
        border-color: var(--color-yellow-500);
        color: var(--color-yellow-500);
    }
</style>
