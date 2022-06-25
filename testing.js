function mapToFields(products, mapping) {
    return products.map((product) => {
        var entries = Object.entries(mapping)
        var newItems = {}

        entries.forEach((entry) => {
            newItems[entry[1]] = product[entry[0]]
        })

        return newItems
    })
}

const result = mapToFields([{name: 'Name', 'price': 15}], {name: 'name', price: 'unit_price'})

console.log(result)
