<script lang="ts">
    import HeaderDiv from "$lib/components/header.svelte"
</script>

<svelte:head>
    <title>Platy Paste</title>
    <meta property="og:title" content="Platy Paste" />
    <meta property="og:description" content="Home for Platy Paste" />
    <meta property="og:site_name" content="Platy Paste" />
    <meta property="og:image" content="/logo.png" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:alt" content="Platy Paste logo" />
    <meta name="theme-color" content="#1D7C8C" />
</svelte:head>

<HeaderDiv>
    <h1>Home</h1>
</HeaderDiv>

<div id="base">
    <h1 id="title">Welcome to Platy Paste!</h1>
    <div id="description" class="base-section">
        <p>Welcome to platy paste!</p>
        <p>Platy Paste is a custom pastebin service.</p>
        <p>
            This service is designed to be easy to work with and use,<br />both
            users and bots alike!
        </p>
        <p>
            You can find out more <a
                class="link"
                href="https://github.com/mplatypus/platy-paste-frontend">here</a
            >
        </p>
    </div>
    <div id="q-and-a" class="base-section">
        <a href="#q-and-a"><h3>Q and A's</h3></a>
        <div class="question">
            <a class="qna" href="#qna-create"
                ><h4>How can I create a paste?</h4></a
            >
            <p>
                At the top right of each page, there should be a button called
                new,
            </p>
            <p>which will open the page for creating a new paste.</p>
            <p>or, open <a class="link" href="/new">this</a> link.</p>
        </div>
        <div class="question">
            <a class="qna" href="#qna-view"><h4>How do I view a paste?</h4></a>
            <p>
                When creating a paste, you will be redirected to the paste site.
            </p>
            <p>A paste can be found by going to /p/123456789,</p>
            <p>replacing the numbers with a valid paste ID.</p>
        </div>
        <div class="question">
            <a class="qna" href="#qna-beta"
                ><h4>When will this site come out of beta?</h4></a
            >
            <p>The plan is to leave beta, when the backend is complete.</p>
            <p>This will allow the site to be patched up,</p>
            <p>and once a release is made, the site will leave beta.</p>
        </div>
    </div>
    <div id="links" class="base-section">
        <a href="#links"><h3>Useful links</h3></a>
        <a class="link" href="https://github.com/mplatypus/platy-paste-frontend"
            ><p>Frontend (github)</p>
            <p></p></a
        >
        <a class="link" href="https://github.com/mplatypus/platy-paste-backend"
            ><p>Backend (github)</p>
            <p></p></a
        >
        <a class="link" href="/docs"
            ><p>Documentation</p>
            <p></p></a
        >
    </div>
</div>

<style lang="postcss">
    @reference "tailwindcss";

    :global(html) {
        background-color: var(--color-background);
    }

    :global(p, h1, h3, h4, a) {
        color: var(--color-text);
        font-family: var(--main-font);
    }

    :global(p, a) {
        font-size: large;
        font-weight: 500;
        text-align: center;
    }

    #base {
        margin: 0 1rem 5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        gap: 4rem;
    }

    #title {
        font-size: xxx-large;
        font-weight: 800;
    }

    .base-section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .base-section > a {
        color: #666666;
        size: inherit;
        padding-left: 0.25rem;
    }

    .base-section h3 {
        font-size: xx-large;
    }

    #q-and-a {
        gap: 2rem;
    }

    .question {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .question > a > h4 {
        color: var(--color-gray-500);
        font-size: x-large;
    }

    .link,
    .link > p {
        color: var(--color-button-primary);
    }
</style>
