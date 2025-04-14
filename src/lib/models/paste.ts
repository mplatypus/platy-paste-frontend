import type { Document, NewDocument, ResponseDocument } from "./document"

export interface Paste {
    id: string
    edited: boolean
    documents: Document[]
}

export interface NewPaste {
    enableExpiry: boolean
    expiry: string
    documents: NewDocument[]
}

export interface ResponsePaste {
    id: string
    edited: boolean
    documents: ResponseDocument[]
}