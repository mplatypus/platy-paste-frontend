<script lang="ts">
    export let content: string

    import { goto } from "$app/navigation"

    function new_paste() {
        goto("/new")
    }
</script>

<div id="header-div">
    <div id="header-div-main-items" class="header-div-item">
        <a href="/">
            <img id="header-home-img" src="/favicon.png" alt="Logo home" />
        </a>
        <h1 id="header-content">{content}</h1>
    </div>

    <div id="header-div-button-items" class="header-div-item">
        <a
            id="beta-tag"
            href="https://github.com/mplatypus/platy-paste-frontend?tab=readme-ov-file#beta"
            ><p>beta</p></a
        >
        <button class="header-div-button-item" onclick={new_paste}>new</button>
    </div>
</div>

<style lang="postcss">
    #header-div {
        padding: 0.5rem;
        min-height: fit-content;
        max-height: max-content;
        height: 8vh;
        background-color: var(--color-background-header);
        position: sticky;
        top: 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        z-index: 5;
    }

    #header-home-img {
        height: 75%;
        width: 75%;
    }

    .header-div-item {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    /* header-div-main-items */

    #header-home-img {
        max-width: 80px;
        max-height: 80px;
        margin: 0;
    }

    #header-content {
        font-family: quicksand, sans-serif;
        color: var(--color-text);
        font-size: var(--text-2xl);
        font-weight: 700;
        padding-left: 1rem;
    }

    /* header-div-button-items */

    #header-div-button-items {
        pad: 2rem;
    }

    .header-div-button-item {
        margin: 0 0.5rem;
        padding: 0.25rem 1rem;
        border-radius: var(--radius-md);
        background-color: var(--color-button-primary);
        color: var(--color-text);
        font-weight: 400;
        font-size: var(--text-base);
        font-style: var(--main-font);
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
