import type { PasteError } from "$lib/errors"

declare global {
    namespace App {
        interface Error {
            // The name of the error.
            name: string
            // The message or human readable contents of the message.
            message: string
            // The traceback of the error.
            trace: string | null
            // The time at which the error occured.
            time?: Date
            // The relevant paste ID.
            paste_id?: string
        }
        interface PageState {
            paste_token?: string
        }
    }
}
export {}
