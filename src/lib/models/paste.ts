import type { Document } from "./document"

export interface Paste {
    id: string
    timestamp: Date // Created timestamp.
    edited_timestamp: Date | null // Last edited timestamp.
    expiry_timestamp: Date | null // Expiry timestamp.
    documents: Document[]
}
