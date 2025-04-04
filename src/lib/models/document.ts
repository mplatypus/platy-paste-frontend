export interface Document {
    id: string
    paste_id: string
    type: string
    name: string
    content: string // Even though this value can be null, this should panic if it is null.
}
