import type { Document } from "./document"

export interface Paste {
    id: string
    timestamp: number // Created timestamp.
    edited_timestamp: number | null // Last edited timestamp.
    expiry_timestamp: number | null // Expiry timestamp.
    documents: Document[]
}
