<div id="loading-icon"></div>

<style lang="postcss">
    #loading-icon {
        align-self: center;
        justify-self: center;
        margin-top: 3rem;
        width: 50px;
        aspect-ratio: 1;
        border-radius: 50%;
        border: 8px solid;
        border-color: var(--color-loading-symbol) #0000;
        animation: loading-animation 3s infinite;
    }

    @keyframes loading-animation {
        12.5% {
            transform: rotate(0.125turn);
        }
        25% {
            transform: rotate(0.25turn);
        }
        37.5% {
            transform: rotate(0.375turn);
        }
        50% {
            transform: rotate(0.5turn);
        }
        62.5% {
            transform: rotate(0.625turn);
        }
        75% {
            transform: rotate(0.75turn);
        }
        87.5% {
            transform: rotate(0.875turn);
        }
        100% {
            transform: rotate(1turn);
        }
    }
</style>
