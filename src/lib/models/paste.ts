import type { Document } from "./document"

export interface Paste {
    id: string
    name: string | null
    timestamp: Date // Created timestamp.
    edited_timestamp: Date | null // Last edited timestamp.
    expiry_timestamp: Date | null // Expiry timestamp.
    views: number
    max_views: number | null
    documents: Document[]
}
