import _ from 'lodash'

export default {
    methods: {
        getVerticalScrollPercentage(el) {
            // Get the percentage of the current
            // page that was scrolled by the user
            var parent = el.parentNode
            return (el.scrollTop || parent.scrollTop) / (parent.scrollHeight - parent.clientHeight) * 100
        },

        updateList(value, items) {
            if (items.includes(value)) {
                var itemIndex = _.indexOf(items, value)
                items.splice(itemIndex, 1)
            } else {
                items.push(value)
            }
            return items
        },

        scrollToTop() {
            window.scroll(0, 0)
        }
    }
}
