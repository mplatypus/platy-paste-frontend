export interface Document {
    id: string
    paste_id: string
    type: string
    name: string
    content: string
}

export interface NewDocument {
    id: number
    overrideType: boolean
    type: string
    name: string
    content: string
}

export interface ResponseDocument {
    id: string
    paste_id: string
    type: string
    name: string
}
