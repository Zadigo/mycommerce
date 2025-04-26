export interface Address {
    type: string
    version: string
    features: [
        {
            type: string
            geometry: {
                type: string
                coordinates: number[]
            },
            properties: {
                label: string
                score: number
                housenumber: string
                id: number
                type:string
                name: string
                postcode: string
                citycode: number
                x: number
                y: number
                city: string
                context: string
                importance: number
                street: string
            }
        }
    ],
    attribution: string,
    licence: string
    query: string
    limit: number
}
