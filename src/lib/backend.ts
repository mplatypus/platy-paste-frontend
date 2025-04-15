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
    
    const getFormData = response.formData.bind(response);
    const formData = await getFormData();

    // Work with the File's `text` method bound explicitly.
    const getFileText = (file: File) => file.text.bind(file)();

    console.log(formData.entries().toArray())

    const payload_data = formData.get("payload");
    let payloadText: string;
    if (typeof payload_data === "string") {
        // Already a JSON string
        payloadText = payload_data;
    } else if (payload_data instanceof File) {
        // Read file contents as text
        payloadText = await payload_data.text();
    } else {
        throw new PasteError("Missing payload object.");
    }
    
    let payload: ResponsePaste = JSON.parse(payloadText);

    let documents: Document[] = [];
    for (const document of payload.documents) {
        let content_data = formData.get(document.id.toString());
        if (content_data == null) {
            throw new PasteError(`Content for ${document.id} was not found.`);
        }
        let content: string | null = null;
        if (content_data instanceof File) {
            content = await getFileText(content_data);
        } else {
            throw new PasteError("Content type is unknown.");
        }
        documents.push({
            id: document.id,
            paste_id: document.paste_id,
            type: document.type,
            name: document.name,
            content: content,
        });
    }
    let paste: Paste = {
        id: payload.id,
        edited: payload.edited,
        documents: documents
    }
    return paste;
} 