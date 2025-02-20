interface Text {
    title?: string
    content: string | string[]
}

interface TextBlock {
    id?: string
    title: string
    items: (string | string[] | Text)[]
}
