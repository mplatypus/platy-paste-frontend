export interface Config {
    default_expiry: number | null
    maximum_expiry: number | null
    maximum_document_count: number
    maximum_document_size: number
    maximum_total_document_size: number
}
