import { PUBLIC_API_URL } from "$env/static/public"
import type { Paste, ResponsePaste } from "./models/paste"
import type { Document, NewDocument } from "./models/document"
import { PasteResponseError, type APIError, PasteUploadError, PasteError } from "./errors"
import { DEFAULT_MIME, extractTypeFromDocument, getType } from "./types";

const VERSION = 1

const BASE_API_URL = `${PUBLIC_API_URL.trim().replace(/\/$/, "")}/v${VERSION}`

/* /paste endpoints */

export async function fetchPaste(
    svelteFetch: typeof fetch,
    id: string,
    content: boolean,
): Promise<Paste | null> {
    let response = await svelteFetch(
        `${BASE_API_URL}/pastes/${id}?content=${content}`,
    )

    if (response.status == 404) {
        return null
    } else if (!response.ok) {
        let error: APIError = await response.json();

        throw PasteResponseError.fromAPIError(response.status, error);
    }

    return await decodeFormData(response)
}

interface UploadPasteSettings {
    content?: boolean
    expiry?: number
}

export async function uploadPaste(
    documents: NewDocument[],
    settings: UploadPasteSettings = {},
): Promise<Paste> {
    try {
        const formData = new FormData()

        let payload = {
            expiry: settings.expiry,
        }

        formData.append(
            "payload",
            new Blob([JSON.stringify(payload)], { type: "application/json" }),
        )

        documents.forEach((doc) => {
            let mime = getType(doc.type)?.mime || DEFAULT_MIME

            formData.append(doc.name, new Blob([doc.content], { type: mime }))
        })

        let query = ""

        if (settings.content != undefined) {
            query = `?content=${settings.content}`
        }

        const response = await fetch(`${BASE_API_URL}/pastes${query}`, {
            method: "POST",
            mode: "cors",
            body: formData,
        })

        if (response.ok) {
            let paste = await decodeFormData(response);

            if (paste) return paste
        }

        let error: APIError = await response.json()

        throw PasteResponseError.fromAPIError(response.status, error)
    } catch (err) {
        let message = "Unknown Error"
        if (err instanceof Error) message = err.message

        throw new PasteUploadError(message)
    }
}


async function decodeFormData(response: Response): Promise<Paste | null> {
    let contentType = response.headers.get("content-type");

    if (contentType == null) {
        throw new PasteError("No Content-Type header received.")
    }

    contentType = contentType.split(";")[0];

    if (contentType === "application/json") {
        return await response.json()
    }

    if (contentType != "multipart/form-data") {
        throw new PasteError(`Unknown Content-Type: ${contentType}`)
    }
    
    let formData = await response.formData();

    let payload_data = formData.get("payload");

    if (payload_data == null || !(payload_data instanceof File)) {
        throw new PasteError("Missing payload object.");
    }

    let payload: ResponsePaste = JSON.parse(await payload_data.text())

    let documents: Document[] = [];
    for (const document of payload.documents) {
        let content_data = formData.get(document.id.toString())

        if (content_data == null) {
            throw new PasteError(`Content for ${document.id} was not found.`)
        }

        let content: string | null = null
        if (content_data instanceof File) {
            content = await content_data.text();
        } else {
            throw new PasteError("Content type is unknown.")
        }

        let new_document: Document = {
            id: document.id,
            paste_id: document.paste_id,
            type: document.type,
            name: document.name,
            content: content,
        }

        documents.push(new_document)
    }

    let paste: Paste = {
        id: payload.id,
        edited: payload.edited,
        documents: documents
    }

    return paste
}