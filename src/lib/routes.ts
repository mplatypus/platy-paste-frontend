import { PasteError } from "./errors"
import type { Method } from "./request"

export class Route {
    method: Method
    path: string

    constructor(method: Method, path: string) {
        this.method = method
        this.path = path
    }

    build(parameters: { [key: string]: any } = {}): BuiltRoute {
        let path = this.path
        for (const key in parameters) {
            const key_match = `{${key}}`
            const value = parameters[key]

            if (path.search(key_match) > 0) {
                path = path.replace(key_match, value)
            } else {
                throw new PasteError(
                    `Failed to build route: Could not find ${key} in ${this.path}`,
                )
            }
        }

        return new BuiltRoute(this, path)
    }

    toString(): string {
        return `${this.method} ${this.path}`
    }
}

export class BuiltRoute {
    route: Route
    built_path: string

    constructor(route: Route, built_path: string) {
        this.route = route
        this.built_path = built_path
    }
}

// Config
export const GET_CONFIG = new Route("GET", "/config")

// Paste
export const GET_PASTE = new Route("GET", "/pastes/{paste_id}")
export const POST_PASTE = new Route("POST", "/pastes")
