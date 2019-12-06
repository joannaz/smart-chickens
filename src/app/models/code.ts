export class SourceCode {
    id: number
    name: string
    code: string
    date_created: Date
    last_modified: Date
    is_active: boolean
}

export class ToggleActive {
    compiles: boolean
    message: string
    saved: boolean
}