function capitalizeFirstLetter(value) {
    if (!value) { return value }
    return value.charAt(0).toUpperCase() + value.slice(1)
}
console.log(capitalizeFirstLetter('all'))
