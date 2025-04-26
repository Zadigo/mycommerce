export interface Text {
    title?: string
    content: string | string[]
}

export interface TextBlock {
    id?: string
    title: string
    items: (string | string[] | Text)[]
}
