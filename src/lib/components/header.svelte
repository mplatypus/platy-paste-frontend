<script lang="ts">
    import { goto } from "$app/navigation"

    function new_paste() {
        goto("/new")
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
        <a
            id="beta-tag"
            href="https://github.com/mplatypus/platy-paste-frontend?tab=readme-ov-file#beta"
        >
            <p>beta</p>
        </a>
        <button class="paste-header-div-button-item" onclick={new_paste}
            >new</button
        >
    </div>
</div>

<style lang="postcss">
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
        pad: 2rem;
    }

    .paste-header-div-button-item {
        margin: 0 0.5rem;
        padding: 0.25rem 1rem;
        border-radius: var(--radius-md);
        border-style: solid;
        background-color: var(--color-rose-400);
    }

    #beta-tag {
        border-radius: var(--radius-md);
        border-style: solid;
        border-width: 0.25rem;
        border-color: var(--color-yellow-500);
    }

    #beta-tag > p {
        padding: 0 0.25rem;
        margin: 0;
        border: none;
        font-family: quicksand, sans-serif;
        color: var(--color-yellow-500);
        font-weight: 600;
    }
</style>
