import type { Document } from "./document"

export interface Paste {
    /**
     * The ID of the paste.
     */
    id: string
    /**
     * The name of the paste. (if set)
     */
    name: string | null
    /**
     * The pastes token.
     *
     * @remarks
     * This will only be a string, when creating a paste.
     */
    token?: string
    /**
     * The time at which the paste was created.
     */
    timestamp: Date
    /**
     * The time at which the paste was edited.
     *
     * @remarks
     *
     * If this value is null, the paste has not been edited.
     */
    edited_timestamp: Date | null
    /**
     * The time at which the paste will expire.
     *
     * @remarks
     * If this value is null, the paste will not expire.
     */
    expiry_timestamp: Date | null
    /**
     * The total amount of views the paste has had.
     */
    views: number
    /**
     * The total allowed amount of views before the paste is deleted.
     *
     * @remarks
     * If this value is null, the paste will not be deleted based on views.
     */
    max_views: number | null
    /**
     * The documents attached to the paste.
     */
    documents: Document[]
}
