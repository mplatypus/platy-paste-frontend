<script lang="ts">
    let { options, value = $bindable(), onclick = () => {} } = $props()

    let index = $derived(options.indexOf(value))
    let sliderLeft = $derived(`${(100 / options.length) * index}%`)
    const sliderWidth = `${100 / options.length}%`
</script>

<div class="toggle">
    <div class="slider" style="left: {sliderLeft}; width: {sliderWidth};"></div>

    {#each options as opt}
        <button
            class="toggle-option"
            onclick={() => {
                value = opt
                onclick()
            }}
        >
            {opt}
        </button>
    {/each}
</div>

<style>
    .toggle {
        display: flex;
        width: 100%;
        background-color: var(--color-button-secondary);
        border-radius: 20px;
        overflow: hidden;
        position: relative;
        height: 35%;
        user-select: none;
    }

    .toggle-option {
        font-family: var(--main-font);
        flex: 1;
        text-align: center;
        z-index: 1;
        cursor: pointer;
        color: var(--color-text);
        font-weight: 700;
    }

    .slider {
        position: absolute;
        background-color: var(--color-button-primary);
        height: 100%;
        top: 0;
        transition: left 0.2s ease;
        border-radius: 20px;
        z-index: 0;
    }
</style>
