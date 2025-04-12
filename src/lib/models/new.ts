export interface NewPaste {
    enableExpiry: boolean // Whether the expiry is enabled.
    expiry: string // The expiry of the paste.
    documents: NewDocument[] // The documents of the paste.
}

export interface NewDocument {
    id: number // A unique ID for the document. NOTE: this is not a valid snowflake, this is a random number.
    overrideType: boolean // Whether the content type has been overridden. If true, the content type will not auto update.
    type: string // The content type of the document.
    name: string // The name of the document.
    content: string // The contents of the document.
}
