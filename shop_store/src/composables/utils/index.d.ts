import { Ref } from 'vue'

/** Scroll to the top of a page */
declare function scrollToTop (): void

declare function useUtilities (): {
    /** Check if a list of items has null values */
    hasNull (items: []): boolean
    /** Adds an "id" attribute to each item in a list of items */
    indexElements (items: []): []
    /** From a list of items, get the incremented last "id" attribute */
    incrementLastId (items: object[]): number | null
    /** Read a user uploaded file */
    readFile (file: File): string
    /** Read multiple uploaded files */
    readMultipleFiles (files: File[]): string[]
    /** Truncate a given text by k-length */
    truncate (text: string, k?: number): string
    /** Truncate a string based on it's length */
    conditionalTruncate (text: string, limit: number, k: number): string
    /** Manage the items of a list by adding or removing non-existing elements accordingly */
    listManager (items: [], item: object): []
    /** Based on the ID attribute of an element on the page, scroll to that element */
    scrollToSection (elementId: string): void
    /** Capitalize the first letter of a string */
    capitalizeFirstLetter (value): string
    /** Capitalize the first letters of a string */
    capitalizeLetters (value): string
    /** Format a number as a percentage */
    formatAsPercentage (value: number, negative?: boolean): string
    /** Get the percentage of the current element that was scrolled */
    getVerticalScrollPercentage (el: HTMLElement): number
    /** Quickly sort a list of items */
    quickSort (items: [], ascending?: boolean): []
}
 
declare function useUrls(): {
    /** Reconcile a path to a root url */
    rebuildPath (path: string): string
    /** Reconcile a media path to a root backend media url. Useful for returning the full url of images, videos on the backend */
    mediaUrl (path: string): string
    /** Build an url for pagination on the backend */
    buildLimitOffset (url: string, limit?: number, offset?: number): string
    /** Returns page number as url parameters */
    getPageFromParams (url: string, page?: number): string
} 

/** Compasable for adding extra functionnalities to Vue */
export declare module index {
    return {
        useSocket,
        useUtilities,
        useUrls,
        loadView,
        loadLayout,
        loadComponent
    }
}