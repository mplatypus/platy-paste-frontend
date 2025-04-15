export async function handle({ event, resolve }) {
    const fetch = event.fetch.bind(globalThis);
    const response = await resolve(event, {
        filterSerializedResponseHeaders: (name) => {
            // Allow the header for content type
            return name.toLowerCase() === "content-type"
        },
    })

    return response
}
