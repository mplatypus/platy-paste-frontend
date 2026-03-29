import type { PasteError } from "$lib/errors"

declare global {
    namespace App {
        interface Error {
            message: string
            error: PasteError
            paste_id?: string
        }
        interface PageState {
            paste_token?: string
        }
    }
}
export {}
