import type { Document } from "./document"

export interface Paste {
    id: string
    edited: boolean
    documents: Document[]
}
