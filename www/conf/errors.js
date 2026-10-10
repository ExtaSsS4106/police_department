

export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}


export function flattenMessages(value) {
    if (value === null || value === undefined) return [];
    if (typeof value === 'string') return [value];
    if (Array.isArray(value)) return value.flatMap(flattenMessages);
    if (typeof value === 'object') return Object.values(value).flatMap(flattenMessages);
    return [String(value)];
}
