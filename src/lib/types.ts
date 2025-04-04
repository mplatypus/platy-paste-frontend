interface acceptedType {
    shiki: string // Used for displaying with shiki.
    fileTypes: string[] // Used for auto detection.
    mime: string // Used for sending to the server.
}

var acceptedTypes: Record<string, acceptedType> = {
    // display name: information
    assembly: {
        shiki: "asm",
        fileTypes: [".asm", ".s"],
        mime: "text/x-asm",
    },
    c: {
        shiki: "c",
        fileTypes: ["c", "h"],
        mime: "text/x-c",
    },
    cpp: {
        shiki: "cpp",
        fileTypes: ["cpp", "hpp", "cc", "hh", "cxx"],
        mime: "text/x-c",
    },
    text: {
        shiki: "txt",
        fileTypes: [
            "conf",
            "def",
            "diff",
            "in",
            "ksh",
            "list",
            "log",
            "pl",
            "text",
            "txt",
        ],
        mime: "text/plain",
    },
    markdown: {
        shiki: "markdown",
        fileTypes: ["md", "markdown", "mdown", "markdn"],
        mime: "text/markdown",
    },
    css: {
        shiki: "css",
        fileTypes: ["css"],
        mime: "text/css",
    },
    csv: {
        shiki: "csv",
        fileTypes: ["csv"],
        mime: "text/csv",
    },
    html: {
        shiki: "html",
        fileTypes: ["htm", "html"],
        mime: "text/html",
    },
    java: {
        shiki: "java",
        fileTypes: ["java"],
        mime: "text/x-java-source",
    },
    javascript: {
        shiki: "javascript",
        fileTypes: ["js"],
        mime: "text/javascript",
    },
    json: {
        shiki: "json",
        fileTypes: ["json"],
        mime: "application/json",
    },
    pascal: {
        shiki: "pascal",
        fileTypes: ["pas"],
        mime: "text/x-pascal",
    },
    python: {
        shiki: "python",
        fileTypes: ["py"],
        mime: "text/x-python",
    },
}

export function mimeToShiki(mimeType: string): string | null {
    for (const key in acceptedTypes) {
        let acceptedType = acceptedTypes[key]
        if (acceptedType.mime === mimeType) {
            return acceptedType.shiki
        }
    }
    return null
}

export function fileTypeToShiki(fileType: string): string | null {
    for (const key in acceptedTypes) {
        let acceptedType = acceptedTypes[key]
        if (acceptedType.fileTypes.includes(fileType)) {
            return acceptedType.shiki
        }
    }
    return null
}

export function shikiToMime(shikiType: string): string | null {
    for (const key in acceptedTypes) {
        let acceptedType = acceptedTypes[key]
        if (acceptedType.shiki === shikiType) {
            return acceptedType.mime
        }
    }
    return null
}

export function typeToShiki(type: string): string | null {
    return acceptedTypes[type]?.shiki ?? null
}

export function typeToMime(type: string): string | null {
    return acceptedTypes[type]?.mime ?? null
}

export function mimeToType(mimeType: string): string | null {
    for (const key in acceptedTypes) {
        if (acceptedTypes[key].mime === mimeType) {
            return key
        }
    }
    return null
}

export function fileTypeToMime(fileType: string): string | null {
    for (const key in acceptedTypes) {
        if (acceptedTypes[key].fileTypes.includes(fileType)) {
            return acceptedTypes[key].mime
        }
    }
    return null
}

export const DEFAULT_MIME = "text/plain"

export const DEFAULT_SHIKI = "text"

export const DEFAULT_TYPE = "text"

export function getAllTypes(): string[] {
    return Object.keys(acceptedTypes)
}
