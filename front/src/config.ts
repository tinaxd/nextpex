"use strict";
const BASE_URL = "http://localhost:3601";

export function makeURL(path: string): string {
    return BASE_URL + path;
}
