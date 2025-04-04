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
        <p>A really cool description</p>
        <p>goes right here.</p>
    </div>
    <div id="q-and-a" class="base-section">
        <a href="#q-and-a"><h3>Q and A's</h3></a>
        <p>Questions and Answers for Platy Paste.</p>
    </div>
    <div id="documentation" class="base-section">
        <a href="#documentation"><h3>API Documentation</h3></a>
        <p>The API Documentation can be found below.</p>
    </div>
</div>

<style lang="postcss">
    :global(p, h1, h3) {
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
</style>
