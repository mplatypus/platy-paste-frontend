import adapter from "@sveltejs/adapter-cloudflare"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),

    kit: {
        adapter: adapter({
            config: undefined,
            platformProxy: {
                configPath: undefined,
                environment: undefined,
                persist: undefined,
            },
            fallback: "plaintext",
            routes: {
                include: ["/*"],
                exclude: ["<all>", "/docs", "/docs/*", "/api", "/api/*"],
            },
        }),
    },
}

export default config
