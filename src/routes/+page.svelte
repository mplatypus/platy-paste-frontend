<script lang="ts">
    import HeaderDiv from "$lib/components/header.svelte"
</script>

<svelte:head>
    <title>Platy Paste</title>
    <meta property="og:title" content="Platy Paste" />
    <meta property="og:description" content="Home for Platy Paste" />
</svelte:head>

<HeaderDiv content="Home"></HeaderDiv>

<div id="base">
    <h1 id="title">Welcome to Platy Paste!</h1>
    <div id="description" class="base-section">
        <p>Welcome to platy paste!</p>
        <p>A cool site made by MPlaty.</p>
        <p>
            You can find out more <a
                class="link"
                href="https://github.com/mplatypus/platy-paste-frontend">here</a
            >.
        </p>
    </div>
    <div id="q-and-a" class="base-section">
        <a href="#q-and-a"><h3>Q and A's</h3></a>
        <p>Questions and Answers for Platy Paste.</p>
    </div>
    <div id="documentation" class="base-section">
        <a href="#documentation"><h3>API Documentation</h3></a>
        <p>
            The API Documentation can be found <a class="link" href="/docs"
                >here</a
            >.
        </p>
    </div>
</div>

<style lang="postcss">
    @reference "tailwindcss";

    :global(p, h1, h3, a) {
        color: white;
        font-family: quicksand, sans-serif;
    }

    #base {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    #title {
        font-size: xx-large;
        font-weight: 800;
    }

    .base-section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 3rem;
    }

    .base-section > a {
        color: #666666;
        size: inherit;
        padding-left: 0.25rem;
    }

    .base-section h3 {
        font-size: large;
    }

    #description > p {
        font-size: medium;
    }

    .link {
        color: var(--color-blue-500);
        font-family: quicksand, sans-serif;
        font-weight: 400;
    }
</style>
