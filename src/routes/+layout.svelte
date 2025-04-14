<script>
    import "../app.css"
    //import "@material/web/all.js"
    let { children } = $props()
</script>

<svelte:head>
    <meta name="darkreader-lock" />
</svelte:head>

{@render children()}
