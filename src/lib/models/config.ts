export interface Config {
    defaults: DefaultsConfig
    size_limits: SizeLimitsConfig
}

export interface DefaultsConfig {
    expiry_hours: number | null
    maximum_views: number | null
    paste_name: string | null
}

export interface SizeLimitsConfig {
    minimum_paste_name_size: number | null
    minimum_expiry_hours: number | null
    minimum_total_document_count: number
    minimum_document_size: number
    minimum_total_document_size: number
    minimum_document_name_size: number
    maximum_paste_name_size: number | null
    maximum_expiry_hours: number | null
    maximum_total_document_count: number
    maximum_document_size: number
    maximum_total_document_size: number
    maximum_document_name_size: number
}
