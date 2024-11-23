export * from './footer'
export * from './company'

export function isNull<T>(item: T): boolean {
    let trueValue

    if (isRef(item)) {
        trueValue = item.value
    } else {
        trueValue = item
    }

    return (
        trueValue === null ||
        typeof trueValue === 'undefined' ||
        trueValue === '' ||
        trueValue === ' '
    )
}
