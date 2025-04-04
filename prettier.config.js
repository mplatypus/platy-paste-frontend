/** @type {import("prettier").Config} */
export default {
    plugins: ["prettier-plugin-svelte"], // Ensure the Svelte plugin is used
    semi: false,
    singleQuote: false,
    tabWidth: 4,
    svelteSortOrder: "options-scripts-markup-styles", // Recommended order
    svelteStrictMode: false,
    svelteBracketNewLine: true,
}
