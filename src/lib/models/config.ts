export interface Config {
    defaults: DefaultsConfig
    size_limits: SizeLimitsConfig
}

export interface DefaultsConfig {
    expiry_hours: number | null
    maximum_views: number | null
}

export interface SizeLimitsConfig {
    minimum_expiry_hours: number | null
    minimum_total_document_count: number
    minimum_document_size: number
    minimum_total_document_size: number
    minimum_document_name_size: number
    maximum_expiry_hours: number | null
    maximum_total_document_count: number
    maximum_document_size: number
    maximum_total_document_size: number
    maximum_document_name_size: number
}
