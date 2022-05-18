function listManager(items, item) {
    return new Promise((resolve, reject) => {
        if (!typeof items == 'array') {
            reject(items)
        }

        if (items.includes(item)) {
            var index = _.indexOf(items, item)
            items.splice(index, 1)
        } else {
            items.push(item)
        }
        resolve(items)
    })
}


var r = listManager([1, 2], 4)
console.log(r)
