// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { PasteError } from "$lib/errors"

declare global {
    namespace App {
        interface Error {
            trace: string | null
            timestamp: number | null
            paste_id: string | null
        }
        interface PageState {
            paste_token?: string
        }
    }
}
export {}
